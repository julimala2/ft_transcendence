const rooms = require('../rooms');

function joinRoomHandler(ws, message) {
    rooms.joinRoom(message.roomId, ws);
}

module.exports = { joinRoomHandler };