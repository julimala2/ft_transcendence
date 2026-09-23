const userService = require('../services/user.service');

async function getProfile(req, res) {
    try {
        const user = await userService.getProfile(req.user.id);
        return res.status(200).json({
            id: user.id,
            email: user.email,
            username: user.username,
            display_name: user.display_name,
            avatar_url: user.avatar_url,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

async function getPublicProfile(req, res) {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Id invalide' });
    }

    try {
        const user = await userService.getProfile(id);

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur introuvable' });
        }

        return res.status(200).json({
            id: user.id,
            username: user.username,
            display_name: user.display_name,
            avatar_url: user.avatar_url,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}


async function updateProfile(req, res) {
    const { display_name } = req.body;

    if (!display_name || display_name.trim().length === 0) {
        return res.status(400).json({ error: 'Display name requis' });
    }

    try {
        const user = await userService.updateProfile(req.user.id, { display_name });
        return res.status(200).json({
            id: user.id,
            email: user.email,
            username: user.username, 
            display_name: user.display_name,
            avatar_url: user.avatar_url,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur server' });
    }
}

async function uploadAvatar(req, res) {
    if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier envoye' });
    }

    const avatar_url = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;

    try {
        const user = await userService.updateAvatar(req.user.id, avatar_url);
        return res.status(200).json({
            id: user.id,
            email: user.email,
            username: user.username,
            display_name: user.display_name,
            avatar_url: user.avatar_url,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

module.exports = { getProfile, getPublicProfile, updateProfile, uploadAvatar };