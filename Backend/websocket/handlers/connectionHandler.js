const { getProfile } = require('../../src/services/user.service');
const { joinRoomHandler } = require('./joinRoomHandler');
const { chatHandler } = require('./chatHandler');
const { leaveRoom } = require('../rooms');
const { createRoom } = require('../rooms');
const { roomInfo } = require('../rooms');
const { quizHandler } = require('./quizHandler');
const { wsProfile } = require('./profileHandler');

 //data : {type: category/custom, nquestions, difficulty,}
const handlers = {
  createRoom: createRoom,
  joinRoom: joinRoomHandler,
  leaveRoom: leaveRoom,
  chat: chatHandler,
  roomInfo: roomInfo,
  wsProfile: wsProfile,
  quiz: quizHandler
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
      console.log(message); 
      const handler = handlers[message.type];
      console.log('[WEBSOCKET] Message reçu (', ws.username, '):', handler, ws.currentRoom);

      if (handler) {
        handler(message.data, ws);
      } 
      else {
        console.error('[WEBSOCKET] Type de message inconnu:', message.type);
      } 
      console.log('[WEBSOCKET] Message reçu (', ws.username, '):', handler, ws.currentRoom);
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
