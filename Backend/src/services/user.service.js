const { user } = require('../../lib/prisma');
const userModel = require('../models/user.model');

async function getProfile(userId) {
    return userModel.findById(userId);
}

async function updateProfile(userId, { display_name }) {
    return userModel.update(userId, { display_name });
}

module.exports = { getProfile, updateProfile };
