const friendService = require('../services/friends.service.js');

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
        if (err.code === 'SELF_REQUEST') {
            return res.status(400).json({ error: 'Impossible de s\'ajouter soi-meme' });
        }
        if (err.code === 'ALREADY_EXISTS') {
            return res.status(409).json({ error: 'Demande deja existante ou vous etes deja amis' });
        }
        if (err.code === 'USER_NOT_FOUND') {
            return res.status(404).json({ error: 'Utilisateur introuvable' });
        }
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

async function acceptRequest(req, res) {
    const friendshipId = parseInt(req.params.friendshipId, 10);

    if (isNaN(friendshipId)) {
        return res.status(400).json({ error: 'Id invalide' });
    }

    try {
        const friendship = await friendService.acceptRequest(friendshipId, req.user.id);
        return res.status(200).json(friendship);
    }
    catch (err) {
        if (err.code === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Demande introuvable' });
        }
                if (err.code === 'FORBIDDEN') {
            return res.status(403).json({ error: 'Non autorise a accepter cette demande' });
        }
        if (err.code === 'INVALID_STATUS') {
            return res.status(409).json({ error: 'Cette demande n\'est plus en attente' });
        }
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

async function declineRequest(req, res) {
    const friendshipId = parseInt(req.params.friendshipId, 10);

    if (isNaN(friendshipId)) {
        return res.status(400).json({ error: 'Id invalide' });
    }

    try {
        const friendship = await friendService.declineRequest(friendshipId, req.user.id);
        return res.status(200).json(friendship);
    }
    catch (err) {
        if (err.code === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Demande introuvable' });
        }
        if (err.code === 'FORBIDDEN') {
            return res.status(403).json({ error: 'Non autorise a accepter cette demande' });
        }
        if (err.code === 'INVALID_STATUS') {
            return res.status(409).json({ error: 'Cette demande n\'est plus en attente' });
        }
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

async function removeFriendship(req, res) {
    const friendshipId = parseInt(req.params.friendshipId, 10);

    if (isNaN(friendshipId)) {
        return res.status(400).json({ error: 'Id invalide' });
    }

    try {
        const friendship = await friendService.removeFriendship(friendshipId, req.user.id);
        return res.status(200).json(friendship);
    }
    catch (err) {
        if (err.code === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Demande introuvable' });
        }
        if (err.code === 'FORBIDDEN') {
            return res.status(403).json({ error: 'Non autorise a supprimer cette amitie' });
        }
        if (err.code === 'INVALID_STATUS') {
            return res.status(409).json({ error: 'Vous n\'etes pas amis' });
        }
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
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