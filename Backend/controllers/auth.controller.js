// TODO: logique appelée par routes/auth.routes.js, utilisera auth/auth.js (hash/compare) + la DB une fois prête
//quelles erreurs d'authentification ? 
//email deja utilise, autre ? 


const authService = require('../services/auth.service');

async function register(req, res) {
    const { email, password, username, display_name } = req.body;

    try {
        const { user, token } = await authService.registerUser({ email, password, username, display_name });
        return res.status(201).json({
            id: user.id,
            email: user.email,
            username: user.username,
            display_name: user.display_name,
            token,
        });
    }
    catch (err) {
        if(err.code === 'EMAIL_TAKEN') {
            return res.status(409).json({ error: 'Email deja utilise' });
        }
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    try {
        const { user, token } = await authService.login({ email, password });
            return res.status(200).json({
            id: user.id,
            email: user.email,
            username: user.username,
            display_name: user.display_name,
            token,
        });
    }
    catch (err) {
        if (err.code === 'INVALID_CREDENTIALS') {
            return res.status(401).json({ error: 'Email ou mot de passe invalide'});
        }
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

function me(req, res) {
    return res.status(200).json(req.user);
}

async function logout(req, res) {
    try {
        await authService.logout(req.user.id);
        return res.status(200).json({ message: 'Deconnecte' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

module.exports = { register, login, me, logout };