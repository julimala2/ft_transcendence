const categoryModel = require('../models/category.model');

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function slugify(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function getAllCategories() {
  return categoryModel.findAll();
}

async function getCategoryById(id) {
  const category = await categoryModel.findById(id);
  if (!category) throw httpError(404, `Catégorie ${id} introuvable`);
  return category;
}

async function getCategoryTags(id, search) {
  await getCategoryById(id);
  const tags = await categoryModel.findTags(id, search);
  return tags.map((tag) => ({ slug: tag.slug, questionCount: tag._count.questions }));
}

async function createCategory({ name }) {
  const cleanName = name.trim();
  if (cleanName.length === 0) {
    throw httpError(400, 'Le nom ne peut pas être vide');
  }

  const slug = slugify(cleanName);
  if (slug.length === 0) {
    throw httpError(400, 'Le nom doit contenir au moins une lettre ou un chiffre');
  }

  if (await categoryModel.findByName(cleanName)) {
    throw httpError(409, `La catégorie "${cleanName}" existe déjà`);
  }
  if (await categoryModel.findBySlug(slug)) {
    throw httpError(409, `Une catégorie avec le slug "${slug}" existe déjà`);
  }

  return categoryModel.create({ name: cleanName, slug });
}

async function updateCategory(id, { name }) {
  await getCategoryById(id);

  const cleanName = name.trim();
  if (cleanName.length === 0) {
    throw httpError(400, 'Le nom ne peut pas être vide');
  }
  if (slugify(cleanName).length === 0) {
    throw httpError(400, 'Le nom doit contenir au moins une lettre ou un chiffre');
  }

  const existing = await categoryModel.findByName(cleanName);
  if (existing && existing.id !== id) {
    throw httpError(409, `La catégorie "${cleanName}" existe déjà`);
  }

  return categoryModel.update(id, { name: cleanName });
}

async function deleteCategory(id) {
  const category = await getCategoryById(id);
  if (category._count.questions > 0) {
    throw httpError(
      409,
      `Impossible de supprimer : ${category._count.questions} question(s) utilisent cette catégorie`
    );
  }
  return categoryModel.remove(id);
}

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryTags,
  createCategory,
  updateCategory,
  deleteCategory,
};