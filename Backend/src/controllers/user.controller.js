const userService = require('../services/user.service');
const { COOKIE_OPTIONS } = require('../../lib/cookieOptions');
const { emailRegex } = require('../../lib/validationPatterns');

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
    const { display_name, email } = req.body;
    const data = {};

    if (display_name !== undefined) {
        if (display_name.trim().length === 0) {
            return res.status(400).json({ error: 'Display name requis' });
        }
        data.display_name = display_name;
    }

    if (email !== undefined) {
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Email invalide' });
        }
        data.email = email.trim().toLowerCase();
    }

    try {
        const user = await userService.updateProfile(req.user.id, data);
        return res.status(200).json({
            id: user.id,
            email: user.email,
            username: user.username,
            display_name: user.display_name,
            avatar_url: user.avatar_url,
        });
    }
    catch (err) {
        if (err.code === 'EMAIL_TAKEN') {
            return res.status(409).json({ error: 'Email deja utilise' });
        }
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
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

async function changePassword(req, res) {
    const { current_password, new_password } = req.body;

    try {
        await userService.changePassword(req.user.id, current_password, new_password);
        return res.status(200).json({ message: 'Mot de passe mis a jour' });
    }
    catch (err) {
        if (err.code === 'INVALID_CURRENT_PASSWORD') {
            return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
        }
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

async function deleteAccount(req, res) {
    const { password } = req.body;

    try {
        await userService.deleteAccount(req.user.id, password);
        res.clearCookie('token', COOKIE_OPTIONS);
        return res.status(200).json({ message: 'Compte supprime' });
    }
    catch (err) {
        if (err.code === 'INVALID_PASSWORD') {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

module.exports = { getProfile, getPublicProfile, updateProfile, uploadAvatar, changePassword, deleteAccount };