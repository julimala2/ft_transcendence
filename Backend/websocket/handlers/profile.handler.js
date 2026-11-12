const { getProfile } = require('../../src/services/user.service');

async function createWsProfile(ws) {
    const profile = await getProfile(ws.user.id);
    ws.username = profile.username;
    ws.userId = ws.user.id;
    ws.currentRoom = null;
    ws.poolCategory = null;
    ws.duelId = null;
}

function getWsProfile(data, ws) {
    ws.send(JSON.stringify({
        type: 'profile',
        data: {
            username: ws.username,
            CurrentRoom : ws.currentRoom}
    }));
}

module.exports = { createWsProfile, getWsProfile };