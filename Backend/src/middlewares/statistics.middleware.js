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

module.exports = { validateStatsQuery, validateStatsUserId };
