const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');


router.get('/me', verifyToken, userController.getProfile);
router.patch('/me', verifyToken, userController.updateProfile);

module.exports = router;