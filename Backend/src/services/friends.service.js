const userModel = require('../models/user.model');
const friendModel = require('../models/friends.model');
const { serviceError } = require('../../lib/errorHandling');

async function sendRequest(requesterId, { username, addresseeId }) {
    let addressee;

    if (username) {
        addressee = await userModel.findByUsername(username);
    }
    else {
        addressee = await userModel.findById(addresseeId);
    }

    if (!addressee) {
        throw serviceError('USER_NOT_FOUND');
    }

    if (addressee.id === requesterId) {
        throw serviceError('SELF_REQUEST');
    }

    const existing = await friendModel.findBetween(requesterId, addressee.id);

    if (existing && existing.status === 'declined') {
        await friendModel.remove(existing.id);
        return friendModel.create(requesterId, addressee.id);
    }

    if (existing) {
        throw serviceError('ALREADY_EXISTS');
    }

    return friendModel.create(requesterId, addressee.id);
}

async function getFriendshipOrThrow(friendshipId) {
    const friendship = await friendModel.findById(friendshipId);
    if (!friendship) {
        throw serviceError('NOT_FOUND');
    }
    return friendship;
}

async function respondToRequest(friendshipId, userId, newStatus) {
    const friendship = await getFriendshipOrThrow(friendshipId);

    if (friendship.addressee_id !== userId) {
        throw serviceError('NOT_ADDRESSEE');
    }

    if (friendship.status !== 'pending') {
        throw serviceError('REQUEST_NOT_PENDING');
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
        throw serviceError('NOT_PARTICIPANT');
    }

    if (friendship.status === 'declined') {
        throw serviceError('NOT_FRIENDS');
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