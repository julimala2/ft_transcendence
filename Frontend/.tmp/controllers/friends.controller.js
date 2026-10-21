const friendService = require('../services/friends.service.js');
const { sendServiceError } = require('../../lib/errorHandling');

async function sendRequest(req, res) {
    const { username } = req.body;
    let addresseeId = req.body.addressee_id;

    if (!username && addresseeId === undefined) {
        return res.status(400).json({ error: 'username ou addressee_id requis' });
    }

    if (!username) {
        addresseeId = parseInt(addresseeId, 10);
        if (isNaN(addresseeId)) {
            return res.status(400).json({ error: 'addressee_id invalide' });
        }
    }

    try {
        const friendship = await friendService.sendRequest(req.user.id, { username, addresseeId });
        return res.status(201).json(friendship);
    }
    catch (err) {
        return sendServiceError(res, err);
    }
}

async function acceptRequest(req, res) {
    try {
        const friendship = await friendService.acceptRequest(req.friendshipId, req.user.id);
        return res.status(200).json(friendship);
    }
    catch (err) {
        return sendServiceError(res, err);
    }
}

async function declineRequest(req, res) {
    try {
        const friendship = await friendService.declineRequest(req.friendshipId, req.user.id);
        return res.status(200).json(friendship);
    }
    catch (err) {
        return sendServiceError(res, err);
    }
}

async function removeFriendship(req, res) {
    try {
        const friendship = await friendService.removeFriendship(req.friendshipId, req.user.id);
        return res.status(200).json(friendship);
    }
    catch (err) {
        return sendServiceError(res, err);
    }
}

async function findFriends(req, res) {
    const userId = req.user.id;

    try {
        const friendships = await friendService.findFriends(userId);
        return res.status(200).json(friendships);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

async function getReceivedRequests(req, res) {
    const userId = req.user.id;

    try {
        const requests = await friendService.getReceivedRequests(userId);
        return res.status(200).json(requests);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

async function getSentRequests(req, res) {
    const userId = req.user.id;

    try {
        const requests = await friendService.getSentRequests(userId);
        return res.status(200).json(requests);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

module.exports = { sendRequest, acceptRequest, declineRequest, removeFriendship, findFriends, getReceivedRequests, getSentRequests };