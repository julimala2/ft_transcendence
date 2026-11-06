const { getProfile } = require('../src/services/user.service');
const { chatHandler } = require('./handlers/chat.handler');
const { createRoom, joinRoom, leaveRoom, roomInfo, sendMousePosition } = require('./rooms/room.manager');
const { quizHandler } = require('./handlers/quiz.handler');
const { wsProfile } = require('./handlers/profile.handler');

 //data : {type: category/custom, nquestions, difficulty,}
const handlers = {
  wsProfile: wsProfile,
  createRoom: createRoom,
  joinRoom: joinRoom,
  leaveRoom: leaveRoom,
  roomInfo: roomInfo,
  chat: chatHandler,
  quiz: quizHandler,
  mousePosition: sendMousePosition,
};

async function handleConnection(ws) 
{
  try{
    const profile = await getProfile(ws.user.id);
    ws.username = profile.username;
    ws.userId = ws.user.id;
    ws.currentRoom = null;
  }
  catch {
    console.log('DB get profile Error.')
    ws.close();
    return;
  }

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      const handler = handlers[message.type];
      if (message.type !== 'mousePosition')
        console.log('[WEBSOCKET] Message reçu (', ws.username, ':', ws.currentRoom, '):',
         handler,' : ', message.data );

      if (handler) {
        handler(message.data, ws);
      } 
      else {
        console.error('[WEBSOCKET] aucun handler pour :', message.type);
      } 
    }
    catch (error) {
      console.error(error.message);
    }
  });

  ws.on('close', () => {
    leaveRoom(null, ws);
    console.log('WebSocket déconnecté :', ws.userId);
  });
}



module.exports = { handleConnection };
