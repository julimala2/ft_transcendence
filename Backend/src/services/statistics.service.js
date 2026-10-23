const statsModel = require('../models/statistics.model');
const blocksModel = require('../models/blocks.model');
const userModel = require('../models/user.model');


function formatRushRows(rushRows) {
  const result = [];

  for (const row of rushRows) {
    const line = {
      categoryId: row.categoryId,
      difficulty: row.difficulty,
      record: row._max.score,
      played: row._count._all,
    };
    result.push(line);
  }

  return result;
}

function computeCustomAverages(customRows) {
  const groups = {};

  for (const row of customRows) {
    if (row.totalQuestions === 0) {
      continue;
    }

    const percent = (row.score / row.totalQuestions) * 100;
    const key = row.categoryId + '-' + row.difficulty;

    if (groups[key] === undefined) {
      groups[key] = {
        categoryId: row.categoryId,
        difficulty: row.difficulty,
        totalPercent: 0,
        played: 0,
      };
    }

    groups[key].totalPercent = groups[key].totalPercent + percent;
    groups[key].played = groups[key].played + 1;
  }

  const result = [];

  for (const key in groups) {
    const group = groups[key];
    const average = group.totalPercent / group.played;

    const line = {
      categoryId: group.categoryId,
      difficulty: group.difficulty,
      averagePercent: Math.round(average),
      played: group.played,
    };
    result.push(line);
  }

  return result;
}

function collectCategoryIds(rush, custom) {
  const ids = [];

  for (const line of rush) {
    if (!ids.includes(line.categoryId)) {
      ids.push(line.categoryId);
    }
  }
  for (const line of custom) {
    if (!ids.includes(line.categoryId)) {
      ids.push(line.categoryId);
    }
  }

  return ids;
}

async function findCategoryNames(categoryIds) {
  const categories = await statsModel.findCategoriesByIds(categoryIds);

  const names = {};
  for (const category of categories) {
    names[category.id] = category.name;
  }

  return names;
}

function computeRushAverages(rushRows) {
  const groups = {};

  for (const row of rushRows) {
    const key = row.categoryId + '-' + row.difficulty;

    if (groups[key] === undefined) {
      groups[key] = {
        categoryId: row.categoryId,
        difficulty: row.difficulty,
        totalRecords: 0,
        players: 0,
      };
    }

    groups[key].totalRecords = groups[key].totalRecords + row._max.score;
    groups[key].players = groups[key].players + 1;
  }

  const result = [];

  for (const key in groups) {
    const group = groups[key];
    const average = group.totalRecords / group.players;

    const line = {
      categoryId: group.categoryId,
      difficulty: group.difficulty,
      averageRecord: Math.round(average * 10) / 10,
      players: group.players,
    };
    result.push(line);
  }

  return result;
}

async function buildResponse(categoryId, rush, custom) {
  const categoryIds = collectCategoryIds(rush, custom);
  const names = await findCategoryNames(categoryIds);

  for (const line of rush) {
    line.category = names[line.categoryId];
  }
  for (const line of custom) {
    line.category = names[line.categoryId];
  }

  let selectedCategory = null;
  if (categoryId !== undefined) {
    selectedCategory = categoryId;
  }

  return {
    categoryId: selectedCategory,
    rush: rush,
    custom: custom,
  };
}

async function getUserStats(userId, categoryId) {
  const rushRows = await statsModel.findUserRushRecords({ userId: userId, categoryId: categoryId });
  const customRows = await statsModel.findUserCustomAttempts({ userId: userId, categoryId: categoryId });

  const rush = formatRushRows(rushRows);
  const custom = computeCustomAverages(customRows);

  return buildResponse(categoryId, rush, custom);
}

async function getOtherUserStats(currentUserId, userId, categoryId) {
  const exists = await userModel.userExists(userId);
  if (!exists) {
    return null;
  }

  const block = await blocksModel.findBetween(currentUserId, userId);
  if (block) {
    return null;
  }

  return getUserStats(userId, categoryId);
}

async function getGlobalStats(currentUserId, categoryId) {
  const rushRows = await statsModel.findRushBestScores({ categoryId: categoryId, excludeUserId: currentUserId });
  const customRows = await statsModel.findCustomAttempts({ categoryId: categoryId });

  const rush = computeRushAverages(rushRows);
  const custom = computeCustomAverages(customRows);

  return buildResponse(categoryId, rush, custom);
}

module.exports = { getUserStats, getOtherUserStats, getGlobalStats };

