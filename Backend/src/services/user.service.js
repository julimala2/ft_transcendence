const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
const fs = require('fs');
const path = require('path');
const { serviceError } = require('../../lib/errorHandling');
const { notifyUser } = require('./notifications.service');

async function getProfile(userId) {
    return userModel.findById(userId);
}

async function getProfileByUsername(username) {
    return userModel.findByUsername(username);
}

async function searchUsers(query) {
    return userModel.search(query);
}

async function updateProfile(userId, data) {
    const user = await userModel.findById(userId);
    if (!user) {
        throw serviceError('USER_NOT_FOUND');
    }
    if (data.email !== undefined) {
        const existing = await userModel.findByEmail(data.email);
        if (existing && existing.id !== userId) {
            throw serviceError('EMAIL_TAKEN');
        }
    }

    const updated = await userModel.update(userId, data);

    if (data.display_name !== undefined && data.display_name !== user.display_name) {
        await notifyUser(userId, 'updated_display_name', 'Ton nom d\'affichage a été modifié');
    }

    if (data.email !== user.email) {
        await notifyUser(userId, 'updated_email', 'Ton email a été modifié');
    }

    return updated;
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
    await notifyUser(userId, 'updated_avatar', 'Ton avatar a été modifié');

    return updatedUser;
}

async function changePassword(userId, currentPassword, newPassword) {
    const user = await userModel.findById(userId);

    if (user.password_hash) {
        const isValid = await bcrypt.compare(currentPassword || '', user.password_hash);
        if (!isValid) {
            throw serviceError('INVALID_CURRENT_PASSWORD');
        }
    }

    const password_hash = await bcrypt.hash(newPassword, 10);
    await notifyUser(userId, 'updated_password', 'Ton mot de passe a été modifié');
    return userModel.update(userId, { password_hash });
}

async function deleteAccount(userId, password) {
    const user = await userModel.findById(userId);

    if (user.password_hash) {
        const isValid = await bcrypt.compare(password || '', user.password_hash);
        if (!isValid) {
            throw serviceError('INVALID_PASSWORD');
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

module.exports = { getProfile, getProfileByUsername, searchUsers, updateProfile, updateAvatar, changePassword, deleteAccount };
