const statsService = require('../services/statistics.service');


//Rush	                                    //Custom
//Comparé à	            moyenne des records des autres joueurs	    moyenne des % de tous les joueurs
//Regroupement	        catégorie + niveau	                        catégorie + niveau


async function getStatistics(req, res) {

    const categoryId = req.statsCategoryId;
    try {
        const stats = await statsService.getUserStats(req.user.id, categoryId);
        return res.status(200).json(stats);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

async function getUserStatistics(req, res) {

    const categoryId = req.statsCategoryId;
    try {
        const stats = await statsService.getOtherUserStats(req.statsUserId, categoryId);
        if (!stats) {
            return res.status(404).json({ error: 'Utilisateur introuvable' });
        }
        return res.status(200).json(stats);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

async function getGlobalStatistics(req, res) {

    const categoryId = req.statsCategoryId;
    try {
        const stats = await statsService.getGlobalStats(req.user.id, categoryId);
        return res.status(200).json(stats);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

module.exports = {getStatistics, getUserStatistics, getGlobalStatistics};