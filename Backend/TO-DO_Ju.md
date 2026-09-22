Authentification avec OAuth


auth OAuth
    -creer l'app sur l'intra avec un nom pour remplir l'env 
    -proteger avec un parametre "state" --> cookie parser a ajouter






Front - a prevoir suite a l'auth + OAuth backend

    -formulaires register/login (email, password, username, display_name optionnel)
    -validation du mot de passe (8 car min, 1 maj, 1 min, 1 chiffre, 1 caractere special)
    -toutes les requetes vers l'API auth doivent etre faites avec credentials: 'include' (fetch) sinon le cookie httpOnly n'est jamais envoye/recu - sans ca rien ne fonctionnera
    -ne pas stocker de token en localStorage : le cookie httpOnly est automatique, aucune gestion manuelle du token cote front necessaire
    -au chargement de l'app (et sur les routes protegees) : appeler GET /api/auth/me (avec credentials: include) pour savoir si l'utilisateur est deja connecte ; si 401, rediriger vers /login
    -bouton logout : POST /api/auth/logout (avec credentials: include), puis nettoyer l'etat front et rediriger
    -afficher les erreurs renvoyees par le back : 400 (champ invalide/manquant), 409 (email/username deja pris), 401 (identifiants invalides)
    -bouton "Se connecter avec 42" : simple navigation navigateur vers GET /api/auth/oauth/42 (window.location.href, PAS un fetch/AJAX)
    -page de retour OAuth (URL de FRONTEND_URL) : pas de token a recuperer dans l'URL, juste appeler GET /api/auth/me comme pour une connexion classique ; gerer le param ?error=oauth pour afficher un message d'erreur
    -variable d'env front (ex: VITE_API_URL) pour l'URL du backend, a ne jamais coder en dur
    -certificat auto-signe : en dev, il faut ouvrir manuellement https://localhost:3000 dans le navigateur et accepter l'avertissement une premiere fois, sinon les fetch vers le back echouent silencieusement (cert non reconnu)

