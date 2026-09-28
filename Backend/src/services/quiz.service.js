const quizModel = require('../models/quiz.model');

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function getAllQuizzes() {
  return quizModel.findAll();
}

async function getQuizById(id) {
  const quiz = await quizModel.findById(id);
  if (!quiz) throw httpError(404, `Quiz ${id} introuvable`);
  return quiz;
}

async function createQuiz({ title, description }) {
  const cleanTitle = title.trim();
  if (cleanTitle.length === 0) {
    throw httpError(400, 'Le titre ne peut pas être vide');
  }
  return quizModel.create({
    title: cleanTitle,
    description: description ?? null,
  });
}

async function updateQuiz(id, { title, description }) {
  await getQuizById(id);
  const cleanTitle = title.trim();
  if (cleanTitle.length === 0) {
    throw httpError(400, 'Le titre ne peut pas être vide');
  }
  return quizModel.update(id, { title: cleanTitle, description });
}

async function deleteQuiz(id) {
  await getQuizById(id);
  return quizModel.remove(id);
}

module.exports = {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
};