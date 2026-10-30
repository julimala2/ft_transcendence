const prisma = require('../../lib/prisma');
const { PUBLIC_SELECT } = require('./question.model');

const OWNER_SELECT = {
  select: { id: true, username: true, display_name: true, avatar_url: true },
};

const LIST_SELECT = {
  id: true,
  title: true,
  description: true,
  visibility: true,
  createdAt: true,
  owner: OWNER_SELECT,
  _count: { select: { questions: true } },
};

async function findAllVisible(userId, { mine }) {
  const where = mine
    ? { ownerId: userId }
    : {
        OR: [
          { visibility: 'public' },
          { ownerId: userId },
          {
            visibility: 'friends',
            owner: {
              OR: [
                { sentFriendRequests: { some: { addressee_id: userId, status: 'accepted' } } },
                { receivedFriendRequests: { some: { requester_id: userId, status: 'accepted' } } },
              ],
            },
          },
        ],
      };

  return prisma.quiz.findMany({
    where,
    select: LIST_SELECT,
    orderBy: { createdAt: 'desc' },
  });
}

async function findById(id) {
  return prisma.quiz.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      visibility: true,
      createdAt: true,
      ownerId: true,
      owner: OWNER_SELECT,
      questions: {
        where: { question: { isActive: true } },
        orderBy: { position: 'asc' },
        select: { position: true, question: { select: PUBLIC_SELECT } },
      },
    },
  });
}

async function findMeta(id) {
  return prisma.quiz.findUnique({
    where: { id },
    select: { id: true, ownerId: true, visibility: true },
  });
}

async function areFriends(userA, userB) {
  const friendship = await prisma.friendship.findFirst({
    where: {
      status: 'accepted',
      OR: [
        { requester_id: userA, addressee_id: userB },
        { requester_id: userB, addressee_id: userA },
      ],
    },
    select: { id: true },
  });
  return friendship !== null;
}

async function create(data, ownerId) {
  return prisma.quiz.create({
    data: {
      title: data.title,
      description: data.description,
      visibility: data.visibility,
      owner: { connect: { id: ownerId } },
    },
    select: LIST_SELECT,
  });
}

async function update(id, changes) {
  return prisma.quiz.update({
    where: { id },
    data: changes,
    select: LIST_SELECT,
  });
}

async function remove(id) {
  return prisma.quiz.delete({ where: { id } });
}

async function findQuizQuestion(quizId, questionId) {
  return prisma.quizQuestion.findUnique({
    where: { quizId_questionId: { quizId, questionId } },
  });
}

async function addQuestion(quizId, questionId) {
  return prisma.$transaction(async (tx) => {
    const last = await tx.quizQuestion.aggregate({
      where: { quizId },
      _max: { position: true },
    });
    const position = (last._max.position ?? 0) + 1;
    return tx.quizQuestion.create({ data: { quizId, questionId, position } });
  });
}

async function removeQuestion(quizId, questionId) {
  return prisma.quizQuestion.delete({
    where: { quizId_questionId: { quizId, questionId } },
  });
}

module.exports = {
  findAllVisible,
  findById,
  findMeta,
  areFriends,
  create,
  update,
  remove,
  findQuizQuestion,
  addQuestion,
  removeQuestion,
};