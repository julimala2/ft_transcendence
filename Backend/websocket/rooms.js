const rooms = {};

function joinRoom(roomId, ws) {
  if (!rooms[roomId]) {
    rooms[roomId] = [];
  }
  rooms[roomId].push(ws);
  ws.currentRoom = roomId;
  console.log(`${ws.user.email} a rejoint la room ${roomId}`);
}

function leaveRoom(ws) {
  const roomId = ws.currentRoom;
  if (roomId && rooms[roomId]) 
  {
    rooms[roomId] = rooms[roomId].filter(w => w !== ws);
    ws.currentRoom = null;
    if (rooms[roomId].length === 0) {
      delete rooms[roomId];
    }
    else {
      broadcast(roomId, {type: 'player_left', data: {
        user: ws.username, userId: ws.userId }}, 
        ws);
    }
  }
    console.log(`${ws.user.email} a quitté la room ${roomId}`);
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

function getRoomMembers(roomId) {
  return rooms[roomId] || [];
}

module.exports = { joinRoom, leaveRoom, broadcast, getRoomMembers };