const express = require('express');
const router = express.Router();
const blocksController = require('../controllers/blocks.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, blocksController.blockUser);
router.delete('/:userId', verifyToken, blocksController.deblockUser);
router.get('/', verifyToken, blocksController.getBlockedUsers);

module.exports = router;