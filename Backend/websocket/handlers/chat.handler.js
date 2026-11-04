const { broadcast } = require('../rooms/room.manager');

function chatHandler(message, ws) {
    broadcast(ws.currentRoom, {
          type: 'chat',
          data: {
            type: 'chat',
            user: ws.username,
            text: message.text
          }
        });
}

module.exports = { chatHandler };