const prisma = require('../../lib/prisma');

const PUBLIC_SELECT = {
  id: true,
  type: true,
  difficulty: true,
  text: true,
  image: true,
  category: { select: { id: true, slug: true, name: true } },
  tags: { select: { slug: true } },
  answers: { select: { id: true, text: true, image: true } },
};

const FULL_INCLUDE = { answers: true, tags: true, category: true, image: true };

function tagsConnectOrCreate(tags) {
  return tags.map((slug) => ({ where: { slug }, create: { slug } }));
}

async function findAll(filters) {
  return prisma.question.findMany({
    where: {
      isActive: true,
      categoryId: filters.categoryId,
      difficulty: filters.difficulty,
      ...(filters.tag && { tags: { some: { slug: filters.tag } } }),
    },
    select: PUBLIC_SELECT,
    orderBy: { id: 'asc' },
    take: filters.limit,
    skip: filters.offset,
  });
}

async function findPublicById(id) {
  return prisma.question.findFirst({
    where: { id, isActive: true },
    select: PUBLIC_SELECT,
  });
}

async function findForOwnership(id) {
  return prisma.question.findUnique({
    where: { id },
    select: { id: true, authorId: true },
  });
}

async function create(data, authorId) {
  return prisma.question.create({
    data: {
      text: data.text,
      type: data.type,
      difficulty: data.difficulty,
      explanation: data.explanation,
      author: { connect: { id: authorId } },
      ...(data.categoryId !== null && { category: { connect: { id: data.categoryId } } }),
      tags: { connectOrCreate: tagsConnectOrCreate(data.tags) },
      answers: { create: data.answers },
    },
    include: FULL_INCLUDE,
  });
}

async function update(id, changes) {
  const data = {};

  if (changes.text !== undefined) data.text = changes.text;
  if (changes.difficulty !== undefined) data.difficulty = changes.difficulty;
  if (changes.explanation !== undefined) data.explanation = changes.explanation;
  if (changes.categoryId !== undefined) {
    data.category =
      changes.categoryId === null
        ? { disconnect: true }
        : { connect: { id: changes.categoryId } };
  }
  if (changes.tags !== undefined) {
    data.tags = { set: [], connectOrCreate: tagsConnectOrCreate(changes.tags) };
  }

  return prisma.question.update({
    where: { id },
    data,
    include: FULL_INCLUDE,
  });
}

async function remove(id) {
  return prisma.question.delete({ where: { id } });
}

module.exports = { PUBLIC_SELECT, findAll, findPublicById, findForOwnership, create, update, remove };