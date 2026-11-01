const { broadcast } = require('../rooms');

function chatHandler(message, ws) {
    broadcast(ws.currentRoom, {
          type: 'chat',
          user: ws.username,
          text: message.text
        });
}

module.exports = { chatHandler };