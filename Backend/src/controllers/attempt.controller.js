const attemptService = require('../services/attempt.service');

function sendError(res, err) {
  const status = err.statusCode || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: status === 500 ? 'Erreur interne du serveur' : err.message });
}

async function start(req, res) {
  try {
    const attempt = await attemptService.startAttempt(req.user.id, req.startParams);
    res.status(201).json(attempt);
  } catch (err) {
    sendError(res, err);
  }
}

async function getOne(req, res) {
  try {
    const attempt = await attemptService.getAttempt(req.attemptId, req.user.id);
    res.json(attempt);
  } catch (err) {
    sendError(res, err);
  }
}

async function answer(req, res) {
  try {
    const result = await attemptService.answerAttempt(req.attemptId, req.user.id, req.body.answerId);
    res.json(result);
  } catch (err) {
    sendError(res, err);
  }
}

module.exports = { start, getOne, answer };
