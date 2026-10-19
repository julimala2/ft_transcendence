# Projet

alwaysApply: true

## Objectif
Ce projet est une application web full‑stack visant à fournir un tableau de bord interactif avec authentification, gestion des données en temps réel et API REST.

## Stack
- **Front‑end** : React + TailwindCSS, Vite, TypeScript.
- **Back‑end** : Node.js (ESM), Express, TypeScript.
- **Base de données** : PostgreSQL via Prisma ORM.
- **WebSocket** : Socket.IO pour les notifications en temps réel.

## Structure des dossiers
```
backend/          # API REST et logique métier
  ├─ src/
  │   ├─ routes/          # fichiers de routes
  │   ├─ controllers/     # gestionnaires de requêtes
  │   ├─ services/        # logique métier
  │   ├─ models/          # schémas Prisma
  │   └─ utils/           # utilitaires
  └─ tests/            # tests unitaires

frontend/         # SPA React
  ├─ src/
  │   ├─ components/   # composants UI
  │   ├─ pages/        # pages de l’application
  │   ├─ hooks/        # hooks personnalisés
  │   ├─ api/          # wrappers API
  │   └─ styles/       # Tailwind configuration
  └─ public/

websocket/        # serveur Socket.IO
  └─ src/

.continue/        # fichiers d’automatisation
  └─ rules/
```

## Routes principales (backend)
- `GET /api/users` – Liste des utilisateurs (authentifié).
- `POST /api/auth/login` – Authentification.
- `POST /api/auth/register` – Inscription.
- `GET /api/data` – Récupération des données principales.
- `POST /api/data` – Ajout d’une entrée.

## Commandes de lancement
```bash
# Installation des dépendances
npm ci

# Lancement du backend
npm run dev:backend

# Lancement du frontend
npm run dev:frontend

# Lancement du serveur WebSocket
npm run dev:socket

# Tests
npm test
```

## Lancer en mode de production
```bash
npm run build:backend
npm run build:frontend
# déployer les deux builds
```