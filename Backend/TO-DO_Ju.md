Authentification avec OAuth
    -creer l'app sur l'intra avec un nom pour remplir l'env 
    -proteger avec un parametre "state"

Routes 

user 
    - a terme :
        - voir is_online quand websockets

quiz
refaire le seed pour etre compatible avec nouveau quiz



🟠 À discuter avec Joris

5. La source de vérité, ce sont vos fichiers JSON. Les catégories viennent de prisma/data/<slug>.json, importés par le seed. Une catégorie créée par l'API n'aurait pas de fichier, et une catégorie renommée par l'API retrouverait son ancien nom au prochain seed (le seed met à jour name à partir du fichier). Pour la banque officielle, je ne garderais que les routes GET, et je ferais passer les modifications par les fichiers JSON.

6. Ce dont le front aura besoin.

GET /api/categories/:slug en plus, ou à la place, de /:id : le front manipulera plutôt geographie que 3.
Le _count actuel compte toutes les questions, y compris les questions perso et les questions désactivées. Pour l'écran « choisis un thème », il faudrait compter seulement authorId: null, isActive: true, et idéalement par difficulté. Ça sert à griser une combinaison qui n'a pas assez de questions.


