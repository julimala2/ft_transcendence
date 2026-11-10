const achievementsService = require('../services/achievements.service');

async function getBadges(req, res) {
    try {
        const badges = await achievementsService.getUserBadges(req.user.id);
        return res.status(200).json(badges);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

async function getUserBadges(req, res) {
    try {
        const badges = await achievementsService.getOtherUserBadges(req.user.id, req.statsUserId);
        if (!badges) {
            return res.status(404).json({ error: 'Utilisateur introuvable' });
        }
        return res.status(200).json(badges);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

async function getGlobalBadges(req, res) {
    try {
        const badges = await achievementsService.getAllBadgesCatalog();
        return res.status(200).json(badges);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

module.exports = { getBadges, getUserBadges, getGlobalBadges };
