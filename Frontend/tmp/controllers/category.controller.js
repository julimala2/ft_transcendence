const categoryService = require('../services/category.service');

function sendError(res, err) {
  const status = err.statusCode || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: status === 500 ? 'Erreur interne du serveur' : err.message });
}

async function getAll(req, res) {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (err) {
    sendError(res, err);
  }
}

async function getById(req, res) {
  try {
    const category = await categoryService.getCategoryById(req.categoryId);
    res.json(category);
  } catch (err) {
    sendError(res, err);
  }
}

async function getTags(req, res) {
  try {
    const tags = await categoryService.getCategoryTags(req.categoryId, req.search);
    res.json(tags);
  } catch (err) {
    sendError(res, err);
  }
}

async function getNbQuestionsByDifficultyAndTag(req, res) {
  try {
    const nb = await categoryService.getNbQuestionsByDifficulty(
      req.params.category,
      req.params.tag,
      Number(req.params.difficulty)
    );

    res.json(nb);
  } catch (err) {
    sendError(res, err);
  }
}

async function create(req, res) {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    sendError(res, err);
  }
}

async function update(req, res) {
  try {
    const category = await categoryService.updateCategory(req.categoryId, req.body);
    res.json(category);
  } catch (err) {
    sendError(res, err);
  }
}

async function remove(req, res) {
  try {
    await categoryService.deleteCategory(req.categoryId);
    res.status(204).send();
  } catch (err) {
    sendError(res, err);
  }
}

module.exports = { getAll, getById, getTags, getNbQuestionsByDifficultyAndTag, create, update, remove };