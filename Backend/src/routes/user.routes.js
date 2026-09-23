const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { uploadAvatar, handleUploadError } = require('../middlewares/upload.middleware');

router.get('/me', verifyToken, userController.getProfile);
router.patch('/me', verifyToken, userController.updateProfile);
router.post('/me/avatar', verifyToken, uploadAvatar, handleUploadError, userController.uploadAvatar);
router.get('/:id', verifyToken, userController.getPublicProfile); //a bien garder en derniere route pour pas interferer avec /me


module.exports = router;