function validateFriendshipId(req, res, next) {
    const friendshipId = parseInt(req.params.friendshipId, 10);

    if (isNaN(friendshipId)) {
        return res.status(400).json({ error: 'Id invalide' });
    }

    req.friendshipId = friendshipId;
    next();
}

module.exports = { validateFriendshipId };
