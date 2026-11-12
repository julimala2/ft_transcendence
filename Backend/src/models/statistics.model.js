const prisma = require('../../lib/prisma');

const COUNTED_STATUSES = ['finished', 'abandoned'];

function statsWhere({ categoryId, tagId, difficulty, mode, excludeUserId }) {
  const where = {
    mode: mode,
    status: { in: COUNTED_STATUSES },
  };

  if (categoryId === undefined) {
    where.categoryId = { not: null };
  } else {
    where.categoryId = categoryId;
  }

  if (tagId !== undefined) {
    where.tagId = tagId;
  }

  if (difficulty !== undefined) {
    where.difficulty = difficulty;
  }

  if (excludeUserId !== undefined) {
    where.userId = { not: excludeUserId };
  }

  return where;
}

async function findRushBestScores({ categoryId, tagId }) {
  return prisma.quizAttempt.groupBy({
    by: ['userId', 'categoryId'],
    where: statsWhere({ categoryId, tagId, mode: 'rush' }),
    _max: { score: true },
  });
}

async function findCustomAttempts({ categoryId, tagId }) {
  return prisma.quizAttempt.findMany({
    where: statsWhere({ categoryId, tagId, mode: 'custom' }),
    select: { userId: true, categoryId: true, difficulty: true, score: true, totalQuestions: true },
  });
}

function userStatsWhere({ userId, categoryId, mode }) {
  const where = {
    userId: userId,
    mode: mode,
    status: { in: COUNTED_STATUSES },
  };

  if (categoryId === undefined) {
    where.categoryId = { not: null };
  } else {
    where.categoryId = categoryId;
  }

  return where;
}

async function findUserRushRecords({ userId, categoryId }) {
  return prisma.quizAttempt.groupBy({
    by: ['categoryId', 'difficulty'],
    where: userStatsWhere({ userId, categoryId, mode: 'rush' }),
    _max: { score: true },
    _count: { _all: true },
  });
}

async function findUserCustomAttempts({ userId, categoryId }) {
  return prisma.quizAttempt.findMany({
    where: userStatsWhere({ userId, categoryId, mode: 'custom' }),
    select: { categoryId: true, difficulty: true, score: true, totalQuestions: true },
  });
}

async function findCategoriesByIds(ids) {
  return prisma.category.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true },
  });
}

async function findRushLeaderboard({ categoryId }) {
  return prisma.quizAttempt.groupBy({
    by: ['userId'],
    where: statsWhere({ categoryId: categoryId, mode: 'rush' }),
    _max: { score: true },
    orderBy: [{ _max: { score: 'desc' } }, { userId: 'asc' }],
  });
}

async function findUsersByIds(ids) {
  return prisma.user.findMany({
    where: { id: { in: ids } },
    select: { id: true, username: true, display_name: true, avatar_url: true },
  });
}

module.exports = { 
  findRushBestScores, 
  findCustomAttempts,
  findUserCustomAttempts,
  findUserRushRecords,
  findCategoriesByIds,
  findRushLeaderboard,
  findUsersByIds
};
