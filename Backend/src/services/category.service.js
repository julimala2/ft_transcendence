const categoryModel = require('../models/category.model');

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function getAllCategories() {
  return categoryModel.findAll();
}

async function getCategoryById(id) {
  const category = await categoryModel.findById(id);
  if (!category) throw httpError(404, `Catégorie ${id} introuvable`);
  return category;
}

async function createCategory({ name }) {
  const cleanName = name.trim();
  if (cleanName.length === 0) {
    throw httpError(400, 'Le nom ne peut pas être vide');
  }
  const existing = await categoryModel.findByName(cleanName);
  if (existing) {
    throw httpError(409, `La catégorie "${cleanName}" existe déjà`);
  }
  return categoryModel.create({ name: cleanName });
}

async function updateCategory(id, { name }) {
  await getCategoryById(id);
  const cleanName = name.trim();
  if (cleanName.length === 0) {
    throw httpError(400, 'Le nom ne peut pas être vide');
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
  createCategory,
  updateCategory,
  deleteCategory,
};