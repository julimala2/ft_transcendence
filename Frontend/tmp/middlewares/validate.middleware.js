const { emailRegex, passwordRegex } = require('../../lib/validationPatterns');

function validateRegister(req, res, next) {
    const { email, password, username } = req.body;

    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email invalide' });
    }

    if (!password || !passwordRegex.test(password)) {
        return res.status(400).json({ error: 'Mot de passe trop faible (8 caracteres minimum, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractere special)' });
    }

    if (!username || username.trim().length === 0) {
        return res.status(400).json({ error: 'Username requis' });
    }

    next();
}

function validateLogin(req, res, next) {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email requis' });
    }

    if (!password) {
        return res.status(400).json({ error: 'Mot de passe requis' });
    }

    next();
}

function validateChangePassword(req, res, next) {
    const { current_password, new_password } = req.body;

    if (!new_password || !passwordRegex.test(new_password)) {
        return res.status(400).json({ error: 'Nouveau mot de passe trop faible (8 caracteres minimum, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractere special)' });
    }

    if (current_password !== undefined && typeof current_password !== 'string') {
        return res.status(400).json({ error: 'Mot de passe actuel invalide' });
    }

    next();
}

module.exports = { validateRegister, validateLogin, validateChangePassword };