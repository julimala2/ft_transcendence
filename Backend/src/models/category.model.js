const prisma = require('../../lib/prisma');

async function findAll() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { questions: true } } },
  });
}

async function findById(id) {
  return prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { questions: true } } },
  });
}

async function findByName(name) {
  return prisma.category.findUnique({ where: { name } });
}

async function create(data) {
  return prisma.category.create({ data });
}

async function update(id, data) {
  return prisma.category.update({ where: { id }, data });
}

async function remove(id) {
  return prisma.category.delete({ where: { id } });
}

module.exports = { findAll, findById, findByName, create, update, remove };