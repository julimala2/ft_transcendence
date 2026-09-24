const jwt = require('jsonwebtoken');

function parseCookies(header = '') {
    return Object.fromEntries(
        header.split(';')
        .filter(Boolean)
        .map((pair) => {
            const [key, ...rest] = pair.trim().split('=');
            return [key, decodeURIComponent(rest.join('='))];
        })
    )
}

function authenticateUpgrade(req) {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies.token;
    if (!token) {
        return null;
    }
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
    catch {
        return null;
    }
}

module.exports = { authenticateUpgrade };