const blocksService = require('../services/blocks.service');
const { sendServiceError } = require('../../lib/errorHandling');


async function blockUser(req, res) {
    const { username } = req.body;
    let blockedId = req.body.blocked_id;

    if (!username && blockedId === undefined) {
        return res.status(400).json({ error: 'username ou blocked_id requis' });
    }

    if (!username) {
        blockedId = parseInt(blockedId, 10);
        if (isNaN(blockedId)) {
            return res.status(400).json({ error: 'blocked_id invalide' });
        }
    }

    try {
        const blocks = await blocksService.blockUser(req.user.id, { username, blockedId });
        return res.status(201).json(blocks);
    }
    catch (err) {
        return sendServiceError(res, err);
    }
}

async function deblockUser(req, res) {
    const { username } = req.body;
    let blockedId = req.body.blocked_id;

    if (!username && blockedId === undefined) {
        return res.status(400).json({ error: 'username ou blocked_id requis' });
    }

    if (!username) {
        blockedId = parseInt(blockedId, 10);
        if (isNaN(blockedId)) {
            return res.status(400).json({ error: 'blocked_id invalide' });
        }
    }

    try {
        const deblock = await blocksService.deblockUser(req.user.id, { username, blockedId });
        return res.status(200).json(deblock);
    }
    catch (err) {
        return sendServiceError(res, err);
    }

}

async function getBlockedUsers(req, res) {
    try {
        const blocks = await blocksService.getBlockedUsers(req.user.id);
        return res.status(200).json(blocks);
    }
    catch (err) {
        return sendServiceError(res, err);
    }
}

module.exports = { blockUser, deblockUser, getBlockedUsers };