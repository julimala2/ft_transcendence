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


# Routes
## Catégories : /api/categories
    - GET /api/categories (public) : liste triée par nom, avec le nombre de questions de chacune.
    - GET /api/categories/:id (public) : une catégorie.
    POST /api/categories (connecté) avec { "name": "Géographie" } : création. Le slug est généré automatiquement (geographie). Refuse un nom vide ou déjà pris (409).
    - PUT /api/categories/:id (connecté) avec { "name": "Géo" } : renomme (le slug ne change pas).
    - DELETE /api/categories/:id (connecté) : supprime, mais refusé (409) s’il reste des questions dans la catégorie.
## Questions : /api/questions
    - GET /api/questions (public) : liste des questions actives. Filtres possibles dans l’URL : ?categoryId=1, ?tag=capitales, ?difficulty=1 (1 à 3), ?limit=50 (max 100), ?offset=0. Les propositions contiennent seulement id, text et image.
    - GET /api/questions/:id (public) : une question, même format.
    - POST /api/questions (connecté) : crée une question dont tu deviens l’auteur.
## Quiz : /api/quizzes (tout exige d’être connecté)
    - GET /api/quizzes : les quiz que tu as le droit de voir (publics, les tiens, et ceux en friends de tes amis acceptés). Avec ?mine=true, seulement les tiens.
    - GET /api/quizzes/:id : un quiz avec ses questions triées par position (sans isCorrect). Un quiz que tu n’as pas le droit de voir renvoie 404, pas 403.
    - POST /api/quizzes avec { "title": "Mon quiz", "description": "...", "visibility": "friends" } : crée un quiz. Seul title est obligatoire, et la visibilité par défaut est private.
    - PATCH /api/quizzes/:id (propriétaire) : modifie title, description ou visibility.
    - DELETE /api/quizzes/:id (propriétaire) : supprime le quiz. Les parties déjà jouées sont conservées.
    - POST /api/quizzes/:id/questions (propriétaire) avec { "questionId": 12 } : ajoute une question à la fin du quiz et renvoie le quiz complet. 409 si elle y est déjà.
    - DELETE /api/quizzes/:id/questions/:questionId (propriétaire) : retire une question du quiz.
## Routes des parties : /api/attempts

- Toutes exigent d’être connecté (cookie token, donc credentials: 'include' dans les fetch). Une partie n’est visible et jouable que par son propriétaire (404 sinon).

### 1. Démarrer : POST /api/attempts

- Partie générée par thème (la catégorie est obligatoire, le reste optionnel) :

json
{ "categoryId": 1, "tag": "capitales", "difficulty": 1, "count": 20 }

count vaut 20 par défaut (de 1 à 50). Le serveur tire les questions au hasard. S’il n’y en a pas assez, il répond 400 avec le nombre disponible.

Partie sur un quiz existant : { "quizId": 3 } (on ne peut pas mélanger les deux modes).

Réponse 201 : { id, total, answered, score, finished, question }, où question est la première question.

### 2. Répondre : POST /api/attempts/:id/answers

json
{ "answerId": 45 }

Pas de questionId : le serveur sait quelle question est en cours. Réponse :

json
{
  "isCorrect": true, "correctAnswerId": 45, "explanation": "...",
  "answered": 1, "score": 1, "total": 20,
  "finished": false, "next": { ... }
}

À la dernière réponse, finished vaut true et next vaut null : la partie se clôture toute seule.

### 3. Reprendre : GET /api/attempts/:id

- Pour un rechargement de page : renvoie la progression et la question en cours (question: null si la partie est terminée).

## Statistiques : /api/statistics

- Exige d’être connecté (cookie token, credentials: 'include'). Renvoie les stats de l’utilisateur connecté.

### Deux modes de jeu, deux façons de compter

| | Rush | Custom |
|---|---|---|
| Mesure | nombre de bonnes réponses (score) | score / totalQuestions en % |
| Stat affichée | record (meilleur score) | moyenne des % |
| Regroupement | catégorie + niveau | catégorie + niveau |
| Abandon | score obtenu jusqu’à l’arrêt | les questions restantes comptent comme fausses |

Seules les parties terminées (ou abandonnées) comptent, celles en cours sont ignorées. Les parties sur un quiz existant (quizId, sans catégorie) ne comptent pas.

### GET /api/statistics [x]

- Toutes catégories : GET /api/statistics
- Une seule catégorie : GET /api/statistics?categoryId=1 (entier positif, sinon 400)

Réponse 200 :

json
{
  "categoryId": 1,
  "rush": [
    { "categoryId": 1, "category": "Géographie", "difficulty": 2, "record": 17, "played": 4 }
  ],
  "custom": [
    { "categoryId": 1, "category": "Géographie", "difficulty": 1, "averagePercent": 72, "played": 6 }
  ]
}

- categoryId vaut null sans filtre.
- Une ligne par couple catégorie + niveau. difficulty peut être null si la partie a été lancée sans niveau.
- played = nombre de parties comptées pour cette ligne.
- Tableaux vides = aucune partie terminée : prévoir un état vide côté front.

### GET /api/statistics/global [x]

Pour comparer le joueur aux autres, par catégorie + niveau. Accepte aussi ?categoryId=1.

- rush : moyenne des records des autres joueurs (le joueur connecté n’est pas compté).
- custom : moyenne des % de toutes les parties de tous les joueurs (joueur connecté compris).

Réponse 200 :

json
{
  "categoryId": null,
  "rush": [
    { "categoryId": 1, "category": "Géographie", "difficulty": 2, "averageRecord": 14.5, "players": 8 }
  ],
  "custom": [
    { "categoryId": 1, "category": "Géographie", "difficulty": 1, "averagePercent": 65, "played": 42 }
  ]
}

- averageRecord est arrondi à 0,1 près, players = nombre de joueurs pris en compte.
- Pour afficher la comparaison, associer chaque ligne de GET /api/statistics à la ligne de /global qui a le même categoryId + difficulty. S’il n’y en a pas, aucun autre joueur n’a encore joué ce couple.

### GET /api/statistics/users/:id [x]

Stats d’un autre joueur (profil, ami...). Même format que GET /api/statistics, accepte aussi ?categoryId=1.

- 400 si l’id n’est pas un entier positif, 404 si l’utilisateur n’existe pas.

### Prévu, pas encore disponible

- Mode rush : POST /api/attempts ne permet pas encore de choisir le mode, toutes les parties sont en custom. Le tableau rush restera vide en attendant.
- Abandon : pas encore de route pour abandonner une partie, donc aucune partie n’est comptée comme abandonnée.

# Front 

## a prevoir suite a l'auth + OAuth backend
    -ne pas stocker de token en localStorage : le cookie httpOnly est automatique, aucune gestion manuelle du token cote front necessaire

