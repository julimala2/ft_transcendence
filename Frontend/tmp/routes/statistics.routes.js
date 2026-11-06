const express = require('express');
const { validateStatsQuery, validateStatsUserId } = require('../middlewares/statistics.middleware');
const statsController = require('../controllers/statistics.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

                        //Rush	                                    //Custom
//Mesure	            nombre de bonnes réponses (score)	        score / totalQuestions en %
//Stat affichée	        record (max)	                            moyenne des %
//Comparé à	            moyenne des records des autres joueurs	    moyenne des % de tous les joueurs
//Regroupement	        catégorie + niveau	                        catégorie + niveau
//Abandon	            score obtenu jusqu'à l'arrêt	            les questions restantes comptent comme fausses

router.get('/', verifyToken, validateStatsQuery, statsController.getStatistics);
router.get('/global', verifyToken, validateStatsQuery, statsController.getGlobalStatistics);
router.get('/users/:id', verifyToken, validateStatsUserId, validateStatsQuery, statsController.getUserStatistics);

module.exports = router;

