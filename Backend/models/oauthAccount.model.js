const prisma = require('../lib/prisma');

async function findByProvider(provider, providerUserId) {
    return prisma.oAuthAccount.findUnique({
        where: {
            provider_provider_user_id: {
                provider,
                provider_user_id: providerUserId,
            },
        },
    });
}

async function create({ user_id, provider, provider_user_id }) {
    return prisma.oAuthAccount.create({
        data: { user_id, provider, provider_user_id },
    });
}

module.exports = { findByProvider, create };
