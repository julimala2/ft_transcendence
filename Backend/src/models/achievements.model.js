const prisma = require('../../lib/prisma');

async function findPotentialBadges({ metric, categoryId }) {
    return prisma.achievement.findMany({
        where: {
            metric,
            OR: [
                { categoryId: categoryId },
                { categoryId: null },
            ],
        },
    });
}

async function findOwnedBadges({ userId, achievementIds }) {
    const owned = await prisma.userAchievement.findMany({
        where: {
            userId,
            achievementId: { in: achievementIds },
        },
        select: { achievementId: true },
    });

    const ownedIds = new Set();
    for (const row of owned) {
        ownedIds.add(row.achievementId);
    }
    return ownedIds;
}

async function countFinishedCustomGames({ userId, categoryId, minQuestions }) {
    let minimum = 0;
    if (minQuestions !== null && minQuestions !== undefined) {
        minimum = minQuestions;
    }

    return prisma.quizAttempt.count({
        where: {
            userId,
            categoryId,
            mode: 'custom',
            status: 'finished',
            totalQuestions: { gte: minimum },
        },
    });
}

async function createBadge({userId, achievementId, attemptId}) {
    return prisma.userAchievement.upsert({
        where:  { userId_achievementId: { userId, achievementId } },
        update: {},
        create: { userId, achievementId, attemptId },                 
    });
}

async function getBadges(userId) {
    return prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
        orderBy: { unlockedAt: 'desc'},
    });
}

async function getAllBadges() {
    return prisma.achievement.findMany({
        orderBy: [
            { categoryId: 'asc' },
            { threshold: 'asc' },
        ],
    });
}

async function findAttemptForBadges(attemptId) {
    return prisma.quizAttempt.findUnique({
        where: { id: attemptId },
        select: {
            id: true,
            userId: true,
            mode: true,
            status: true,
            categoryId: true,
            tagId: true,
            difficulty: true,
            score: true,
            totalQuestions: true,
        },
    });
}

module.exports = {
    findAttemptForBadges,
    findPotentialBadges,
    findOwnedBadges,
    countFinishedCustomGames,
    createBadge,
    getBadges,
    getAllBadges,
};
