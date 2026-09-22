// TODO: définir les routes POST /register et POST /login, appeler les fonctions de controllers/auth.controller.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateRegister } = require('../middlewares/validate.middleware');
const { validateLogin } = require('../middlewares/validate.middleware');
const { verifyToken } = require('../middlewares/auth.middleware');


router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/me', verifyToken, authController.me);
router.post('/logout', verifyToken, authController.logout);

module.exports = router;