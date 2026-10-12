const prisma = require('../../lib/prisma');

async function findAll(filters) {
  return prisma.question.findMany({
    where: {
      quizId: filters.quizId,
      categoryId: filters.categoryId,
    },
    include: { answers: true, category: true },
  });
}

async function findById(id) {
  return prisma.question.findUnique({
    where: { id },
    include: { answers: true, category: true, quiz: true },
  });
}

async function countByQuiz(quizId) {
  return prisma.question.count({ where: { quizId } });
}

async function create(data) {
  return prisma.question.create({
    data: {
      text: data.text,
      difficulty: data.difficulty,
      quiz: { connect: { id: data.quizId } },
      category: { connect: { id: data.categoryId } },
      answers: {
        create: data.answers.map((a) => ({ text: a.text, isCorrect: a.isCorrect })),
      },
    },
    include: { answers: true },
  });
}

async function update(id, data) {
  return prisma.question.update({
    where: { id },
    data: {
      text: data.text,
      difficulty: data.difficulty,
      categoryId: data.categoryId,
    },
    include: { answers: true },
  });
}

async function remove(id) {
  return prisma.question.delete({ where: { id } });
}

module.exports = { findAll, findById, create, update, remove, countByQuiz };
