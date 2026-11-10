function validateQuestionId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id invalide' });
  }
  req.questionId = id;
  next();
}

function parseIntParam(value, name, { min, max, fallback }) {
  if (value === undefined) return { value: fallback };
  const number = Number(value);
  if (typeof value !== 'string' || !Number.isInteger(number) || number < min || number > max) {
    return { error: `"${name}" invalide (entier entre ${min} et ${max})` };
  }
  return { value: number };
}

function validateListQuery(req, res, next) {
  const { tag } = req.query;

  const categoryId = parseIntParam(req.query.categoryId, 'categoryId', {
    min: 1, max: Number.MAX_SAFE_INTEGER, fallback: undefined,
  });
  const difficulty = parseIntParam(req.query.difficulty, 'difficulty', {
    min: 1, max: 3, fallback: undefined,
  });
  const limit = parseIntParam(req.query.limit, 'limit', { min: 1, max: 100, fallback: 50 });
  const offset = parseIntParam(req.query.offset, 'offset', {
    min: 0, max: Number.MAX_SAFE_INTEGER, fallback: 0,
  });

  const failed = [categoryId, difficulty, limit, offset].find((r) => r.error);
  if (failed) return res.status(400).json({ error: failed.error });

  if (tag !== undefined && typeof tag !== 'string') {
    return res.status(400).json({ error: '"tag" invalide' });
  }

  req.filters = {
    categoryId: categoryId.value,
    difficulty: difficulty.value,
    tag: tag ? tag.trim().toLowerCase() : undefined,
    limit: limit.value,
    offset: offset.value,
  };
  next();
}

function validateCreateBody(req, res, next) {
  const { text, answers } = req.body || {};
  if (typeof text !== 'string') {
    return res.status(400).json({ error: '"text" est requis' });
  }
  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: '"answers" est requis (tableau)' });
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

module.exports = {
  validateQuestionId,
  validateListQuery,
  validateCreateBody,
  validateUpdateBody,
};