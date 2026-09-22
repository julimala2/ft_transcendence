const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');


function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '12h' }
    );
}

async function registerUser({ email, password, username, display_name }) {
    const existing = await userModel.findByEmail(email);
    if (existing) {
        const err = new Error('Email already taken');
        err.code = 'EMAIL_TAKEN';
        throw err;
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
        email,
        password_hash,
        username,
        display_name: display_name || username,
    });

    const token = generateToken(user);

    return { user, token };
}


async function login({ email, password }) {
    const user = await userModel.findByEmail(email);
    if (!user) {
        const err = new Error('Invalid credentials');
        err.code = 'INVALID_CREDENTIALS';
        throw err;
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
        const err = new Error('Invalid credentials');
        err.code = 'INVALID_CREDENTIALS';
        throw err;
    }

    const token = generateToken(user);

    return { user, token };
}

async function logout(userId) {
    await userModel.setOffline(userId);
}

module.exports = { registerUser, login, logout };