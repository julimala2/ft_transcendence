const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');


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
    return user;
}


// TODO: brancher sur la route POST /login une fois prête
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

    return user;
}

module.exports = { registerUser, login };