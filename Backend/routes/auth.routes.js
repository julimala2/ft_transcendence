// TODO: définir les routes POST /signup et POST /login, appeler les fonctions de controllers/auth.controller.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateSignup } = require('../middlewares/validate.middleware');

router.post('/signup', validateSignup, authController.signup);
// router.post('/login', authController.login); // TODO: décommenter une fois login implémenté

module.exports = router;