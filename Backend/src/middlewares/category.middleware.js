function validateCategoryId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id invalide' });
  }
  req.categoryId = id;
  next();
}

function validateCategoryBody(req, res, next) {
  const { name } = req.body || {};
  if (typeof name !== 'string') {
    return res.status(400).json({ error: '"name" est requis et doit être du texte' });
  }
  next();
}

module.exports = { validateCategoryId, validateCategoryBody };