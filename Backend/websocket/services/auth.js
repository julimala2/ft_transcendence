const { parseCookies, tokenFromURL, verifyToken } = require('./tokenVerify');

function authenticateUpgrade(req) {
    const cookies = parseCookies(req.headers.cookie);
    let token = cookies.token;

 //   if (!token) {   token = tokenFromURL(req.url, req.headers.host); }   
    if (!token) { return null; }
    return verifyToken(token);
}

module.exports = { authenticateUpgrade };