const express = require('express');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validateStatsUserId } = require('../middlewares/statistics.middleware');
const achievementsController = require('../controllers/achievements.controller');
const router = express.Router();

// comment afficher quand on obtient ? 

// route achievements pour le voir 
// route pour voir tous les badges possibles


router.get('/', verifyToken, achievementsController.getGlobalBadges);
router.get('/me', verifyToken, achievementsController.getBadges);
router.get('/users/:id', verifyToken, validateStatsUserId, achievementsController.getUserBadges);

module.exports = router;