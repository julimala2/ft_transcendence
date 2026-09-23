//quelles erreurs d'authentification ? 
//email deja utilise, autre ? 


const authService = require('../services/auth.service');
const oauthService = require('../services/oauth.service');

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 12 * 60 * 60 * 1000, // 12h, aligne sur l'expiration du JWT
};

async function register(req, res) {
    const { email, password, username, display_name } = req.body;

    try {
        const { user, token } = await authService.registerUser({ email, password, username, display_name });
        res.cookie('token', token, COOKIE_OPTIONS);
        return res.status(201).json({
            id: user.id,
            email: user.email,
            username: user.username,
            display_name: user.display_name,
        });
    }
    catch (err) {
        if(err.code === 'EMAIL_TAKEN') {
            return res.status(409).json({ error: 'Email deja utilise' });
        }
        if(err.code === 'USERNAME_TAKEN') {
            return res.status(409).json({ error: 'Username deja utilise' });
        }
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    try {
        const { user, token } = await authService.login({ email, password });
        res.cookie('token', token, COOKIE_OPTIONS);
        return res.status(200).json({
            id: user.id,
            email: user.email,
            username: user.username,
            display_name: user.display_name,
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
        res.clearCookie('token', COOKIE_OPTIONS);
        return res.status(200).json({ message: 'Deconnecte' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

function oauthRedirect(req, res) {
    const params = new URLSearchParams({
        client_id: process.env.OAUTH_CLIENT_ID,
        redirect_uri: process.env.OAUTH_REDIRECT_URI,
        response_type: 'code',
        scope: 'public',
    });

    return res.redirect(`https://api.intra.42.fr/oauth/authorize?${params.toString()}`);
}

async function oauthCallback(req, res) {
    const { code } = req.query;

    try {
        const { user, token } = await oauthService.oauthLogin(code);
        res.cookie('token', token, COOKIE_OPTIONS);
        return res.redirect(process.env.FRONTEND_URL);
    }
    catch (err) {
        console.error(err);
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth`);
    }

}

module.exports = { register, login, me, logout, oauthRedirect, oauthCallback };