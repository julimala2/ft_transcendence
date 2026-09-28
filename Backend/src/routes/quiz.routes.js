const { Router } = require('express');
const controller = require('../controllers/quiz.controller');
const { validateQuizId, validateQuizBody } = require('../middlewares/quiz.middleware');

const router = Router();


router.get('/', controller.getAll);

router.get('/:id', validateQuizId, controller.getById);

router.post('/', validateQuizBody, controller.create);

router.put('/:id', validateQuizId, validateQuizBody, controller.update);

router.delete('/:id', validateQuizId, controller.remove);

module.exports = router;