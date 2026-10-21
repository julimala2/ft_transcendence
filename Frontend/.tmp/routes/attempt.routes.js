const { Router } = require('express');
const controller = require('../controllers/attempt.controller');
const { verifyToken } = require('../middlewares/auth.middleware.js');
const {
  validateAttemptId,
  validateStartBody,
  validateAnswerBody,
} = require('../middlewares/attempt.middleware');

const router = Router();

router.use(verifyToken);

router.post('/', validateStartBody, controller.start);
router.get('/:id', validateAttemptId, controller.getOne);
router.post('/:id/answers', validateAttemptId, validateAnswerBody, controller.answer);

module.exports = router;
