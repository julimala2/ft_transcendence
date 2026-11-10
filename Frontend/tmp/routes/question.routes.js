const { Router } = require('express');
const controller = require('../controllers/question.controller');
const { verifyToken } = require('../middlewares/auth.middleware.js');
const {
  validateQuestionId,
  validateListQuery,
  validateCreateBody,
  validateUpdateBody,
} = require('../middlewares/question.middleware');

const router = Router();

router.get('/', validateListQuery, controller.getAll);
router.get('/:id', validateQuestionId, controller.getById);
router.post('/', verifyToken, validateCreateBody, controller.create);
router.patch('/:id', verifyToken, validateQuestionId, validateUpdateBody, controller.update);
router.delete('/:id', verifyToken, validateQuestionId, controller.remove);

module.exports = router;