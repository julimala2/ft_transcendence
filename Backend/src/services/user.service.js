const userModel = require('../models/user.model');
const fs = require('fs');
const path = require('path');

async function getProfile(userId) {
    return userModel.findById(userId);
}

async function updateProfile(userId, data) {
    return userModel.update(userId, data);
}

async function updateAvatar(userId, avatar_url) {
    const currentUser = await userModel.findById(userId);
    const updatedUser = await userModel.update(userId, { avatar_url });

    if (currentUser.avatar_url) {
        const oldFilename = currentUser.avatar_url.split('/').pop();
        const oldPath = path.join('uploads/avatars', oldFilename);
        fs.unlink(oldPath, (err) => {
            if (err) {
                console.error('Erreur suppression ancien avatar:', err.message);
            }
        });
    }

    return updatedUser;
}

module.exports = { getProfile, updateProfile, updateAvatar };
