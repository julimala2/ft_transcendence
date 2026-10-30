const quizService = require('../services/quiz.service');

function sendError(res, err) {
  const status = err.statusCode || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: status === 500 ? 'Erreur interne du serveur' : err.message });
}

async function getAll(req, res) {
  try {
    const quizzes = await quizService.getAllQuizzes(req.user.id, req.filters);
    res.json(quizzes);
  } catch (err) {
    sendError(res, err);
  }
}

async function getById(req, res) {
  try {
    const quiz = await quizService.getQuizById(req.quizId, req.user.id);
    res.json(quiz);
  } catch (err) {
    sendError(res, err);
  }
}

async function create(req, res) {
  try {
    const quiz = await quizService.createQuiz(req.body, req.user.id);
    res.status(201).json(quiz);
  } catch (err) {
    sendError(res, err);
  }
}

async function update(req, res) {
  try {
    const quiz = await quizService.updateQuiz(req.quizId, req.body, req.user.id);
    res.json(quiz);
  } catch (err) {
    sendError(res, err);
  }
}

async function remove(req, res) {
  try {
    await quizService.deleteQuiz(req.quizId, req.user.id);
    res.status(204).send();
  } catch (err) {
    sendError(res, err);
  }
}

async function addQuestion(req, res) {
  try {
    const quiz = await quizService.addQuestionToQuiz(req.quizId, req.body.questionId, req.user.id);
    res.status(201).json(quiz);
  } catch (err) {
    sendError(res, err);
  }
}

async function removeQuestion(req, res) {
  try {
    await quizService.removeQuestionFromQuiz(req.quizId, req.questionId, req.user.id);
    res.status(204).send();
  } catch (err) {
    sendError(res, err);
  }
}

module.exports = { getAll, getById, create, update, remove, addQuestion, removeQuestion };