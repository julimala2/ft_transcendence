const jwt = require('jsonwebtoken');

function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
    catch {
        return null;
    }
}

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

function  tokenFromURL(url, host) {
    const parsedUrl = new URL(url, `http://${host}`);
    return parsedUrl.searchParams.get('token');
}



module.exports = { verifyToken, parseCookies, tokenFromURL };