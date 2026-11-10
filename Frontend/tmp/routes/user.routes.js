const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { uploadAvatar, handleUploadError } = require('../middlewares/upload.middleware');
const { validateChangePassword } = require('../middlewares/validate.middleware');

router.use(verifyToken);

router.get('/me', userController.getProfile);
router.patch('/me', userController.updateProfile);
router.post('/me/avatar', uploadAvatar, handleUploadError, userController.uploadAvatar);
router.patch('/me/password', validateChangePassword, userController.changePassword);
router.delete('/me', userController.deleteAccount);
router.get('/username/:username', userController.getProfileByUsername);
router.get('/search', userController.searchUsers);
router.get('/:id', userController.getPublicProfile); //a bien garder en derniere route pour pas interferer avec /me


module.exports = router;
