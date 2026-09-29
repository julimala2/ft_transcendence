const userModel = require('../models/user.model');
const friendModel = require('../models/friends.model');

async function sendRequest(requesterId, { username, addresseeId }) {
    let addressee;

    if (username) {
        addressee = await userModel.findByUsername(username);
    }
    else {
        addressee = await userModel.findById(addresseeId);
    }

    if (!addressee) {
        const err = new Error('User not found');
        err.code = 'USER_NOT_FOUND';
        throw err;
    }

    if (addressee.id === requesterId) {
        const err = new Error('Cannot add yourself');
        err.code = 'SELF_REQUEST';
        throw err;
    }

    const existing = await friendModel.findBetween(requesterId, addressee.id);

    if (existing && existing.status === 'declined') {
        await friendModel.remove(existing.id);
        return friendModel.create(requesterId, addressee.id);
    }

    if (existing) {
        const err = new Error('Friendship already exists');
        err.code = 'ALREADY_EXISTS';
        throw err;
    }

    return friendModel.create(requesterId, addressee.id);
}

async function getFriendshipOrThrow(friendshipId) {
    const friendship = await friendModel.findById(friendshipId);
    if (!friendship) {
        const err = new Error('Friendship not found');
        err.code = 'NOT_FOUND';
        throw err;
    }
    return friendship;
}

async function respondToRequest(friendshipId, userId, newStatus) {
    const friendship = await getFriendshipOrThrow(friendshipId);

    if (friendship.addressee_id !== userId) {
        const err = new Error('Not authorized to respond to this request');
        err.code = 'FORBIDDEN';
        throw err;
    }

    if (friendship.status !== 'pending') {
        const err = new Error('Request is not pending');
        err.code = 'INVALID_STATUS';
        throw err;
    }

    return friendModel.updateStatus(friendshipId, newStatus);
}

async function acceptRequest(friendshipId, userId) {
    return respondToRequest(friendshipId, userId, 'accepted');
}

async function declineRequest(friendshipId, userId) {
    return respondToRequest(friendshipId, userId, 'declined');
}

async function removeFriendship(friendshipId, userId) {
    const friendship = await getFriendshipOrThrow(friendshipId);

    if (friendship.addressee_id !== userId && friendship.requester_id !== userId) {
        const err = new Error('Not authorized to remove friend');
        err.code = 'FORBIDDEN';
        throw err;
    }

    if (friendship.status === 'declined') {
        const err = new Error('Not friends');
        err.code = 'INVALID_STATUS';
        throw err;
    }

    return friendModel.remove(friendshipId);
}

async function findFriends(userId) {
    const friendships = await friendModel.findFriends(userId);

    return friendships.map((friendship) => {
        let friend;
        
        if (friendship.requester_id === userId) {
            friend = friendship.addressee;
        }
        else {
            friend = friendship.requester;
        }

        return {
            friendshipId: friendship.id,
            id: friend.id,
            username: friend.username,
            display_name: friend.display_name,
            avatar_url: friend.avatar_url,
        };
    });
}

async function getReceivedRequests(userId) {
    const requests = await friendModel.findReceivedRequests(userId);

    return requests.map((friendship) => ({
        friendshipId: friendship.id,
        id: friendship.requester.id,
        username: friendship.requester.username,
        display_name: friendship.requester.display_name,
        avatar_url: friendship.requester.avatar_url,
    }));
}

async function getSentRequests(userId) {
    const requests = await friendModel.findSentRequests(userId);

    return requests.map((friendship) => ({
        friendshipId: friendship.id,
        id: friendship.addressee.id,
        username: friendship.addressee.username,
        display_name: friendship.addressee.display_name,
        avatar_url: friendship.addressee.avatar_url,
    }));
}

module.exports = { sendRequest, acceptRequest, declineRequest, removeFriendship, findFriends, getReceivedRequests, getSentRequests };