const questionService = require('../services/question.service');

function sendError(res, err) {
  const status = err.statusCode || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: status === 500 ? 'Erreur interne du serveur' : err.message });
}

async function getAll(req, res) {
  try {
    const filters = {
      quizId: req.query.quizId ? Number(req.query.quizId) : undefined,
      categoryId: req.query.categoryId ? Number(req.query.categoryId) : undefined,
    };
    const questions = await questionService.getAllQuestions(filters);
    res.json(questions);
  } catch (err) {
    sendError(res, err);
  }
}

async function getById(req, res) {
  try {
    const question = await questionService.getQuestionById(req.questionId);
    res.json(question);
  } catch (err) {
    sendError(res, err);
  }
}

async function create(req, res) {
  try {
    const question = await questionService.createQuestion(req.body);
    res.status(201).json(question);
  } catch (err) {
    sendError(res, err);
  }
}

async function update(req, res) {
  try {
    const question = await questionService.updateQuestion(req.questionId, req.body);
    res.json(question);
  } catch (err) {
    sendError(res, err);
  }
}

async function remove(req, res) {
  try {
    await questionService.deleteQuestion(req.questionId);
    res.status(204).send();
  } catch (err) {
    sendError(res, err);
  }
}

module.exports = { getAll, getById, create, update, remove };
