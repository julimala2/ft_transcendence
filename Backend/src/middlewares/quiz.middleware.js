function validateQuizId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id invalide' });
  }

  req.quizId = id;
  next();
}

function validateQuizBody(req, res, next) {
  const { title, description } = req.body || {};

  if (typeof title !== 'string') {
    return res.status(400).json({ error: '"title" est requis et doit être du texte' });
  }
  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({ error: '"description" doit être du texte' });
  }

  next();
}

module.exports = { validateQuizId, validateQuizBody };
