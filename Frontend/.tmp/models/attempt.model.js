const prisma = require('../../lib/prisma');
const { PUBLIC_SELECT } = require('./question.model');

function remainingQuestions(attemptId) {
  return {
    attemptId,
    question: { userAnswers: { none: { attemptId } } },
  };
}

async function findTagBySlug(slug) {
  return prisma.tag.findUnique({ where: { slug } });
}

async function findActiveQuestionIds({ categoryId, tagId, difficulty }) {
  const questions = await prisma.question.findMany({
    where: {
      isActive: true,
      categoryId,
      difficulty,
      ...(tagId !== undefined && { tags: { some: { id: tagId } } }),
    },
    select: { id: true },
  });
  return questions.map((q) => q.id);
}

async function findQuizQuestionIds(quizId) {
  const rows = await prisma.quizQuestion.findMany({
    where: { quizId, question: { isActive: true } },
    orderBy: { position: 'asc' },
    select: { questionId: true },
  });
  return rows.map((r) => r.questionId);
}

async function createAttempt({ userId, quizId, categoryId, tagId, difficulty, questionIds }) {
  return prisma.quizAttempt.create({
    data: {
      userId,
      quizId,
      categoryId,
      tagId,
      difficulty,
      totalQuestions: questionIds.length,
      questions: {
        create: questionIds.map((questionId, index) => ({ questionId, position: index + 1 })),
      },
    },
    select: { id: true, totalQuestions: true },
  });
}

async function findAttempt(id) {
  return prisma.quizAttempt.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      score: true,
      totalQuestions: true,
      finishedAt: true,
      _count: { select: { userAnswers: true } },
    },
  });
}

async function findCurrentPublic(attemptId) {
  return prisma.attemptQuestion.findFirst({
    where: remainingQuestions(attemptId),
    orderBy: { position: 'asc' },
    select: { position: true, question: { select: PUBLIC_SELECT } },
  });
}

async function findCurrentForVerdict(attemptId) {
  return prisma.attemptQuestion.findFirst({
    where: remainingQuestions(attemptId),
    orderBy: { position: 'asc' },
    select: {
      position: true,
      question: {
        select: {
          id: true,
          explanation: true,
          answers: { select: { id: true, isCorrect: true } },
        },
      },
    },
  });
}

async function recordAnswer({ attemptId, questionId, answerId, isCorrect }) {
  return prisma.$transaction([
    prisma.userAnswer.create({
      data: { attemptId, questionId, answerId, isCorrect },
    }),
    prisma.quizAttempt.update({
      where: { id: attemptId },
      data: { score: { increment: isCorrect ? 1 : 0 } },
      select: { score: true },
    }),
  ]);
}

async function markFinished(attemptId) {
  return prisma.quizAttempt.update({
    where: { id: attemptId },
    data: { finishedAt: new Date() },
    select: { score: true, totalQuestions: true },
  });
}

module.exports = {
  findTagBySlug,
  findActiveQuestionIds,
  findQuizQuestionIds,
  createAttempt,
  findAttempt,
  findCurrentPublic,
  findCurrentForVerdict,
  recordAnswer,
  markFinished,
};
