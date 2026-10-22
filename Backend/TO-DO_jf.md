# TO-DO JF — WebSocket

## Fait
- [x] Serveur WS branché sur le HTTPS existant (`/ws` uniquement, 401 sans cookie JWT valide, `ws.user` attaché)
- [x] Auth par cookie `httpOnly` (fallback `?token=` commenté dans `auth.js`)
- [x] Routeur `gameSocket.js` + handlers `joinRoom`, `chat`, `startGame`, `leaveRoom`
- [x] `rooms.js` : join/leave/broadcast, room vide supprimée, `joined_room` / `player_joined` / `player_left`
- [x] Cycle quiz complet : `quizGame.js` (question 15 s, reveal 3 s, GAME_OVER) + `answerQuestionHandler` (score, anti double-réponse)
- [x] Front : hook `useGameSocket` + `GameRoom.jsx` (chat fonctionnel)

## Bugs à corriger
- [ ] `startGame` : appelé `handler(ws, message)` alors que `startGame(roomId, quizId)` → wrapper dans gameSocket.js
- [ ] `answer` non enregistré dans la table `handlers` → aucun message de jeu ne passe
- [ ] Front : deux dossiers de hooks (`Hooks/` et `hooks/`), aucun des deux n'est bon — `Hooks/` (importé) envoie `?token=` mort et lit `data.data.user` dans `joined_room` ; `hooks/` écoute `userJoined` jamais émis. Garder un seul dossier, écouter `player_joined` (`data.data.user`) et `player_left`
- [ ] `useGameSocket` vise le port 3000, le back écoute sur 3010
- [ ] `joinRoom` sans validation : room inconnue ou pleine → ERROR au lieu de créer une room vide
- [ ] `gameSocket.js` : séparer le `catch` du `JSON.parse` de celui des handlers
- [ ] Retirer les `console.log` de debug (token, URL)

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
- Format des messages : à plat ou `{ type, data }` — uniformiser front/back (`question` minuscule vs `PLAYER_ANSWERED` majuscule)
- Reconnexion d'un joueur en cours de partie : autorisée ou forfait ?
