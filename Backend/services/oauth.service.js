const userModel = require('../models/user.model');
const oauthAccountModel = require('../models/oauthAccount.model');
const { generateToken } = require('../lib/token');

async function exchangeCodeForToken(code) {
    const response = await fetch('https://api.intra.42.fr/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: process.env.OAUTH_CLIENT_ID,
            client_secret: process.env.OAUTH_CLIENT_SECRET,
            code,
            redirect_uri: process.env.OAUTH_REDIRECT_URI,
        }),
    });
    const data = await response.json();
    return data.access_token;
}

async function fetchFortyTwoProfile(accessToken) {
    const response = await fetch('https://api.intra.42.fr/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.json();
}

async function oauthLogin(code) {
    const accessToken = await exchangeCodeForToken(code);
    const profile = await fetchFortyTwoProfile(accessToken);

    let account = await oauthAccountModel.findByProvider('42', String(profile.id));
    let user;

    if (account) {
        user = await userModel.findById(account.user_id);
    } else {
        user = await userModel.findByEmail(profile.email.toLowerCase());
        if (!user) {
            user = await userModel.create({
                email: profile.email.toLowerCase(),
                password_hash: null,
                username: profile.login,
                display_name: profile.displayname || profile.login,
            });
        }
        await oauthAccountModel.create({
            user_id: user.id,
            provider: '42',
            provider_user_id: String(profile.id),
        });
    }

    const token = generateToken(user);
    return { user, token };
}

module.exports = { oauthLogin };
