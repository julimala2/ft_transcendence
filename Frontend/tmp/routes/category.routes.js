const { Router } = require('express');
const controller = require('../controllers/category.controller');
const { validateCategoryId, validateCategoryBody, validateTagsQuery } = require('../middlewares/category.middleware');

const router = Router();

router.get('/', controller.getAll);
router.get('/:id', validateCategoryId, controller.getById);
router.get('/:id/tags', validateCategoryId, validateTagsQuery, controller.getTags);
router.get('/:category/:tags/:difficulty', validateCategoryId, validateTagsQuery, controller.getNbQuestionsByDifficultyAndTag);
router.post('/', validateCategoryBody, controller.create);
router.put('/:id', validateCategoryId, validateCategoryBody, controller.update);
router.delete('/:id', validateCategoryId, controller.remove);

module.exports = router;