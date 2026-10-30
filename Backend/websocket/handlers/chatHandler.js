const { broadcast } = require('../rooms');

function chatHandler(message, ws) {
    console.log(ws.currentRoom);
    broadcast(ws.currentRoom, {
          type: 'chat',
          user: ws.username,
          text: message.text
        });
}

module.exports = { chatHandler };