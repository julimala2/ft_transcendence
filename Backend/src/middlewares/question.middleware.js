function validateQuestionId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id invalide' });
  }
  req.questionId = id;
  next();
}

function validateQuestionBody(req, res, next) {
  const { text, quizId, categoryId } = req.body || {};

  if (typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: '"text" est requis' });
  }
  if (!Number.isInteger(quizId)) {
    return res.status(400).json({ error: '"quizId" doit être un entier' });
  }
  if (!Number.isInteger(categoryId)) {
    return res.status(400).json({ error: '"categoryId" doit être un entier' });
  }

  next();
}

module.exports = { validateQuestionId, validateQuestionBody };
