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

function validateTagsQuery(req, res, next) {
  const { search } = req.query;
  if (search !== undefined) {
    if (typeof search !== 'string' || search.length > 50) {
      return res.status(400).json({ error: '"search" doit être un texte de 50 caractères maximum' });
    }
  }
  req.search = search ? search.trim().toLowerCase() : undefined;
  next();
}

function validateQuestionDifficulty(req, res, next) {
  const difficulty = Number(req.params.difficulty);
  if (!Number.isInteger(difficulty) || difficulty < 1 || difficulty > 3) {
    return res.status(400).json({ error: 'Error : Question difficulty must be 1, 2 or 3' });
  }
  next();
}

module.exports = { validateCategoryId, validateCategoryBody, validateTagsQuery, validateQuestionDifficulty };