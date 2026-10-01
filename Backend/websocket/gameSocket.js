// TODO: connexion/déconnexion des joueurs, diffusion des coups en live, chat temps réel
const { joinRoomHandler } = require('./handlers/joinRoomHandler');
const { chatHandler } = require('./handlers/chatHandler');
const { leaveRoom } = require('./rooms');

const handlers = {
  joinRoom: joinRoomHandler,
  chat: chatHandler,
};

function handleConnection(ws, req) 
{
  ws.userId = ws.user.id;
  ws.currentRoom = null;

  console.log('WebSocket connecté :', ws.user, ws.userId);

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
       const handler = handlers[message.type];
      if (handler) {
        handler(ws, message);
      } 
      else {
        console.error('Type de message inconnu:', message.type);
      } 

    }
    catch (error) {
      console.error('Message invalide (pas du JSON):', data.toString());
    }
  });

  ws.on('close', () => {
    leaveRoom(ws);
    console.log('WebSocket déconnecté :', ws.userId);
  });
}



module.exports = { handleConnection };
