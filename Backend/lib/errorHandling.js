const ERRORS = {
    EMAIL_TAKEN: { status: 409, message: 'Email deja utilise' },
    USERNAME_TAKEN: { status: 409, message: 'Username deja utilise' },
    INVALID_CREDENTIALS: { status: 401, message: 'Email ou mot de passe invalide' },
    INVALID_CURRENT_PASSWORD: { status: 401, message: 'Mot de passe actuel incorrect' },
    INVALID_PASSWORD: { status: 401, message: 'Mot de passe incorrect' },
    USER_NOT_FOUND: { status: 404, message: 'Utilisateur introuvable' },
    NOT_FOUND: { status: 404, message: 'Demande introuvable' },
    SELF_REQUEST: { status: 400, message: 'Impossible de s\'ajouter soi-meme' },
    ALREADY_EXISTS: { status: 409, message: 'Demande deja existante ou vous etes deja amis' },
    NOT_ADDRESSEE: { status: 403, message: 'Non autorise a repondre a cette demande' },
    REQUEST_NOT_PENDING: { status: 409, message: 'Cette demande n\'est plus en attente' },
    NOT_PARTICIPANT: { status: 403, message: 'Non autorise a supprimer cette amitie' },
    NOT_FRIENDS: { status: 409, message: 'Vous n\'etes pas amis' },
    SELF_BLOCK: { status: 400, message: 'Impossible de se bloquer soi-meme' },
    ALREADY_BLOCKED: { status: 409, message: 'Utilisateur deja bloque' },
    NOT_BLOCKED: { status: 409, message: 'Utilisateur non bloque' },
};

function serviceError(code) {
    const definition = ERRORS[code];

    let message = code;
    if (definition) {
        message = definition.message;
    }

    const err = new Error(message);
    err.code = code;
    return err;
}

function sendServiceError(res, err) {
    const definition = ERRORS[err.code];

    if (!definition) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }

    return res.status(definition.status).json({ error: definition.message });
}

module.exports = { serviceError, sendServiceError };
