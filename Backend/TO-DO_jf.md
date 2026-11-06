# TO-DO JF — WebSocket

## Fait
- [x] Serveur WS branché sur le HTTPS existant (`websocket/server.js`, appelé depuis `server.js:52` ; chemin `/ws`, 401 sans JWT valide, `ws.user` attaché)
- [x] Auth au handshake : `websocket/auth/auth.service.js` (`parseCookies` + `verifyToken` sur le cookie `token`, **avec fallback `?token=` encore actif** — cf. bugs)
- [x] Routeur `websocket/connection.handler.js` : table `handlers` = `wsProfile`, `createRoom`, `joinRoom`, `leaveRoom`, `roomInfo`, `chat`, `quiz`, `mousePosition` ; `ws.username` / `ws.userId` / `ws.currentRoom` attachés à la connexion
- [x] `websocket/rooms/room.manager.js` : room `PUBLIC` permanente, `createRoom` (code 6 chars → `roomCreated`), `joinRoom` (refus `errorRoom` si room inconnue → `roomJoined`), `leaveRoom` (room vide supprimée après 10 s via `deleteTimeout`), `broadcast`, `roomInfo`, `sendMousePosition` ; `hasJoined` / `player_left` envoyés en `{ type:'chat', data:{...} }`
- [x] Chat : `websocket/handlers/chat.handler.js` → broadcast `{ type:'chat', data:{ type:'chat', user, text } }`
- [x] Cycle quiz `websocket/game/quiz.game.js`, branché via sous-routeur `websocket/handlers/quiz.handler.js` (`quiz` → `proposeQuiz` / `onAnswer` / `requestGameState`) : phase `vote` (5 s) → `endVote` → `startGame` → question 15 s → `revealAnswers` 5 s (3 pts si bonne réponse) → `endGame` ; `gameState` broadcast à chaque changement ; réponses joueurs via `onAnswer` (Map `answered`, scores en Map)
- [x] Front : `Hooks/GameSocketProvider.jsx` monté dans `main.jsx` (une seule WS partagée entre toutes les pages, ouverte dès le chargement) + `Hooks/useGameSocket.js` (simple contexte) ; routes `/quiz/online` (OnlineMenu), `/room/:roomId` (Room, `joinRoom` auto à la connexion), `/game/:roomId` (GamePage → GameRoom) ; HomePage pointe sur `/quiz/online`
- [x] Ports alignés : front et back sur 3000 (`wss://localhost:3000/ws` côté front, `.env` a `PORT=3000`)

## Bugs à corriger
- [ ] `connection.handler.js` : un seul `try/catch` englobe le `JSON.parse` ET l'appel du handler → séparer (un JSON invalide ne doit pas être logué comme une erreur de handler)
- [ ] Routeur général : type de message inconnu → simple `console.error`, aucun `ERROR` renvoyé au client (seul `quizHandler` le fait)
- [ ] `console.log` de debug encore partout : `connection.handler.js` (chaque message reçu), `room.manager.js` (`broadcast`, `deleteTimeout`), `quiz.game.js` (`categoryName`), `GameSocketProvider.jsx` (token + emojis à chaque événement WS)
- [ ] Double canal de token toujours actif des deux côtés : le front envoie `?token=` dans l'URL (`GameSocketProvider.jsx`, token lu dans `localStorage`) et le back l'accepte toujours (`auth.service.js` fallback `tokenFromURL`) → retirer le fallback back + le query param front, cookie `httpOnly` uniquement
- [ ] `GameRoom.jsx` lit `msg.user` / `msg.text` à la racine alors que le chat back envoie `data.user` / `data.text` → affichage du chat cassé côté GameRoom
- [ ] `onAnswer` : `answered` est une `Map`, un 2e envoi écrase la 1re réponse (pas d'anti double-réponse strict) ; score fixe 3 pts, pas de bonus de rapidité
- [ ] `endGame` (`quiz.game.js`) : `sendGameState` appelé 2 fois (avant ET après `delete games[roomId]`) → le 2e broadcast est vide/inutile

## Flux online (cible : cf. `websocket-flow.html` à la racine du repo)
- [x] Entrée online : HomePage → `/quiz/online` (`OnlineMenu`) ; WS ouverte dès le chargement via le Provider global (pas de `joinRoom` auto global)
- [ ] `OnlineMenu` : fenêtre 3 boutons — seul "Créer" existe (`createRoom` → `roomCreated` → navigate `/room/:roomId`) ; rejoindre par code et partie rapide manquants (`joinRoom` est commenté dans OnlineMenu)
- [ ] `matchmaking.js` : `quickMatch` (file par thème), `cancelMatchmaking`, `match_found` (room auto + startGame auto en 1v1) — n'existe pas
- [x] `createRoom` : code court (6 chars) généré par le serveur, message `roomCreated { roomId }` (le nom de room envoyé par le front est ignoré côté back)
- [x] `joinRoom` par code depuis l'URL (`Room.jsx` envoie `joinRoom { roomId }` à la connexion) + validation back (`errorRoom` si room inconnue)
- [ ] Fin de partie : sauvegarde en base (QuizAttempt / UserAnswer) + revanche — `endGame` ne sauvegarde rien en base

## Robustesse / sécurité
- [ ] Heartbeat ping/pong (30 s) + `ws.on('error')` — absents des deux côtés
- [ ] Valider les entrées (roomId string, `chat.text` non vide/tronqué, `answerId` entier) et limiter 2 joueurs par room — `joinRoom` accepte N membres sans plafond
- [ ] Renvoyer un `ERROR` au client sur type inconnu (routeur général) ou entrée invalide
- [ ] Joueur qui quitte en pleine partie : `leaveRoom` sur `close` OK, mais `games[roomId]` garde le partant dans `scores`/`answered` (si `answered.size < scores.size`, `revealAnswers` attend le timer 15 s) ; pas de victoire par abandon en 1v1
- [ ] `rooms` est un objet `{}` → proto pollution possible (`__proto__` comme roomId) : passer en `Map` ; vérifier `origin` au handshake (`websocket/server.js` ne le fait pas)

## Décisions
- Format des messages : le chat envoie `{ type:'chat', data:{ type:'chat', user, text } }` (type dupliqué en imbriqué) tandis que `gameState` / `roomJoined` / `roomCreated` mettent tout dans `data`, et `GameRoom` lit à plat — uniformiser front/back
- Reconnexion d'un joueur en cours de partie : autorisée ou forfait ?
