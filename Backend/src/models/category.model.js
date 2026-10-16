const prisma = require('../config/prismaClient');

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

async function findBySlug(slug) {
  return prisma.category.findUnique({ where: { slug } });
}

async function findTags(categoryId, search) {
  const questionFilter = { categoryId, isActive: true };
  return prisma.tag.findMany({
    where: {
      questions: { some: questionFilter },
      ...(search && { slug: { contains: search } }),
    },
    select: {
      slug: true,
      _count: { select: { questions: { where: questionFilter } } },
    },
    orderBy: { slug: 'asc' },
  });
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

module.exports = { findAll, findById, findByName, findBySlug, findTags, create, update, remove };