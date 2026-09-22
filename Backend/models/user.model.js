const prisma = require('../lib/prisma');

async function findByEmail(email) {
    return prisma.user.findUnique({ where: { email }});
}

async function findByUsername(username) {
    return prisma.user.findUnique({ where: { username }});
}

async function create({ email, password_hash, username, display_name }) {
    return prisma.user.create({
        data: { email, password_hash, username, display_name },
    });
}

async function setOffline(userId) {
    return prisma.user.update({
        where: { id: userId },
        data: { is_online: false, last_seen_at: new Date() },
    });
}

async function findById(id) {
    return prisma.user.findUnique({ where: { id }});
}

module.exports = { findByEmail, findByUsername, findById, create, setOffline };