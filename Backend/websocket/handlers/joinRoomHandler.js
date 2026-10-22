const rooms = require('../rooms');

function joinRoomHandler(ws, message) {
    rooms.leaveRoom(ws);
    rooms.joinRoom(message.roomId, ws);
    message.gameType
}

module.exports = { joinRoomHandler };