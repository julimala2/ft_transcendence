require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const friendRoutes = require('./src/routes/friends.routes');
const blockRoutes = require('./src/routes/blocks.routes');
const quizRoutes = require('./src/routes/quiz.routes');
const questionRoutes = require('./src/routes/question.routes');
const categoryRoutes = require('./src/routes/category.routes');
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
app.use('/api/blocks', blockRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/quiz-images', express.static('assets/quiz'));


app.get('/', (req, res) => {
  res.send('Hello du backend!');
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
