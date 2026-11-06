const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
const { generateToken } = require('../../lib/token');
const { serviceError } = require('../../lib/errorHandling');

async function registerUser({ email, password, username, display_name }) {
    const normalizedEmail = email.trim().toLowerCase();

    const existingEmail = await userModel.findByEmail(normalizedEmail);
    if (existingEmail) {
        throw serviceError('EMAIL_TAKEN');
    }

    const existingUsername = await userModel.findByUsername(username);
    if (existingUsername) {
        throw serviceError('USERNAME_TAKEN');
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
        email: normalizedEmail,
        password_hash,
        username,
        display_name: display_name || username,
    });

    const token = generateToken(user);

    return { user, token };
}

async function login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await userModel.findByEmail(normalizedEmail);
    if (!user) {
        throw serviceError('INVALID_CREDENTIALS');
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
        throw serviceError('INVALID_CREDENTIALS');
    }

    const token = generateToken(user);

    return { user, token };
}

async function logout(userId) {
    await userModel.setOffline(userId);
}

module.exports = { registerUser, login, logout };