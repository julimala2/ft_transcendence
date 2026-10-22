# TO-DO JF — WebSocket

## Fait
- [x] Serveur WS branché sur le HTTPS existant (`/ws`, 401 sans cookie JWT valide, `ws.user` attaché)
- [x] Auth par cookie `httpOnly` uniquement (`services/auth.js` — le fallback `?token=` a été retiré)
- [x] Routeur : `websocket/handlers/connectionHandler.js` branché dans `server.js` + handlers `joinRoom`, `chat`, `startGame`, `leaveRoom`
- [x] `rooms.js` : join/leave/broadcast, room vide supprimée, `joined_room` / `player_left` au format `{ type, data }`
- [x] Cycle quiz : `quizGame.js` (question 15 s, `revealAnswer` 3 s, `gameOver`) — mais sans réponses joueurs (cf. bugs)
- [x] Front : un seul dossier `Hooks/useGameSocket.js` + `GameRoom.jsx` (chat fonctionnel, lit bien `joined_room` / `data.data.user`)
- [x] Ports alignés : front et back sur 3000 (`server.js` écoute `process.env.PORT`, `.env` a `PORT=3000`)

## Bugs à corriger
- [ ] `answer` absent de la table `handlers` (`connectionHandler.js`) : `quizHandler.js` (`answerQuestionHandler`, score + anti double-réponse) existe mais n'est jamais importé → aucune réponse de joueur ne passe
- [ ] `startGame(roomId, quizId)` appelé `handler(ws, message)` → wrapper dans un `startGameHandler` (comme les autres handlers)
- [ ] `joinRoom` sans validation : room inconnue ou pleine → ERROR au lieu de créer une room vide (ligne orpheline `message.gameType` dans `joinRoomHandler.js` à supprimer)
- [ ] `connectionHandler.js` : séparer le `catch` du `JSON.parse` de celui des handlers
- [ ] Retirer les `console.log` de debug (handler loggué à chaque message côté back ; token loggé côté front dans `useGameSocket.js:13`)
- [ ] Front : `useGameSocket.js:18` envoie toujours `?token=` dans l'URL alors que le back ne l'accepte plus — supprimer le query param (le cookie part automatiquement)
- [ ] `tokenFromURL` importé mais inutilisé dans `auth.js` — retirer l'import ou le fallback

## Flux online (cible : cf. `websocket-flow.html`)
- [ ] Route `/game/online` : remplacer le lien dur `/game/1` de HomePage, ouvrir la WS à l'arrivée (pas de `joinRoom` auto)
- [ ] Fenêtre 3 boutons : Partie rapide / Créer une room / Rejoindre une room
- [ ] `matchmaking.js` : `quickMatch` (file par thème), `cancelMatchmaking`, `match_found` (room auto + startGame auto en 1v1)
- [ ] `createRoom` : code court généré par le serveur + nom libre (affichage), message `room_created`
- [ ] `joinRoom` par code (avec la validation ci-dessus)
- [ ] Fin de partie : sauvegarde en base (QuizAttempt / UserAnswer) + revanche

## Robustesse / sécurité
- [ ] Heartbeat ping/pong (30 s) + `ws.on('error')`
- [ ] Valider les entrées (roomId string, text non vide/tronqué) et limiter 2 joueurs par room
- [ ] Renvoyer un `ERROR` au client sur type inconnu ou entrée invalide
- [ ] Joueur qui quitte en pleine partie : abandon, victoire de l'autre en 1v1 ?
- [ ] `rooms` en `Map` (proto pollution) + vérifier `origin` au handshake

## Décisions
- Format des messages : `{ type, data }` à plat pour le chat (`chatHandler` envoie `user`/`text` hors de `data`) — uniformiser front/back
- Reconnexion d'un joueur en cours de partie : autorisée ou forfait ?
