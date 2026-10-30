const blocksModel = require('../models/blocks.model');
const userModel = require('../models/user.model');
const { serviceError } = require('../../lib/errorHandling');


async function blockUser(blockerId, { username, blockedId }) {
    let blockedUser;

    if (username) {
        blockedUser = await userModel.findByUsername(username);
    }
    else {
        blockedUser = await userModel.findById(blockedId);
    }

    if (!blockedUser) {
        throw serviceError('USER_NOT_FOUND');
    }

    if (blockedUser.id === blockerId) {
        throw serviceError('SELF_BLOCK');
    }

    const existing = await blocksModel.findBetween(blockerId, blockedUser.id);

    if (existing) {
        throw serviceError('ALREADY_BLOCKED');
    }

    return blocksModel.create(blockerId, blockedUser.id);
}

async function deblockUser(blockerId, { username, blockedId }) {
    let blockedUser;

    if (username) {
        blockedUser = await userModel.findByUsername(username);
    }
    else {
        blockedUser = await userModel.findById(blockedId);
    }

    if (!blockedUser) {
        throw serviceError('USER_NOT_FOUND');
    }

    if (blockedUser.id === blockerId) {
        throw serviceError('SELF_BLOCK');
    }

    const existing = await blocksModel.findBetween(blockerId, blockedUser.id);

    if (!existing) {
        throw serviceError('NOT_BLOCKED');
    }

    return blocksModel.remove(existing.id);
}

async function getBlockedUsers(userId) {
    const blocks = await blocksModel.findBlockedUsers(userId);

    return blocks.map((block) => ({
        blockId: block.id,
        id: block.blocked.id,
        username: block.blocked.username,
        display_name: block.blocked.display_name,
        avatar_url: block.blocked.avatar_url,
    }));
}

module.exports = { blockUser, deblockUser, getBlockedUsers };
