const rooms = {};

function joinRoom(message, ws) {
  if (!rooms[message.roomId]) {
    ws.send(JSON.stringify({ type: 'errorRoom', message: 'Room does not exist.' }));
    return;
  }
  rooms[message.roomId].members.push(ws);
  ws.currentRoom = message.roomId;
  // broadcast(message.roomId, {type: 'joinedRoom', data: {
  //   user: ws.username}},
  //   ws);
  ws.send(JSON.stringify({ 
    type: 'joinedRoom', data: { user: ws.username, roomId : message.roomId, roomName: rooms[message.roomId].name } }));
}

function createRoom(message, ws) {  
  const roomId = Math.random().toString(36).substr(2, 6).toUpperCase();
  //verifier que le rommId existe pas deja
  rooms[roomId] = { name: message.roomName, members: [ws], owner: ws.userId };
  ws.currentRoom = roomId;
  console.log(ws.currentRoom);
  ws.send(JSON.stringify({ type: 'roomCreated', data: { roomId, roomName: message.roomName } })); 
}

function leaveRoom(ws) {
  const roomId = ws.currentRoom;
  if (roomId && rooms[roomId]) 
  {
    rooms[roomId].members = rooms[roomId].members.filter(w => w !== ws);
    ws.currentRoom = null;
//    if (rooms[roomId].members.length === 0) {
//      delete rooms[roomId];
//    }
//    else {
//      broadcast(roomId, {type: 'player_left', data: {
//        user: ws.username, userId: ws.userId }}, 
//        ws);
//    }
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
  console.log(`[WEBSOCKET] Broadcasting to room ${roomId}:`, data);
}

function getRoomMembers(roomId) {
  return rooms[roomId] || [];
}


module.exports = { joinRoom, createRoom, leaveRoom, broadcast, getRoomMembers };