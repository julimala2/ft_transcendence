# TO-DO JF — WebSocket

## Fait

### Backend
- [x] `ws` installé, `WebSocketServer({ noServer: true })` branché sur le serveur HTTPS existant (`server.js`)
- [x] Handshake sur `/ws` uniquement (le reste est `socket.destroy()`)
- [x] Authentification JWT avant `handleUpgrade` (401 sinon), `ws.user` attaché à la connexion
- [x] `websocket/auth.js` + `services/tokenVerify.js` (cookie, avec fallback `?token=` dans l'URL)
- [x] `gameSocket.js` : `handleConnection`, parsing JSON dans un try/catch, dispatch via table `handlers`
- [x] `rooms.js` : `joinRoom`, `leaveRoom`, `broadcast` (vérifie `readyState === 1`), `getRoomMembers`
- [x] Handlers `joinRoom` et `chat`
- [x] Nettoyage de la room à la déconnexion (`ws.on('close')`)
- [x] Création de room + partie 1v1 dans une room (dernier commit)

### Frontend
- [x] Hook `useGameSocket` : connexion `wss://`, `joinRoom` à l'ouverture, `send`, `sendChat`, fermeture au démontage
- [x] Composant `GameRoom.jsx`
- [x] Réception des messages `chat` et `userJoined`

## À faire

### Bugs / incohérences à corriger en priorité
- [x] `joinRoom` ne quitte pas l'ancienne room : appeler `leaveRoom(ws)` au début de `joinRoom`
- [x] `leaveRoom` ne remet pas `ws.currentRoom = null`
- [ ] Le front écoute0 `userJoined` mais le serveur ne l'envoie jamais : broadcaster à l'arrivée d'un joueur (et `userLeft` au départ)
- [ ] `chatHandler` : si le client n'est dans aucune room (`currentRoom === null`), ne rien faire explicitement
- [ ] `gameSocket.js` : le `catch` affiche « pas du JSON » pour toute erreur, y compris un bug dans un handler → séparer `JSON.parse` de l'appel du handler
- [ ] `quizGame.js` est incomplet : pas de `module.exports`, `revealAnswer` n'existe pas, `startGame` n'est appelée nulle part, le `catch` de `startGame` avale l'erreur sans rien dire
- [ ] `quizGame.js` : `member.userId` → vérifier que ça correspond bien à `ws.userId` (`members` sont des `ws`)
- [ ] `quizGame.js` : `game.answered = new Map()` est réinitialisé après le `setTimeout`, à mettre avant `broadcast`

### Logique de jeu (quiz)
- [ ] Handler `startGame` (qui a le droit de lancer ? le créateur de la room ?) + l'enregistrer dans `handlers`
- [ ] Handler `submitAnswer` : utiliser `ws.userId` (jamais un id venu du client), refuser une 2e réponse pour la même question
- [ ] Vérifier la bonne réponse via Prisma (`Answer.isCorrect`) et calculer le score
- [ ] `revealAnswer` : envoyer la bonne réponse et les scores, puis passer à la question suivante
- [ ] Fin de partie : message `gameOver` + classement final, sauvegarde en base (`QuizAttempt` / `UserAnswer`), suppression de `games[roomId]`
- [ ] Nettoyer le timer (`clearTimeout`) si la room se vide en cours de partie
- [ ] Gérer un joueur qui se déconnecte en pleine partie (abandon, victoire de l'autre en 1v1 ?)
- [ ] Décider : que se passe-t-il si un joueur se reconnecte ?
- [ ] Ajouter `async`/`await` + try/catch dans les handlers qui font de l'I/O (Prisma). Dans `gameSocket.js`, passer le `ws.on('message')` en `async` avec `await handler(...)`

### Robustesse
- [ ] Heartbeat ping/pong toutes les 30 s (`isAlive`, `ws.terminate()`), pour supprimer les joueurs fantômes
- [ ] `ws.on('error')` pour ne pas planter sur une erreur de socket
- [ ] Valider les entrées : `roomId` (type string, longueur), `text` du chat (type string, non vide, tronqué à ~300)
- [ ] Limiter la fréquence des messages par client (anti-spam)
- [ ] Passer `rooms` de `{}` à `new Map()` (risque avec `roomId = "__proto__"`), avec un `Set` de sockets par room
- [ ] Limiter le nombre de joueurs par room (2 en 1v1) et renvoyer une erreur si la room est pleine
- [ ] Envoyer un message `error` au client quand un type est inconnu ou une entrée invalide (au lieu d'un simple `console.error`)
- [ ] Vérifier `req.headers.origin` au handshake

### Sécurité
- [ ] Token passé dans l'URL (`?token=`) : il finit dans les logs et l'historique. Préférer le cookie `httpOnly` (nécessite le proxy Vite, cf. cookie `SameSite=Lax`) et supprimer le fallback quand c'est en place
- [x] Le front lisait un token dans `localStorage` (toujours vide) : supprimé, le cookie `httpOnly` est utilisé
- [ ] Une fois le cookie testé en WS, supprimer le fallback `tokenFromURL` dans `auth.js`
- [ ] Ne jamais faire confiance à un `userId` reçu dans un message : toujours `ws.userId`
- [ ] Retirer les `console.log` de debug (token, URL) avant le rendu

### Frontend
- [ ] URL en dur `wss://localhost:3000/ws` → variable d'environnement ou proxy Vite (`/ws` avec `ws: true`)
- [ ] Reconnexion automatique avec backoff exponentiel
- [ ] Afficher l'état de la connexion à l'utilisateur (connecté / reconnexion / erreur)
- [ ] Gérer les messages de jeu : `question`, `timeLeft`, `reveal`, `scores`, `gameOver`
- [ ] Envoyer `submitAnswer` depuis la page de quiz
- [ ] Le `setTimeout` d'une question côté front (barre de temps) doit se baser sur `timeLeft` reçu du serveur, pas sur un timer local indépendant
- [ ] Le cleanup ne ferme la socket que si `readyState === 1` : fermer aussi en `CONNECTING`

### Tests / doc
- [ ] Tester avec `wscat` (JWT dans le cookie ou en query), y compris JSON invalide et type inconnu
- [ ] Tester à deux navigateurs : join, chat, déconnexion, fermeture d'onglet en pleine partie
- [ ] Tester le heartbeat en coupant le wifi d'un client
- [ ] Documenter le protocole de messages (liste des `type`, sens, champs) : dans ce fichier ou dans un `PROTOCOL.md`
- [ ] Décider une fois pour toutes du format : champs à plat (actuel) ou `{ type, payload }`, et l'appliquer des deux côtés

## Décisions à prendre
- Format des messages : à plat ou `type` + `payload`
- Qui lance la partie, et que fait-on si un joueur quitte en cours de partie
- Cookie `httpOnly` (+ proxy Vite) ou token en `localStorage` pour l'auth WS
