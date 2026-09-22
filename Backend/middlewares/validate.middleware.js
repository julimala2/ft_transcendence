// TODO: validation plus poussée des inputs (format email, force du mot de passe...)
// Pour l'instant, la vérification de base (présence des champs) est faite directement dans auth.controller.js
// force du mot de passe a determiner

function validateSignup(req, res, next) {
    const { email, password, username } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/; // caracteres speciaux acceptes : ! @ # $ % ^ & * ( ) _ + - = [ ] { } ; ' : " \ | , . < > / ?

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

module.exports = { validateSignup, validateLogin };