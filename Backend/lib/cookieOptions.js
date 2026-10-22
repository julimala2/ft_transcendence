const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 12 * 60 * 60 * 1000, // 12h, aligne sur l'expiration du JWT
};

module.exports = { COOKIE_OPTIONS };
