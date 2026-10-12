const { Router } = require('express');
const controller = require('../controllers/question.controller');
const { validateQuestionId, validateQuestionBody } = require('../middlewares/question.middleware');

const router = Router();

router.get('/', controller.getAll);
router.get('/:id', validateQuestionId, controller.getById);
router.post('/', validateQuestionBody, controller.create);
router.put('/:id', validateQuestionId, validateQuestionBody, controller.update);
router.delete('/:id', validateQuestionId, controller.remove);

module.exports = router;
