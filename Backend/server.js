require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const friendRoutes = require('./src/routes/friends.routes');
const app = express();
const { WebSocketServer } = require('ws');
const { authenticateUpgrade } = require('./websocket/auth');
const { handleConnection } = require('./websocket/gameSocket');

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/friends', friendRoutes);


//app.use(cors());          <--- Doublon avec ligne 16 ?
//app.use(express.json());  <----|

app.get('/', (req, res) => {
  res.send('Hello du backend!');
});

app.get('/api/getrequest',async (req,res) => {
  // const result = await pool.query('SELECT * FROM TEST');
  console.log('Api Get request');
  await new Promise(resolve => setTimeout(resolve, 1000)); //Timer pour simuler latence serveur
  res.json(fakeUsers);
});

app.post('/api/postrequest', async (req,res) => {
  console.log('API Post request :',req.body);
  const fakeMsg = [
    {id : 1, message: "Get request recue", test: "test"}
  ]
  await new Promise(resolve => setTimeout(resolve, 2000)); //Timer pour simuler latence serveur
  res.json(fakeMsg);
});

const options = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH),
};
const server = https.createServer(options, app);

const wss = new WebSocketServer({ noServer: true });
server.on('upgrade', (req, socket, head) => //HANDSHAKE WebSocket
{
  if (!req.url.startsWith('/ws')) {
    socket.destroy();
    return;
  }
  
  const user = authenticateUpgrade(req);
  if (!user) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }
  wss.handleUpgrade(req, socket, head, (ws) => {
    ws.user = user; // Attache l'utilisateur authentifié à la connexion WebSocket
    wss.emit('connection', ws, req);
  });
});

wss.on('connection', handleConnection);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
