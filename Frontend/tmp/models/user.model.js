const prisma = require('../../lib/prisma');

async function findByEmail(email) {
    return prisma.user.findUnique({ where: { email }});
}

async function findByUsername(username) {
    return prisma.user.findUnique({ where: { username }});
}

async function create({ email, password_hash, username, display_name, avatar_url }) {
    return prisma.user.create({
        data: { email, password_hash, username, display_name, avatar_url },
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

// Ne récupère que l'id : on veut seulement savoir si le compte existe, sans charger email ni password_hash
async function userExists(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
    });
    return user !== null;
}

async function update(userId, data) {
    return prisma.user.update({
        where: { id: userId },
        data,
    });
}

async function updateAvatar(id, avatar_url) {
    return prisma.user.update({
        where: { id },
        data: { avatar_url },
    });
}

async function remove(userId) {
    return prisma.user.delete({ where: { id: userId } });
}

async function search(query) {
    return prisma.user.findMany({
        where: {
            username: { contains: query },
        },
        select: {
            id: true,
            username: true,
            display_name: true,
            avatar_url: true,
        },
        take: 10,
    });
}

module.exports = { findByEmail, findByUsername, findById, userExists, create, setOffline, update, updateAvatar, remove, search };