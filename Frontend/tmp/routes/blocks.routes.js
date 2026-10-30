const express = require('express');
const router = express.Router();
const blocksController = require('../controllers/blocks.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.post('/', blocksController.blockUser);
router.delete('/:userId', blocksController.deblockUser);
router.get('/', blocksController.getBlockedUsers);

module.exports = router;