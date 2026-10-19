const { getProfile } = require('../src/services/user.service');
const { joinRoomHandler } = require('./handlers/joinRoomHandler');
const { chatHandler } = require('./handlers/chatHandler');
const { leaveRoom } = require('./rooms');

const handlers = {
  joinRoom: joinRoomHandler,
  chat: chatHandler,
  leaveRoom: leaveRoom,
};

async function handleConnection(ws, req) 
{
  const profile = await getProfile(ws.user.id);
  ws.username = profile.username;
  ws.userId = ws.user.id;
  ws.currentRoom = null;


  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      const handler = handlers[message.type];
      console.log('[WEBSOCKET] Message reçu (', ws.username, '):', handler);

      if (handler) {
        handler(ws, message);
      } 
      else {
        console.error('[WEBSOCKET] Type de message inconnu:', message.type);
      } 

    }
    catch (error) {
      console.error('[WEBSOCKET] Message invalide (pas du JSON):', data.toString());
    }
  });

  ws.on('close', () => {
    leaveRoom(ws);
    console.log('WebSocket déconnecté :', ws.userId);
  });
}



module.exports = { handleConnection };
