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

module.exports = { getProfile, updateProfile };