Authentification avec OAuth
    -creer l'app sur l'intra avec un nom pour remplir l'env 
    -proteger avec un parametre "state"

Routes 

user 
    - a terme :
        - voir is_online quand websockets

quiz
refaire le seed pour etre compatible avec nouveau quiz


J'ai relu les commits de Joris (d86e403, routes category) et le vôtre (64df570). Le découpage routes → middleware → controller → service → model est cohérent avec le reste. Le refus de supprimer une catégorie qui contient encore des questions (409) est une bonne idée, et le onDelete: Restrict du schéma protège la même chose côté base.

En revanche, ces routes ne peuvent pas fonctionner en l'état. Voici ce que j'ai trouvé, du plus bloquant au moins urgent.

🔴 Bloquant

2. Les routes ne sont pas branchées. server.js ne contient ni require('./src/routes/category.routes') ni app.use('/api/categories', …). Les routes sont donc injoignables, et c'est d'ailleurs pour ça que l'erreur n°1 ne s'est pas encore vue.

3. Le slug n'est pas géré. Depuis le nouveau schéma, slug est obligatoire et unique. Or createCategory ne transmet que { name }, donc POST /api/categories échouera en erreur 500. Deux options :

générer le slug à partir du nom à la création (« Histoire de France » donne histoire-de-france) ;
ou l'exiger dans le body, et le valider dans le middleware (minuscules, sans accent ni espace).
Dans les deux cas, updateCategory ne doit pas modifier le slug : c'est tout l'intérêt d'avoir une référence stable quand le nom change.

🟠 À discuter avec Joris
4. Les routes d'écriture n'ont pas de protection. POST, PUT et DELETE sont ouverts à n'importe qui, sans verifyToken, et il n'existe pas de rôle admin dans User.

5. La source de vérité, ce sont vos fichiers JSON. Les catégories viennent de prisma/data/<slug>.json, importés par le seed. Une catégorie créée par l'API n'aurait pas de fichier, et une catégorie renommée par l'API retrouverait son ancien nom au prochain seed (le seed met à jour name à partir du fichier). Pour la banque officielle, je ne garderais que les routes GET, et je ferais passer les modifications par les fichiers JSON.

6. Ce dont le front aura besoin.

GET /api/categories/:slug en plus, ou à la place, de /:id : le front manipulera plutôt geographie que 3.
Le _count actuel compte toutes les questions, y compris les questions perso et les questions désactivées. Pour l'écran « choisis un thème », il faudrait compter seulement authorId: null, isActive: true, et idéalement par difficulté. Ça sert à griser une combinaison qui n'a pas assez de questions.
🟡 Dans votre commit 64df570
7. prisma/dev.db-journal a été commité. C'est un fichier temporaire de SQLite. .gitignore ignore dev.db, mais pas son journal. Il faut ajouter *.db-journal et faire git rm --cached prisma/dev.db-journal.

8. Deux images sont lourdes : machu-picchu.webp fait 2,6 Mo et angkor-wat.webp 1,3 Mo, alors que les drapeaux font 10 à 60 Ko. En les redimensionnant à environ 800 px de large, elles descendraient autour de 100 à 200 Ko : c'est plus rapide à charger, et le dépôt grossit moins.

