9/22&23:

# AUTH

- register
    Limits : 
        email = string + @ + string + . + string
        password = upper + lower + number + special car (! @ # $ % ^ & * ( ) _ + - = [ ] { } ; ' : " \ | , . < > / ?)
- login via email or oauth (need to set link with 42)
- logout


# USER

- display own profile (with email) or other profile via /:id (id, username, display_name, avatar_url - without email)
- upload avatar
    Limits : type jpg or png, 2Mo max 
- update 
    * profile (display_name)
    * password (checks if old password is correct then changes with new if regex ok)
    * email
    * avatar


9/24
# FRIENDS

- friend request
    * send
    * accept
    * decline --> if declined, can never be friends again (to keep?)

- delete friend 
- user's friends list
- user's pending requests (recieved and sent)
- block user

# QUIZ

- voir les quiz
- voir un quiz avec son id
- creer un quiz
- modifier un quiz
- supprimer un quiz avec son id


# QUIZZES
-Pour les quiz, GET /api/quizzes donne la liste (avec le nombre de questions), GET /api/quizzes/:id donne un quiz complet avec ses questions et leurs propositions, et POST, PUT et DELETE sur /api/quizzes servent à créer, modifier et supprimer un quiz (le titre est obligatoire, la description est optionnelle).
-Pour les questions, GET /api/questions donne toutes les questions, et on peut filtrer avec ?quizId=1 pour celles d'un quiz précis. GET /api/questions/:id donne une question, et POST, PUT et DELETE servent à la créer, la modifier et la supprimer.
-Il me reste à tester toutes les routes, faire les routes Category, masquer isCorrect côté front avec une vérification des réponses côté serveur, puis les routes User et l'authentification, et enfin celles pour enregistrer les parties et les scores.

# Front 

## a prevoir suite a l'auth + OAuth backend

    -formulaires register/login (email, password, username, display_name optionnel)
    -ne pas stocker de token en localStorage : le cookie httpOnly est automatique, aucune gestion manuelle du token cote front necessaire
    -bouton logout : POST /api/auth/logout (avec credentials: include), puis nettoyer l'etat front et rediriger
    -variable d'env front (ex: VITE_API_URL) pour l'URL du backend, a ne jamais coder en dur

