// TODO: connexion/déconnexion des joueurs, diffusion des coups en live, chat temps réel
const rooms = {};

function handleConnection(ws, req) 
{
  ws.userId = req.userId;
  ws.currentRoom = null;

  console.log('WebSocket connecté :', ws.user, ws.userId);

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);

      if (message.type === 'joinRoom') {
        if (!rooms[message.roomId])
          rooms[message.roomId] = [];
        rooms[message.roomId].push(ws);
        ws.currentRoom = message.roomId;
        console.log(`${ws.userId} a rejoint la room ${message.roomId}`);
      }

      if (message.type === 'chat') {
        broadcast(ws.currentRoom, {
          type: 'chat',
          user: ws.userId,
          text: message.text
        });
      }
    } catch (error) {
      console.error('Message invalide (pas du JSON):', data.toString());
    }
  });

  ws.on('close', () => {
    if (ws.currentRoom && rooms[ws.currentRoom]) {
      rooms[ws.currentRoom] = rooms[ws.currentRoom].filter(w => w !== ws);
      if (rooms[ws.currentRoom].length === 0) {
        delete rooms[ws.currentRoom];
      }
    }
    console.log('WebSocket déconnecté :', ws.userId);
  });
}

function broadcast(roomId, data, except = null) {
  const room = rooms[roomId];
  if (!room) return;

  room.forEach(client => {
    if (client !== except && client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
}

module.exports = { handleConnection };
