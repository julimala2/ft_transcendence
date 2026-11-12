const { WebSocketServer } = require('ws');
const { authenticateUpgrade } = require('.//auth/auth.service');
const { handleConnection } = require('./connection.handler');

function setupWebSocket(server) {
    const wss = new WebSocketServer({ noServer: true });
    
    const heartbeat = setInterval(() => {
        wss.clients.forEach(ws => {
            if (ws.isAlive === false) return ws.terminate();
            ws.isAlive = false;
            if (ws.readyState === ws.OPEN) ws.ping();
        });
    }, 30000);

    wss.on('close', () => clearInterval(heartbeat));

    server.on('upgrade', (req, socket, head) => {
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
            ws.user = user; 
            wss.emit('connection', ws, req);
        });
    });
    
    wss.on('connection', (ws) => {
        ws.isAlive = true;
        ws.on('pong', () => { ws.isAlive = true; });
        handleConnection(ws);
    });
    return wss;
}

module.exports = setupWebSocket;