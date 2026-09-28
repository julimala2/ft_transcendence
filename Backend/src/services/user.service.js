const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
const fs = require('fs');
const path = require('path');

async function getProfile(userId) {
    return userModel.findById(userId);
}

async function getProfileByUsername(username) {
    return userModel.findByUsername(username);
}

async function updateProfile(userId, data) {
    if (data.email) {
        const existing = await userModel.findByEmail(data.email);
        if (existing && existing.id !== userId) {
            const err = new Error('Email already taken');
            err.code = 'EMAIL_TAKEN';
            throw err;
        }
    }

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

async function changePassword(userId, currentPassword, newPassword) {
    const user = await userModel.findById(userId);

    if (user.password_hash) {
        const isValid = await bcrypt.compare(currentPassword || '', user.password_hash);
        if (!isValid) {
            const err = new Error('Current password invalid');
            err.code = 'INVALID_CURRENT_PASSWORD';
            throw err;
        }
    }

    const password_hash = await bcrypt.hash(newPassword, 10);
    return userModel.update(userId, { password_hash });
}

async function deleteAccount(userId, password) {
    const user = await userModel.findById(userId);

    if (user.password_hash) {
        const isValid = await bcrypt.compare(password || '', user.password_hash);
        if (!isValid) {
            const err = new Error('Password invalid');
            err.code = 'INVALID_PASSWORD';
            throw err;
        }
    }

    if (user.avatar_url) {
        const filename = user.avatar_url.split('/').pop();
        const filePath = path.join('uploads/avatars', filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Erreur suppression avatar:', err.message);
            }
        });
    }

    return userModel.remove(userId);
}

module.exports = { getProfile, getProfileByUsername, updateProfile, updateAvatar, changePassword, deleteAccount };
