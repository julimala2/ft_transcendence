const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { uploadAvatar, handleUploadError } = require('../middlewares/upload.middleware');
const { validateChangePassword } = require('../middlewares/validate.middleware');

router.get('/me', verifyToken, userController.getProfile);
router.patch('/me', verifyToken, userController.updateProfile);
router.post('/me/avatar', verifyToken, uploadAvatar, handleUploadError, userController.uploadAvatar);
router.patch('/me/password', verifyToken, validateChangePassword, userController.changePassword);
router.delete('/me', verifyToken, userController.deleteAccount);
router.get('/username/:username', verifyToken, userController.getProfileByUsername);
router.get('/search', verifyToken, userController.searchUsers);
router.get('/:id', verifyToken, userController.getPublicProfile); //a bien garder en derniere route pour pas interferer avec /me


module.exports = router;