// TODO: connexion/déconnexion des joueurs, diffusion des coups en live, chat temps réel

function handleConnection(ws, req) {
  console.log('WebSocket connecté :', ws.user);

  ws.on('message', (data) => {
    console.log('Message reçu :', data.toString());
  });

  ws.on('close', () => {
    console.log('WebSocket déconnecté :', ws.user);
  });
}

module.exports = { handleConnection };
