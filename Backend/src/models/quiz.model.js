const prisma = require('../config/prismaClient');

async function findAll() {
  return prisma.quiz.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { questions: true } } },
  });
}

async function findById(id) {
  return prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: { include: { answers: true } },
    },
  });
}

async function create(data) {
  return prisma.quiz.create({ data });
}

async function update(id, data) {
  return prisma.quiz.update({ where: { id }, data });
}

async function remove(id) {
  return prisma.quiz.delete({ where: { id } });
}

module.exports = { findAll, findById, create, update, remove };
