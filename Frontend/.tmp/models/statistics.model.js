const prisma = require('../../lib/prisma');

const COUNTED_STATUSES = ['finished', 'abandoned'];

function statsWhere({ categoryId, tagId, mode }) {
  return {
    categoryId,
    mode,
    status: { in: COUNTED_STATUSES },
    difficulty: { not: null },
    ...(tagId !== undefined && { tagId }),
  };
}

async function findRushBestScores({ categoryId, tagId }) {
  return prisma.quizAttempt.groupBy({
    by: ['userId', 'difficulty'],
    where: statsWhere({ categoryId, tagId, mode: 'rush' }),
    _max: { score: true },
    _count: { _all: true },
  });
}

async function findLimiteAttempts({ categoryId, tagId }) {
  return prisma.quizAttempt.findMany({
    where: statsWhere({ categoryId, tagId, mode: 'limite' }),
    select: { userId: true, difficulty: true, score: true, totalQuestions: true },
  });
}

module.exports = { findRushBestScores, findLimiteAttempts };
