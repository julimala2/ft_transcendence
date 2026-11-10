const prisma = require('../../lib/prisma');

async function findById(friendshipId) {
    return prisma.friendship.findUnique({ where: { id: friendshipId } });
}

async function findBetween(userIdA, userIdB) {
    return prisma.friendship.findFirst({
        where: {
            OR: [
                { requester_id: userIdA, addressee_id: userIdB },
                { requester_id: userIdB, addressee_id: userIdA },
            ],
        },
    });
}

async function create(requesterId, addresseeId) {
    return prisma.friendship.create({
        data: { requester_id: requesterId, addressee_id: addresseeId },
    });
}

async function updateStatus(friendshipId, status) {
    return prisma.friendship.update({
        where: { id: friendshipId },
        data: { status },
    });
}

async function remove(friendshipId) {
    return prisma.friendship.delete({ where: { id: friendshipId } });
}

async function findFriends(userId) {
    return prisma.friendship.findMany({
        where: {
            status: 'accepted',
            OR: [
                { requester_id: userId },
                { addressee_id: userId },
            ],
        },
        include: {
            requester: true,
            addressee: true,
        },
    });
}

async function findReceivedRequests(userId) {
    return prisma.friendship.findMany({
        where: {
            status: 'pending',
            addressee_id: userId,
        },
        include: {
            requester: true,
        },
    });
}

async function findSentRequests(userId) {
    return prisma.friendship.findMany({
        where: {
            status: 'pending',
            requester_id: userId,
        },
        include: {
            addressee: true,
        },
    });
}

module.exports = { findBetween, create, findById, updateStatus, remove, findFriends, findReceivedRequests, findSentRequests };