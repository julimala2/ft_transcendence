const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findByEmail(email) {
    return prisma.user.findUnique({ where: { email }});
}

async function create({ email, password_hash, username, display_name }) {
    return prisma.user.create({
        data: { email, password_hash, username, display_name },
    });
}

module.exports = { findByEmail, create };