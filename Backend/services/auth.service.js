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
    const normalizedEmail = email.trim().toLowerCase();

    const existingEmail = await userModel.findByEmail(normalizedEmail);
    if (existingEmail) {
        const err = new Error('Email already taken');
        err.code = 'EMAIL_TAKEN';
        throw err;
    }

    const existingUsername = await userModel.findByUsername(username);
    if (existingUsername) {
        const err = new Error('Username already taken');
        err.code = 'USERNAME_TAKEN';
        throw err;
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