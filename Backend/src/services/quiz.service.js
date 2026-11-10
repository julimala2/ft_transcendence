const quizModel = require('../models/quiz.model');
const questionModel = require('../models/question.model');
const friendModel = require('../models/friends.model');
const { notifyUser } = require('./notifications.service');

const VISIBILITIES = ['public', 'friends', 'private'];

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function cleanTitle(title) {
  if (typeof title !== 'string' || title.trim().length === 0) {
    throw httpError(400, '"title" doit être un texte non vide');
  }
  return title.trim();
}

function cleanDescription(description) {
  if (description === null) return null;
  if (typeof description !== 'string') {
    throw httpError(400, '"description" doit être un texte ou null');
  }
  const trimmed = description.trim();
  return trimmed.length === 0 ? null : trimmed;
}

function checkVisibility(visibility) {
  if (!VISIBILITIES.includes(visibility)) {
    throw httpError(400, `"visibility" doit valoir : ${VISIBILITIES.join(', ')}`);
  }
  return visibility;
}

async function canView(quiz, userId) {
  if (quiz.ownerId === userId) return true;
  if (quiz.visibility === 'public') return true;
  if (quiz.visibility === 'friends' && quiz.ownerId !== null) {
    return quizModel.areFriends(userId, quiz.ownerId);
  }
  return false;
}

async function getOwnedQuiz(id, userId) {
  const quiz = await quizModel.findMeta(id);
  if (!quiz || !(await canView(quiz, userId))) {
    throw httpError(404, `Quiz ${id} introuvable`);
  }
  if (quiz.ownerId !== userId) {
    throw httpError(403, "Vous n'êtes pas le propriétaire de ce quiz");
  }
  return quiz;
}

async function getAllQuizzes(userId, filters) {
  return quizModel.findAllVisible(userId, filters);
}

async function getQuizById(id, userId) {
  const quiz = await quizModel.findById(id);
  if (!quiz || !(await canView(quiz, userId))) {
    throw httpError(404, `Quiz ${id} introuvable`);
  }
  const { questions, ...rest } = quiz;
  return {
    ...rest,
    questions: questions.map(({ position, question }) => ({ position, ...question })),
  };
}

async function notifyFriendsOfNewQuiz(quiz, userId) {
  if (quiz.visibility === 'private') {
    return;
  }

  const friendships = await friendModel.findFriends(userId);

  for (const friendship of friendships) {
    let friendId = friendship.requester_id;
    if (friendship.requester_id === userId) {
      friendId = friendship.addressee_id;
    }

    await notifyUser(friendId, 'friend_quiz', `${quiz.owner.username} a publié le quiz « ${quiz.title} »`);
  }
}

async function createQuiz(data, userId) {
  const quiz = await quizModel.create(
    {
      title: cleanTitle(data.title),
      description: data.description === undefined ? null : cleanDescription(data.description),
      visibility: checkVisibility(data.visibility ?? 'private'),
    },
    userId
  );

  await notifyFriendsOfNewQuiz(quiz, userId);

  return quiz;
}

async function updateQuiz(id, data, userId) {
  const before = await getOwnedQuiz(id, userId);

  const changes = {};
  if (data.title !== undefined) changes.title = cleanTitle(data.title);
  if (data.description !== undefined) changes.description = cleanDescription(data.description);
  if (data.visibility !== undefined) changes.visibility = checkVisibility(data.visibility);

  if (Object.keys(changes).length === 0) {
    throw httpError(400, 'Aucun champ modifiable fourni (title, description, visibility)');
  }

  const quiz = await quizModel.update(id, changes);

  if (before.visibility === 'private' && quiz.visibility !== 'private') {
    await notifyFriendsOfNewQuiz(quiz, userId);
  }

  return quiz;
}

async function deleteQuiz(id, userId) {
  await getOwnedQuiz(id, userId);
  return quizModel.remove(id);
}

async function addQuestionToQuiz(id, questionId, userId) {
  await getOwnedQuiz(id, userId);

  const question = await questionModel.findPublicById(questionId);
  if (!question) throw httpError(404, `Question ${questionId} introuvable`);

  if (await quizModel.findQuizQuestion(id, questionId)) {
    throw httpError(409, 'Cette question est déjà dans ce quiz');
  }

  try {
    await quizModel.addQuestion(id, questionId);
  } catch (err) {
    if (err.code === 'P2002') {
      throw httpError(409, 'Conflit lors de l\'ajout, réessayez');
    }
    throw err;
  }
  return getQuizById(id, userId);
}

async function removeQuestionFromQuiz(id, questionId, userId) {
  await getOwnedQuiz(id, userId);

  if (!(await quizModel.findQuizQuestion(id, questionId))) {
    throw httpError(404, "Cette question n'est pas dans ce quiz");
  }
  return quizModel.removeQuestion(id, questionId);
}

module.exports = {
  canView,
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  addQuestionToQuiz,
  removeQuestionFromQuiz,
};