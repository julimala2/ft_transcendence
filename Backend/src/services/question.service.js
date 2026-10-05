const questionModel = require('../models/question.model');

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

const MAX_QUESTIONS_PER_QUIZ = 4;

async function getAllQuestions(filters) {
  return questionModel.findAll(filters);
}

async function getQuestionById(id) {
  const question = await questionModel.findById(id);
  if (!question) throw httpError(404, `Question ${id} introuvable`);
  return question;
}

async function createQuestion(data) {
  if (!Array.isArray(data.answers) || data.answers.length < 4 || data.answers.length > 4) {
    throw httpError(400, 'Une question doit avoir 4 réponses');
  }
  const hasCorrectAnswer = data.answers.some((a) => a.isCorrect === true);
  if (!hasCorrectAnswer) {
    throw httpError(400, 'Au moins une réponse doit être marquée correcte');
  }
  return questionModel.create(data);
}

async function updateQuestion(id, data) {
  await getQuestionById(id);
  return questionModel.update(id, data);
}

async function deleteQuestion(id) {
  await getQuestionById(id);
  return questionModel.remove(id);
}

module.exports = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
