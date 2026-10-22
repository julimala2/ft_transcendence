const rooms = {};

function joinRoom(roomId, ws) {
  if (!rooms[roomId]) {
    ws.send(JSON.stringify({ type: 'errorRoom', message: 'Room does not exist.' }));
    return;
  }
  rooms[roomId].members.push(ws);
  ws.currentRoom = roomId;
  broadcast(roomId, {type: 'joinedRoom', data: {
    user: ws.username}}, 
    ws);
  ws.send(JSON.stringify({ 
    type: 'joinedRoom', data: { user: ws.username, roomId, roomName: rooms[roomId].name } }));
}

function createRoom(roomName, ws) {  
  const roomId = Math.random().toString(36).substr(2, 6).toUpperCase();
  rooms[roomId] = { name: roomName, members: [ws], owner: ws.userId };
  ws.currentRoom = roomId;
  ws.send(JSON.stringify({ type: 'roomCreated', data: { roomId, roomName } })); 
}

function leaveRoom(ws) {
  const roomId = ws.currentRoom;
  if (roomId && rooms[roomId]) 
  {
    rooms[roomId].members = rooms[roomId].members.filter(w => w !== ws);
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
}

function broadcast(roomId, data, except = null) {
  const room = rooms[roomId];
  if (!room) return;

  room.forEach(ws => {
    if (ws !== except && ws.readyState === 1) {
      ws.send(JSON.stringify(data));
    }
  });
}

function getRoomMembers(roomId) {
  return rooms[roomId] || [];
}


module.exports = { joinRoom, createRoom, leaveRoom, broadcast, getRoomMembers };