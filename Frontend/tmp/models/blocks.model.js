const prisma = require('../../lib/prisma');


async function findById(blockId) {
    return prisma.blockedUser.findUnique({ where: { id: blockId } });
}

async function findBetween(userIdA, userIdB) {
    return prisma.blockedUser.findFirst({
        where: {
            OR: [
                { blocker_id: userIdA, blocked_id: userIdB },
                { blocker_id: userIdB, blocked_id: userIdA },
            ],
        },
    });
}

async function create(blockerId, blockedId) {
    return prisma.blockedUser.create({
        data: { blocker_id: blockerId, blocked_id: blockedId },
    });
}

async function remove(blockId) {
    return prisma.blockedUser.delete({ where: { id: blockId } });
}

async function findBlockedUsers(userId) {
    return prisma.blockedUser.findMany({
        where: { blocker_id: userId },
        include: { blocked: true },
    });
}

module.exports = { findById, findBetween, create, remove, findBlockedUsers };