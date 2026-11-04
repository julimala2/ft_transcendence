const { getProfile } = require('../../src/services/user.service');

async function wsProfile(data, ws) {
    ws.send(JSON.stringify({
        type: 'profile',
        data: {
            username: ws.username,
            CurrentRoom : ws.currentRoom}
    }));
}

module.exports = { wsProfile };