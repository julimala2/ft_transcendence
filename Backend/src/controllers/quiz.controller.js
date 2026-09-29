const quizService = require('../services/quiz.service');

function sendError(res, err) {
  const status = err.statusCode || 500;
  if (status === 500) console.error(err);
  const message = status === 500 ? 'Erreur interne du serveur' : err.message;
  res.status(status).json({ error: message });
}

async function getAll(req, res) {
  try {
    const quizzes = await quizService.getAllQuizzes();
    res.json(quizzes);
  } catch (err) {
    sendError(res, err);
  }
}

async function getById(req, res) {
  try {
    const quiz = await quizService.getQuizById(req.quizId);
    res.json(quiz);
  } catch (err) {
    sendError(res, err);
  }
}

async function create(req, res) {
  try {
    const quiz = await quizService.createQuiz(req.body);
    res.status(201).json(quiz);
  } catch (err) {
    sendError(res, err);
  }
}

async function update(req, res) {
  try {
    const quiz = await quizService.updateQuiz(req.quizId, req.body);
    res.json(quiz);
  } catch (err) {
    sendError(res, err);
  }
}

async function remove(req, res) {
  try {
    await quizService.deleteQuiz(req.quizId);
    res.status(204).send();
  } catch (err) {
    sendError(res, err);
  }
}

module.exports = { getAll, getById, create, update, remove };