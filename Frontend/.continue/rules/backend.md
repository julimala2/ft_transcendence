---
name: Backend structure
description: Explication de la structure du backend et des systèmes métiers (quiz, questions, comptes, etc.)
alwaysApply: false
---

## Structure générale du backend

Le backend est organisé en plusieurs couches :
- **Routes** : Définissent les points d'entrée de l'API
- **Controllers** : Gèrent les requêtes et appellent les services
- **Services** : Contiennent la logique métier
- **Models** : Définissent les schémas de données avec Prisma

## Systèmes métiers principaux

### Quiz
- **Création** : POST /api/quizzes
- **Lecture** : GET /api/quizzes (liste) ou GET /api/quizzes/:id (détail)
- **Mise à jour** : PUT /api/quizzes/:id
- **Suppression** : DELETE /api/quizzes/:id
- **Logique** : Les quiz sont liés à des questions et peuvent être filtrés par catégorie

### Questions
- **Création** : POST /api/questions
- **Lecture** : GET /api/questions (liste) ou GET /api/questions/:id (détail)
- **Mise à jour** : PUT /api/questions/:id
- **Suppression** : DELETE /api/questions/:id
- **Logique** : Les questions sont associées à des quiz via les relations Prisma

### Comptes utilisateurs
- **Inscription** : POST /api/auth/register
- **Connexion** : POST /api/auth/login
- **Profil** : GET /api/auth/me (informations utilisateur connecté)
- **Mise à jour** : PUT /api/users/:id (profil utilisateur)
- **Suppression** : DELETE /api/users/:id

### Amis
- **Liste** : GET /api/friends
- **Ajout** : POST /api/friends (demande d'amitié)
- **Acceptation** : POST /api/friends/:id/accept
- **Refus** : POST /api/friends/:id/reject

### Catégories
- **Liste** : GET /api/categories
- **Détail** : GET /api/categories/:id

### Tentatives de quiz
- **Création** : POST /api/attempts (enregistrer un résultat)
- **Récupération** : GET /api/attempts/:id (historique)

## Comment ajouter une question
1. Vérifier que le quiz existe
2. Créer la question via POST /api/questions
3. Associer la question au quiz (via les relations dans le modèle Prisma)

## Comment mettre à jour les informations d'un quiz
1. Utiliser PUT /api/quizzes/:id
2. Les données mises à jour peuvent inclure : titre, description, catégorie, etc.
3. Les questions associées ne sont pas modifiées automatiquement

## Comment créer un nouveau quiz
1. Vérifier les permissions (utilisateur authentifié)
2. Envoyer les données via POST /api/quizzes
3. Les questions sont ajoutées séparément via les routes questions
4. Le quiz est créé avec les relations vers les questions et l'auteur

## Contraintes de sécurité
- Toutes les routes protégées nécessitent un token JWT valide
- Les opérations de modification nécessitent une authentification
- Les utilisateurs ne peuvent modifier que leurs propres données