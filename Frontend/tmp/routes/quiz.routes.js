const { Router } = require('express');
const controller = require('../controllers/quiz.controller');
const { verifyToken } = require('../middlewares/auth.middleware.js');
const {
  validateQuizId,
  validateQuestionParam,
  validateListQuery,
  validateCreateBody,
  validateUpdateBody,
  validateAddQuestionBody,
} = require('../middlewares/quiz.middleware');

const router = Router();

router.use(verifyToken);

router.get('/', validateListQuery, controller.getAll);
router.get('/:id', validateQuizId, controller.getById);
router.post('/', validateCreateBody, controller.create);
router.patch('/:id', validateQuizId, validateUpdateBody, controller.update);
router.delete('/:id', validateQuizId, controller.remove);

router.post('/:id/questions', validateQuizId, validateAddQuestionBody, controller.addQuestion);
router.delete('/:id/questions/:questionId', validateQuizId, validateQuestionParam, controller.removeQuestion);

module.exports = router;