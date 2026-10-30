const prisma = require('../../lib/prisma');

async function findAllThemes() {
    return prisma.theme.findMany({ orderBy: { position: 'asc' } });
}

async function findById(id) {
  return prisma.theme.findUnique({ where: { id } });
}

async function findByName(name) {
  return prisma.theme.findUnique({ where: { name } });
}

async function findBySlug(slug) {
  return prisma.theme.findUnique({ where: { slug } });
}


module.exports = {
    findAllThemes,
    findById,
    findByName,
    findBySlug
};