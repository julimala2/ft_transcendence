function validateQuizId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id invalide' });
  }
  req.quizId = id;
  next();
}

function validateQuestionParam(req, res, next) {
  const id = Number(req.params.questionId);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'questionId invalide' });
  }
  req.questionId = id;
  next();
}

function validateListQuery(req, res, next) {
  const { mine } = req.query;
  if (mine !== undefined && mine !== 'true' && mine !== 'false') {
    return res.status(400).json({ error: '"mine" doit valoir true ou false' });
  }
  req.filters = { mine: mine === 'true' };
  next();
}

function validateCreateBody(req, res, next) {
  const { title } = req.body || {};
  if (typeof title !== 'string') {
    return res.status(400).json({ error: '"title" est requis' });
  }
  next();
}

function validateUpdateBody(req, res, next) {
  const body = req.body;
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return res.status(400).json({ error: 'Corps de requête JSON invalide' });
  }
  next();
}

function validateAddQuestionBody(req, res, next) {
  const { questionId } = req.body || {};
  if (!Number.isInteger(questionId) || questionId <= 0) {
    return res.status(400).json({ error: '"questionId" doit être un entier positif' });
  }
  next();
}

module.exports = {
  validateQuizId,
  validateQuestionParam,
  validateListQuery,
  validateCreateBody,
  validateUpdateBody,
  validateAddQuestionBody,
};