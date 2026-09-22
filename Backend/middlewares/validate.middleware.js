// TODO: validation plus poussée des inputs (format email, force du mot de passe...)
// Pour l'instant, la vérification de base (présence des champs) est faite directement dans auth.controller.js
// force du mot de passe a determiner

function validateSignup(req, res, next) {
    const { email, password, username } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email invalide' });
    }

    if (!password || password.length < 8) {
        return res.status(400).json({ error: 'Mot de passe trop court (8 caracteres minimum)' });
    }

    if (!username || username.trim().length === 0) {
        return res.status(400).json({ error: 'Username requis' });
    }

    next();
}

module.exports = { validateSignup };