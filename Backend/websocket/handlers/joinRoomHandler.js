const rooms = require('../rooms');

function joinRoomHandler(message, ws) {
    // rooms.leaveRoom(message,ws);
    rooms.joinRoom(message, ws);
}

module.exports = { joinRoomHandler };