const questionModel = require('../models/question.model');
const categoryModel = require('../models/category.model');

const QUESTION_TYPES = ['multiple', 'boolean'];
const TAG_FORMAT = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function cleanText(text) {
  if (typeof text !== 'string' || text.trim().length === 0) {
    throw httpError(400, '"text" doit être un texte non vide');
  }
  return text.trim();
}

function cleanExplanation(explanation) {
  if (explanation === null) return null;
  if (typeof explanation !== 'string') {
    throw httpError(400, '"explanation" doit être un texte ou null');
  }
  const trimmed = explanation.trim();
  return trimmed.length === 0 ? null : trimmed;
}

function checkType(type) {
  if (!QUESTION_TYPES.includes(type)) {
    throw httpError(400, `"type" doit valoir : ${QUESTION_TYPES.join(' ou ')}`);
  }
  return type;
}

function checkDifficulty(difficulty) {
  if (!Number.isInteger(difficulty) || difficulty < 1 || difficulty > 3) {
    throw httpError(400, '"difficulty" doit être 1, 2 ou 3');
  }
  return difficulty;
}

function cleanTags(tags) {
  if (!Array.isArray(tags) || tags.some((t) => typeof t !== 'string')) {
    throw httpError(400, '"tags" doit être un tableau de textes');
  }
  const cleaned = [...new Set(tags.map((t) => t.trim().toLowerCase()).filter((t) => t.length > 0))];
  for (const tag of cleaned) {
    if (!TAG_FORMAT.test(tag)) {
      throw httpError(400, `Tag invalide "${tag}" : minuscules, chiffres et tirets uniquement`);
    }
  }
  return cleaned;
}

async function checkCategory(categoryId) {
  if (categoryId === null) return null;
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    throw httpError(400, '"categoryId" doit être un entier ou null');
  }
  const category = await categoryModel.findById(categoryId);
  if (!category) throw httpError(400, `Catégorie ${categoryId} introuvable`);
  return categoryId;
}

function cleanAnswers(type, answers) {
  if (!Array.isArray(answers)) {
    throw httpError(400, '"answers" doit être un tableau');
  }
  if (type === 'boolean' && answers.length !== 2) {
    throw httpError(400, 'Une question "boolean" doit avoir exactement 2 propositions');
  }
  if (answers.length < 2) {
    throw httpError(400, 'Une question doit avoir au moins 2 propositions');
  }

  const cleaned = answers.map((answer) => {
    if (!answer || typeof answer.text !== 'string' || answer.text.trim().length === 0) {
      throw httpError(400, 'Chaque proposition doit avoir un "text" non vide');
    }
    if (typeof answer.isCorrect !== 'boolean') {
      throw httpError(400, 'Chaque proposition doit avoir "isCorrect" (true ou false)');
    }
    return { text: answer.text.trim(), isCorrect: answer.isCorrect };
  });

  const correctCount = cleaned.filter((a) => a.isCorrect).length;
  if (correctCount !== 1) {
    throw httpError(400, 'Une question doit avoir exactement 1 proposition correcte');
  }
  return cleaned;
}

async function assertOwner(id, userId) {
  const question = await questionModel.findForOwnership(id);
  if (!question) throw httpError(404, `Question ${id} introuvable`);
  if (question.authorId !== userId) {
    throw httpError(403, "Vous n'êtes pas l'auteur de cette question");
  }
}

async function getAllQuestions(filters) {
  return questionModel.findAll(filters);
}

async function getQuestionById(id) {
  const question = await questionModel.findPublicById(id);
  if (!question) throw httpError(404, `Question ${id} introuvable`);
  return question;
}

async function createQuestion(data, userId) {
  const type = checkType(data.type ?? 'multiple');

  return questionModel.create(
    {
      text: cleanText(data.text),
      type,
      difficulty: checkDifficulty(data.difficulty ?? 1),
      explanation: data.explanation === undefined ? null : cleanExplanation(data.explanation),
      categoryId: data.categoryId === undefined ? null : await checkCategory(data.categoryId),
      tags: data.tags === undefined ? [] : cleanTags(data.tags),
      answers: cleanAnswers(type, data.answers),
    },
    userId
  );
}

async function updateQuestion(id, data, userId) {
  await assertOwner(id, userId);

  const changes = {};
  if (data.text !== undefined) changes.text = cleanText(data.text);
  if (data.difficulty !== undefined) changes.difficulty = checkDifficulty(data.difficulty);
  if (data.explanation !== undefined) changes.explanation = cleanExplanation(data.explanation);
  if (data.categoryId !== undefined) changes.categoryId = await checkCategory(data.categoryId);
  if (data.tags !== undefined) changes.tags = cleanTags(data.tags);

  if (Object.keys(changes).length === 0) {
    throw httpError(
      400,
      'Aucun champ modifiable fourni (text, difficulty, explanation, categoryId, tags)'
    );
  }
  return questionModel.update(id, changes);
}

async function deleteQuestion(id, userId) {
  await assertOwner(id, userId);
  return questionModel.remove(id);
}

module.exports = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};