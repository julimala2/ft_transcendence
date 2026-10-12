9/22&23:

# AUTH

- register [x]
    Limits : 
        email = string + @ + string + . + string
        password = upper + lower + number + special car (! @ # $ % ^ & * ( ) _ + - = [ ] { } ; ' : " \ | , . < > / ?)
- login via email or oauth (need to set link with 42) [x]
- logout [x]


# USER

- display own profile (with email) or other profile via /:id (id, username, display_name, avatar_url - without email) [x]
- upload avatar
    Limits : type jpg or png, 2Mo max 
- update 
    * profile (display_name) [x]
    * password (checks if old password is correct then changes with new if regex ok) [x]
    * email [x]
    * avatar


9/24
# FRIENDS

- friend request [x]
    * send [x]
    * accept [x]
    * decline --> if declined, can never be friends again (to keep?) [x]

- delete friend [x]
- user's friends list [x]
- user's pending requests (sent?)
- block user [x]

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
    -ne pas stocker de token en localStorage : le cookie httpOnly est automatique, aucune gestion manuelle du token cote front necessaire

