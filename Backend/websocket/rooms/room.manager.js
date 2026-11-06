const rooms = {};
const PUBLIC = 'PUBLIC';
rooms[PUBLIC] = { messages:  [], members: [], owner: null };

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
  if(rooms[ws.currentRoom]?.deleteTimeout){
    console.log("deleteTimeout cleared");
    clearTimeout(rooms[ws.currentRoom].deleteTimeout);
  }
  ws.send(JSON.stringify({ 
    type: 'roomJoined', data: { user: ws.username, roomId : message.roomId} }));
}

function createRoom(message, ws) {  
  const roomId = Math.random().toString(36).substr(2, 6).toUpperCase();
  //verifier que le rommId existe pas deja
  rooms[roomId] = { messages:[], members: [ws], owner: ws.userId };
  ws.currentRoom = roomId;
  ws.send(JSON.stringify({ type: 'roomCreated', data: {roomId: roomId}})); 
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

    //If empty, wait 10 sec then delete room
   if (rooms[roomId].members.length === 0 && roomId !== 'PUBLIC') {
    rooms[roomId].deleteTimeout = setTimeout(() =>{
      delete rooms[roomId];
    }, 10000);
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


function sendMousePosition(data, ws) {
  broadcast(ws.currentRoom, {
    type: 'mousePosition',
    data: {
      user: ws.username,
      x: data.x,
      y: data.y,
    }
  }, ws);
}
//{type : "gameState", data : { phase : "vote", data : {question} , players, scores, timer }}
//{type : "gameState", data : { phase : "question", questionText : "blabla ?" , answers, players, scores, timer }}

function broadcast(roomId, data, except = null) {
  const room = rooms[roomId];
  if (!room) return;

  if (data.type !== 'gameState')
    rooms[roomId].messages.push(data.data);
  room.members.forEach(ws => {
    if (ws !== except && ws.readyState === 1) {
      ws.send(JSON.stringify(data));
    }
  });
      if (data.type !== 'mousePosition')
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

module.exports = { joinRoom, createRoom, leaveRoom, broadcast, getRoomMembers, sendMousePosition, roomInfo };