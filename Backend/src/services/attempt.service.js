const attemptModel = require('../models/attempt.model');
const quizModel = require('../models/quiz.model');
const categoryModel = require('../models/category.model');
const quizService = require('./quiz.service');
const achievementsService = require('./achievements.service');

const { STATUS } = attemptModel;
const DEFAULT_QUESTION_COUNT = 20;

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function endedError(status) {
  return httpError(
    409,
    status === STATUS.ABANDONED ? 'Cette partie a été abandonnée' : 'Cette partie est déjà terminée'
  );
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatQuestion(current) {
  return current ? { position: current.position, ...current.question } : null;
}

async function getOwnedAttempt(id, userId) {
  const attempt = await attemptModel.findAttempt(id);
  if (!attempt || attempt.userId !== userId) {
    throw httpError(404, `Partie ${id} introuvable`);
  }
  return attempt;
}

async function startAttempt(userId, params) {
  let questionIds;
  let links = { quizId: null, categoryId: null, tagId: null, difficulty: null };

  if (params.quizId !== undefined) {
    const quiz = await quizModel.findMeta(params.quizId);
    if (!quiz || !(await quizService.canView(quiz, userId))) {
      throw httpError(404, `Quiz ${params.quizId} introuvable`);
    }
    questionIds = await attemptModel.findQuizQuestionIds(quiz.id);
    if (questionIds.length === 0) {
      throw httpError(400, 'Ce quiz ne contient aucune question');
    }
    links.quizId = quiz.id;
  } else {
    const category = await categoryModel.findById(params.categoryId);
    if (!category) throw httpError(404, `Catégorie ${params.categoryId} introuvable`);

    let tagId;
    if (params.tag !== undefined) {
      const tag = await attemptModel.findTagBySlug(params.tag);
      if (!tag) throw httpError(404, `Tag "${params.tag}" introuvable`);
      tagId = tag.id;
    }

    const count = params.count ?? DEFAULT_QUESTION_COUNT;
    const available = await attemptModel.findActiveQuestionIds({
      categoryId: category.id,
      tagId,
      difficulty: params.difficulty,
    });
    if (available.length < count) {
      throw httpError(
        400,
        `Pas assez de questions : ${available.length} disponible(s) pour ${count} demandée(s)`
      );
    }

    questionIds = shuffle(available).slice(0, count);
    links = {
      quizId: null,
      categoryId: category.id,
      tagId: tagId ?? null,
      difficulty: params.difficulty ?? null,
    };
  }

  await attemptModel.abandonInProgress(userId);
  const attempt = await attemptModel.createAttempt({ userId, ...links, questionIds });
  const current = await attemptModel.findCurrentPublic(attempt.id);

  return {
    id: attempt.id,
    status: STATUS.IN_PROGRESS,
    total: attempt.totalQuestions,
    answered: 0,
    score: 0,
    finished: false,
    question: formatQuestion(current),
  };
}

async function getAttempt(id, userId) {
  const attempt = await getOwnedAttempt(id, userId);
  const inProgress = attempt.status === STATUS.IN_PROGRESS;
  const current = inProgress ? await attemptModel.findCurrentPublic(id) : null;

  return {
    id: attempt.id,
    status: attempt.status,
    total: attempt.totalQuestions,
    answered: attempt._count.userAnswers,
    score: attempt.score,
    finished: attempt.status === STATUS.FINISHED,
    question: formatQuestion(current),
  };
}

async function answerAttempt(id, userId, answerId) {
  const attempt = await getOwnedAttempt(id, userId);
  if (attempt.status !== STATUS.IN_PROGRESS) {
    throw endedError(attempt.status);
  }

  const current = await attemptModel.findCurrentForVerdict(id);
  if (!current) {
    await attemptModel.markFinished(id);
    throw endedError(STATUS.FINISHED);
  }

  const { question } = current;
  const chosen = question.answers.find((a) => a.id === answerId);
  if (!chosen) {
    throw httpError(400, "Cette proposition n'appartient pas à la question en cours");
  }
  const correct = question.answers.find((a) => a.isCorrect);

  let recorded;
  try {
    recorded = await attemptModel.recordAnswer({
      attemptId: id,
      questionId: question.id,
      answerId: chosen.id,
      isCorrect: chosen.isCorrect,
    });
  } catch (err) {
    if (err.code === 'P2002') {
      throw httpError(409, 'Cette question a déjà reçu une réponse');
    }
    throw err;
  }

  const score = recorded[1].score;
  const next = await attemptModel.findCurrentPublic(id);
  let newBadges = [];
  if (!next) {
    await attemptModel.markFinished(id);
    newBadges = await achievementsService.checkAchievements(id);
  }

  return {
    isCorrect: chosen.isCorrect,
    correctAnswerId: correct ? correct.id : null,
    explanation: question.explanation,
    status: next ? STATUS.IN_PROGRESS : STATUS.FINISHED,
    answered: attempt._count.userAnswers + 1,
    score,
    total: attempt.totalQuestions,
    finished: !next,
    next: formatQuestion(next),
    newBadges,
  };
}

async function abandonAttempt(id, userId) {
  const attempt = await getOwnedAttempt(id, userId);
  if (attempt.status === STATUS.FINISHED) {
    throw endedError(STATUS.FINISHED);
  }
  if (attempt.status === STATUS.IN_PROGRESS) {
    await attemptModel.markAbandoned(id);
  }

  return {
    id: attempt.id,
    status: STATUS.ABANDONED,
    total: attempt.totalQuestions,
    answered: attempt._count.userAnswers,
    score: attempt.score,
  };
}

module.exports = { startAttempt, getAttempt, answerAttempt, abandonAttempt };