const { MODE } = require('../models/attempt.model');

const PLAYABLE_MODES = [MODE.CLASSIC, MODE.RUSH];

function isPositiveInt(value) {
  return Number.isInteger(value) && value > 0;
}

function validateAttemptId(req, res, next) {
  const id = Number(req.params.id);
  if (!isPositiveInt(id)) {
    return res.status(400).json({ error: 'id invalide' });
  }
  req.attemptId = id;
  next();
}

function validateStartBody(req, res, next) {
  const { quizId, categoryId, tag, difficulty, count, mode } = req.body || {};

  const hasQuiz = quizId !== undefined;
  const hasCategory = categoryId !== undefined;

  if (hasQuiz === hasCategory) {
    return res.status(400).json({ error: 'Envoyez soit "quizId", soit "categoryId" (pas les deux)' });
  }
  if (hasQuiz && !isPositiveInt(quizId)) {
    return res.status(400).json({ error: '"quizId" doit être un entier positif' });
  }
  if (hasCategory && !isPositiveInt(categoryId)) {
    return res.status(400).json({ error: '"categoryId" doit être un entier positif' });
  }
  if (hasQuiz && (tag !== undefined || difficulty !== undefined || count !== undefined)) {
    return res.status(400).json({
      error: '"tag", "difficulty" et "count" ne s\'appliquent qu\'à une partie générée (avec "categoryId")',
    });
  }
  if (hasQuiz && mode !== undefined) {
    return res.status(400).json({
      error: '"mode" ne s\'applique qu\'à une partie générée : une partie sur un quiz est toujours en mode "custom"',
    });
  }
  if (mode !== undefined && !PLAYABLE_MODES.includes(mode)) {
    return res.status(400).json({ error: `"mode" doit valoir : ${PLAYABLE_MODES.join(' ou ')}` });
  }
  if (tag !== undefined && (typeof tag !== 'string' || tag.trim().length === 0)) {
    return res.status(400).json({ error: '"tag" doit être un texte non vide' });
  }
  if (difficulty !== undefined && (!Number.isInteger(difficulty) || difficulty < 1 || difficulty > 3)) {
    return res.status(400).json({ error: '"difficulty" doit être 1, 2 ou 3' });
  }
  if (count !== undefined && (!Number.isInteger(count) || count < 1 || count > 50)) {
    return res.status(400).json({ error: '"count" doit être un entier entre 1 et 50' });
  }
  if (mode === MODE.RUSH) {
    if (tag === undefined) {
      return res.status(400).json({ error: 'Le mode "rush" exige un "tag" (la sous-catégorie à jouer en entier)' });
    }
    if (difficulty !== undefined || count !== undefined) {
      return res.status(400).json({
        error: 'Le mode "rush" joue toutes les questions du tag : "difficulty" et "count" ne sont pas acceptés',
      });
    }
  }

  req.startParams = {
    quizId,
    categoryId,
    mode,
    tag: tag === undefined ? undefined : tag.trim().toLowerCase(),
    difficulty,
    count,
  };
  next();
}

function validateAnswerBody(req, res, next) {
  const { answerId } = req.body || {};
  if (!isPositiveInt(answerId)) {
    return res.status(400).json({ error: '"answerId" doit être un entier positif' });
  }
  next();
}

module.exports = { validateAttemptId, validateStartBody, validateAnswerBody };