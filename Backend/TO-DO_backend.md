# TO-DO Backend — ft_transcendence

## ✅ Fait

- [x] Squelette Express fonctionnel (`server.js`)
- [x] Schéma DB dégrossi (User, Theme, Question, Amitie)
- [x] Logique hash/compare mot de passe (bcrypt) testée en autonomie

## 🔲 Fondations

- [x] Organiser le code en dossiers (`routes/`, `controllers/`, `prisma/`)
- [ ] Choisir PostgreSQL ou MariaDB --> avec Docker --> utiliser SQLite en attendant
- [ ] Installer Prisma, connecter à la DB, générer le `schema.prisma`
- [x] Créer `.env` (secrets DB, etc.) + `.env.example` (exigé par le sujet)

## 🔲 Authentification

- [x] Route `POST /api/signup` (créer un user, hash password, l'enregistrer en DB)
- [x] Route `POST /api/login` (vérifier email + password avec `bcrypt.compare`)
- [ ] Validation des inputs (email valide, password assez fort) → front ET back (exigé sujet)
- [x] Gestion de session/token pour rester connecté entre les requêtes : choisir entre JWT et session
- [x] OAuth 2.0 (prévoir les champs dans la DB)


## 🔲 Schéma DB — reste à faire

- [ ] Table Partie (multijoueur : relie users ↔ partie, + quel Theme)
- [ ] Table Chat
- [ ] Table Notifications
- [ ] Table Achievement
- [ ] Table Tournois


## 🔲 API (endpoints métier)

- [ ] Thèmes/Questions (lister, créer un thème perso)
- [ ] Profil user (voir/modifier ses infos, stats, niveau)
- [ ] Amis (ajouter/supprimer/lister)
- [ ] Historique de parties / stats de jeu

## 🔲 Temps réel (WebSocket)

- [x] Connexion/déconnexion propre des joueurs
- [ ] Selections/creations des rooms
- [ ] Diffusion des questions/réponses en live pendant une partie
- [x]  Chat en temps réel

## 🔲 Sécurité (exigences du sujet, à ne pas oublier)

- [x] HTTPS pour toute connexion navigateur ↔ backend
- [x] Pas de mots de passe/secrets en clair dans le code (→ `.env`)
