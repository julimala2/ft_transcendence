const achievementsModel = require('../models/achievements.model');
const userModel = require('../models/user.model');
const blocksModel = require('../models/blocks.model');

async function getRushBadgesReached(attempt) {
    const potentialBadges = await achievementsModel.findPotentialBadges({
        metric: 'rush_score',
        categoryId: attempt.categoryId,
    });

    const reached = [];
    for (const badge of potentialBadges) {
        if (attempt.score >= badge.threshold) {
            reached.push(badge);
        }
    }
    return reached;
}

function isPerfectBadge(badge, attempt) {
    if (badge.minQuestions !== null) {
        if (attempt.totalQuestions < badge.minQuestions) {
            return false;
        }
    }

    if (badge.difficulty !== null) {
        if (badge.difficulty !== attempt.difficulty) {
            return false;
        }
    }

    if (badge.tagId !== null) {
        if (badge.tagId !== attempt.tagId) {
            return false;
        }
    }

    return true;
}

async function getPerfectBadgesReached(attempt) {
    if (attempt.status !== 'finished') {
        return [];
    }

    if (attempt.totalQuestions === 0 || attempt.score !== attempt.totalQuestions) {
        return [];
    }

    const potentialBadges = await achievementsModel.findPotentialBadges({
        metric: 'perfect_game',
        categoryId: attempt.categoryId,
    });

    const reached = [];
    for (const badge of potentialBadges) {
        if (isPerfectBadge(badge, attempt)) {
            reached.push(badge);
        }
    }

    return reached;
}

async function getGamesFinishedBadgesReached(attempt) {
    if (attempt.status !== 'finished') {
        return [];
    }

    const potentialBadges = await achievementsModel.findPotentialBadges({
        metric: 'games_finished',
        categoryId: attempt.categoryId,
    });

    const reached = [];
    for (const badge of potentialBadges) {
        const count = await achievementsModel.countFinishedCustomGames({
            userId: attempt.userId,
            categoryId: attempt.categoryId,
            minQuestions: badge.minQuestions,
        });
        if (count >= badge.threshold) {
            reached.push(badge);
        }
    }

    return reached;
}

async function checkAchievements(attemptId) {
    const attempt = await achievementsModel.findAttemptForBadges(attemptId);
    if (attempt === null) {
        return [];
    }

    if (attempt.categoryId === null) {
        return [];
    }

    let reached = [];
    if (attempt.mode === 'rush') {
        reached = await getRushBadgesReached(attempt);
    } 
    else if (attempt.mode === 'custom') {
        const perfect = await getPerfectBadgesReached(attempt);
        const gamesFinished = await getGamesFinishedBadgesReached(attempt);
        reached = perfect.concat(gamesFinished);
    }

    if (reached.length === 0) {
        return [];
    }

    const reachedBadgesIds = [];
    for (const badge of reached) {
        reachedBadgesIds.push(badge.id);
    }

    const ownedBadgesIds = await achievementsModel.findOwnedBadges({
        userId: attempt.userId,
        achievementIds: reachedBadgesIds,
    });

    const newBadges = [];
    for (const badge of reached) {
        if (ownedBadgesIds.has(badge.id) === false) {
            newBadges.push(badge);
        }
    }

    for (const badge of newBadges) {
        await achievementsModel.createBadge({
            userId: attempt.userId,
            achievementId: badge.id,
            attemptId: attempt.id,
        });
    }

    const result = [];
    for (const badge of newBadges) {
        result.push({
            slug: badge.slug,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
        });
    }
    return result;
}

async function getUserBadges(userId) {
    const rows = await achievementsModel.getBadges(userId);

    const result = [];
    for (const row of rows) {
        result.push({
            slug: row.achievement.slug,
            name: row.achievement.name,
            description: row.achievement.description,
            icon: row.achievement.icon,
            unlockedAt: row.unlockedAt,
        });
    }
    return result;
}

async function getOtherUserBadges(currentUserId, userId) {
    const exists = await userModel.userExists(userId);
    if (!exists) {
        return null;
    }

    const block = await blocksModel.findBetween(currentUserId, userId);
    if (block) {
        return null;
    }

    return getUserBadges(userId);
}

async function getAllBadgesCatalog() {
    const badges = await achievementsModel.getAllBadges();

    const result = [];
    for (const badge of badges) {
        result.push({
            slug: badge.slug,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            categoryId: badge.categoryId,
        });
    }
    return result;
}

module.exports = {
    checkAchievements,
    getUserBadges,
    getOtherUserBadges,
    getAllBadgesCatalog,
};