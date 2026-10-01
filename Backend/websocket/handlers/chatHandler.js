const { broadcast } = require('../rooms');

function chatHandler(ws, message) {
    broadcast(ws.currentRoom, {
          type: 'chat',
          user: ws.userId,
          text: message.text
        });
}

module.exports = { chatHandler };