const rooms = {};
const PUBLIC = 'PUBLIC';
rooms[PUBLIC] = { name: 'Public', messages:  [], members: [], owner: null };

function joinRoom(message, ws) {
  if (!rooms[message.roomId]) {
    ws.send(JSON.stringify({ type: 'errorRoom', message: 'Room does not exist.' }));
    throw new Error(`Room ${message.roomId} does not exist.`);
  }
  if (rooms[message.roomId].members.some(member => member.username === ws.username)) {
    rooms[message.roomId].members = rooms[message.roomId].members.filter(member => member.username !== ws.username);
  }
  rooms[message.roomId].members.push(ws);
  ws.currentRoom = message.roomId;
  broadcast(message.roomId, {type: 'chat', 
    data: {
      type: 'hasJoined',
      user: ws.username}},
    ws);
  ws.send(JSON.stringify({ 
    type: 'roomJoined', data: { user: ws.username, roomId : message.roomId, roomName: rooms[message.roomId].name } }));
}

function createRoom(message, ws) {  
  const roomId = Math.random().toString(36).substr(2, 6).toUpperCase();
  //verifier que le rommId existe pas deja
  rooms[roomId] = { name: message.roomName, messages:[], members: [ws], owner: ws.userId };
  ws.currentRoom = roomId;
  ws.send(JSON.stringify({ type: 'roomCreated', data: rooms[roomId]})); 
}


function leaveRoom(message, ws) {
  if(!ws)
    throw new Error(`User not connected (ws not open).`);
  if(!ws.currentRoom)
    return;
  const roomId = ws.currentRoom;
  if (roomId && rooms[roomId]) 
  {
    rooms[roomId].members = rooms[roomId].members.filter(w => w !== ws);
    ws.currentRoom = null;

   if (rooms[roomId].members.length === 0 && rooms[roomId].name !== 'Public') {
     delete rooms[roomId];
   }
   else {
     broadcast(roomId, {type: 'chat', 
      data: {
        type: 'player_left',
        user: ws.username }}, 
      ws);
   }
  }
}

function broadcast(roomId, data, except = null) {
  const room = rooms[roomId];
  if (!room) return;

  rooms[roomId].messages.push(data.data);
  room.members.forEach(ws => {
    if (ws !== except && ws.readyState === 1) {
      ws.send(JSON.stringify(data));
    }
  });
  console.log(`[WEBSOCKET] Broadcasting to room ${roomId}:`, data);
}

function getRoomMembers(roomId) {
  return rooms[roomId]?.members || [];
}

function roomInfo(data, ws) {
  ws.send(JSON.stringify({ 
    type: 'roomInfo', 
    data: {
      messages: rooms[data.roomId].messages, 
      members: rooms[data.roomId].members.map(ws => ({user: ws.username})) 
    }
  }));
}

module.exports = { joinRoom, createRoom, leaveRoom, broadcast, getRoomMembers, roomInfo };