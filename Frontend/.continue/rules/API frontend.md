---
name: API frontend
description: Liste des fonctions de l'API (apiFetch, hooks useAuth, etc.) et comment les utiliser. À consulter avant d'écrire du code qui appelle le backend.
alwaysApply: false
---
Résumé des routes exposées par le backend
URL / Méthode	Description	Ce que la front‑end peut demander / afficher
/api/auth/register POST	Créer un compte utilisateur	Formulaire d’inscription
/api/auth/login POST	Authentifier un utilisateur	Formulaire de login
/api/auth/me GET	Récupérer les infos du compte connecté	Profil utilisateur
/api/auth/logout POST	Se déconnecter	Déconnexion, mise à jour UI
/api/auth/oauth/42 GET	Rediriger vers OAuth 42	Lien d’authentification externe
/api/auth/oauth/42/callback GET	Gérer callback OAuth	Connexion par 42
/api/users GET	Liste des utilisateurs (authentifié)	Afficher les contacts, profil
/api/users/:id GET	Détails d’un utilisateur	Afficher profil d’un autre
/api/friends GET	Liste des amis	Tableau d’amis
/api/friends POST	Envoyer une demande d’amitié	Ajouter un ami
/api/friends/:id/accept POST	Accepter une demande	Confirmer un ami
/api/friends/:id/reject POST	Rejeter une demande	Refuser un ami
/api/blocks GET	Liste des utilisateurs bloqués	Gérer blocages
/api/blocks POST	Bloquer un utilisateur	Bloquer quelqu’un
/api/blocks/:id DELETE	Débloquer	Débloquer
/api/quizzes GET	Tous les quiz	Afficher les quiz disponibles
/api/quizzes/:id GET	Détails d’un quiz	Afficher un quiz spécifique
/api/quizzes POST	Créer un nouveau quiz	Formulaire création quiz
/api/quizzes/:id PUT	Mettre à jour un quiz	Modifier un quiz
/api/quizzes/:id DELETE	Supprimer un quiz	Supprimer un quiz
/api/questions GET	Toutes les questions	Récupérer toutes les questions
/api/questions/:id GET	Détails d’une question	Afficher une question
/api/questions POST	Ajouter une question	Formulaire création question
/api/categories GET	Toutes les catégories	Filtrer quiz par catégorie
/api/categories/:id GET	Détails d’une catégorie	Afficher catégorie
/api/attempts POST	Enregistrer une tentative de quiz	Sauvegarder résultat
/api/attempts/:id GET	Récupérer une tentative	Historique de scores
/api/statistics GET	Statistiques générales	Tableau de bord, performance
/api/achievements GET	Toutes les récompenses	Afficher badges
/api/achievements/:id GET	Détails d’une récompense	Détails badge
/api/achievements POST	Gérer récompenses (admin)	Créer un badge
/uploads	Statique	Accéder aux fichiers uploadés
/quiz-images	Statique	Accéder aux images des quiz
/ws (WebSocket)	Connexion temps réel	Notifications, scores live
Points clés pour la front‑end
Gestion des utilisateurs : login, inscription, profil, liste d’amis, blocage.
Gestion des quiz : récupérer la liste, afficher un quiz, créer/modifier/supprimer un quiz.
Gestion des questions : obtenir les questions pour un quiz, ajouter/mettre à jour.
Statistiques et récompenses : afficher les badges, les scores, les statistiques de jeu.
WebSocket : recevoir des notifications en temps réel (nouveaux quiz, nouveaux amis, score instantané).
Cela donne une vue complète des points d’entrée que la front‑end peut appeler pour construire l’interface utilisateur.