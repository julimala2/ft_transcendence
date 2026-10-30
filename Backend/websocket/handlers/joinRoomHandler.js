const rooms = require('../rooms');

function joinRoomHandler(message, ws) {
    rooms.leaveRoom(ws);
    rooms.joinRoom(message, ws);
}

module.exports = { joinRoomHandler };