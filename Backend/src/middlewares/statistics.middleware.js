function validateStatsQuery(req, res, next) {
  const categoryId = req.query.categoryId;

  if (categoryId === undefined) {
    req.statsCategoryId = undefined;
    return next();
  }

  const number = Number(categoryId);

  if (!Number.isInteger(number) || number <= 0) {
    return res.status(400).json({ error: '"categoryId" invalide' });
  }

  req.statsCategoryId = number;
  next();
}

function validateStatsUserId(req, res, next) {
  const number = Number(req.params.id);

  if (!Number.isInteger(number) || number <= 0) {
    return res.status(400).json({ error: 'id invalide' });
  }

  req.statsUserId = number;
  next();
}

function validateLeaderboardQuery(req, res, next) {
  const { difficulty, limit } = req.query;

  if (difficulty !== undefined) {
    const number = Number(difficulty);

    if (!Number.isInteger(number) || number < 1 || number > 3) {
      return res.status(400).json({ error: '"difficulty" doit être 1, 2 ou 3' });
    }

    req.statsDifficulty = number;
  }

  req.statsLimit = undefined;

  if (limit !== undefined) {
    const number = Number(limit);

    if (!Number.isInteger(number) || number < 1) {
      return res.status(400).json({ error: '"limit" doit être supérieur ou égal à 1' });
    }

    req.statsLimit = number;
  }

  next();
}

module.exports = { validateStatsQuery, validateStatsUserId, validateLeaderboardQuery };
