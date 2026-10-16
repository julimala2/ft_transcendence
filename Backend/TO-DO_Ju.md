Authentification avec OAuth
    -creer l'app sur l'intra avec un nom pour remplir l'env 
    -proteger avec un parametre "state"

Routes 
- Achievements

user 
    - a terme :
        - voir is_online quand websockets

quiz
refaire le seed pour etre compatible avec nouveau quiz
Ajouter les images dans les nouvelles questions geo


🟠 À discuter avec Joris

5. La source de vérité, ce sont vos fichiers JSON. Les catégories viennent de prisma/data/<slug>.json, importés par le seed. Une catégorie créée par l'API n'aurait pas de fichier, et une catégorie renommée par l'API retrouverait son ancien nom au prochain seed (le seed met à jour name à partir du fichier). Pour la banque officielle, je ne garderais que les routes GET, et je ferais passer les modifications par les fichiers JSON.

6. Ce dont le front aura besoin.

GET /api/categories/:slug en plus, ou à la place, de /:id : le front manipulera plutôt geographie que 3.
Le _count actuel compte toutes les questions, y compris les questions perso et les questions désactivées. Pour l'écran « choisis un thème », il faudrait compter seulement authorId: null, isActive: true, et idéalement par difficulté. Ça sert à griser une combinaison qui n'a pas assez de questions.




Pourquoi mettre le timer dans le back : 

Le principe : un horodatage, pas un minuteur
En HTTP, le serveur ne parle que quand le client lui envoie une requête. Il ne peut pas, comme en WebSocket, prendre la parole tout seul à t = 15 s pour dire « temps écoulé ». Un setTimeout côté serveur ne servirait donc à rien : quand il se déclencherait, il n'aurait personne à qui répondre.

À la place, le serveur note l'heure à laquelle il envoie une question. Quand la réponse arrive, il fait la soustraction. Rien ne tourne entre les deux.

Déroulé concret

10:00:00   POST /api/attempts (démarrer la partie)
           → le serveur crée la partie et enregistre questionSentAt = 10:00:00
           → il renvoie la question 1
           → le front lance son affichage 15, 14, 13… (purement visuel)

10:00:06   POST /api/attempts/42/answers  { answerId: 7 }
           → serveur : maintenant - questionSentAt = 6 s  → ≤ 15 s, réponse acceptée
           → il corrige, enregistre, et note questionSentAt = 10:00:06 pour la question 2
           → il renvoie la question 2

10:00:30   POST /api/attempts/42/answers  { answerId: 12 }
           → serveur : 10:00:30 - 10:00:06 = 24 s  → > 15 s
           → la réponse est ignorée et comptée fausse (timeout), même si c'était la bonne
Les cas à gérer
Le timer arrive à 0 dans le navigateur. Le front envoie une requête « pas de réponse » (par exemple answerId: null). Le serveur l'enregistre comme fausse et passe à la question suivante.

Le joueur triche (il bloque le timer du front via la console, ou cherche la réponse sur Google pendant 40 s). Pas grave : le serveur fait sa propre soustraction et refuse la réponse. C'est tout l'intérêt de le faire en back.

La latence réseau. La requête met un peu de temps à arriver. Une réponse cliquée à 14,9 s peut arriver à 15,3 s. On ajoute donc une marge de tolérance (1 à 2 s).

Le joueur recharge la page. Comme l'heure est stockée en base (et non dans une variable en mémoire), rien n'est perdu. Sur GET /api/attempts/42, le serveur peut même renvoyer timeLeft = 15 - (maintenant - questionSentAt), pour que le front reprenne le décompte au bon endroit au lieu de repartir à 15.

Le joueur ferme l'onglet et ne revient jamais. Il ne se passe rien, puisqu'aucune requête n'arrive. La partie reste in_progress indéfiniment. C'est pour ça que tes stats ne doivent compter que les parties finished et abandoned.

Ce que ça demande concrètement
un champ en base : questionSentAt DateTime? sur QuizAttempt ;
de le remettre à l'heure actuelle à chaque nouvelle question envoyée ;
une comparaison Date.now() - questionSentAt dans la fonction qui traite la réponse ;
accepter une réponse « vide » pour le timeout.


Tout le code du front (React, le timer, les boutons) est téléchargé et exécuté dans le navigateur du joueur. Le joueur a donc la main sur tout : il peut le lire, le mettre en pause, le modifier, ou l'ignorer complètement. Les outils de développement (F12), présents dans tous les navigateurs, sont faits exactement pour ça.

Méthode 1 : ignorer complètement l'interface
C'est la plus simple. Le joueur ouvre l'onglet Réseau (Network) de F12 et regarde quelles requêtes le front envoie quand il clique sur une réponse. Il voit par exemple :


POST /api/attempts/42/answers
{ "answerId": 7 }
Il peut ensuite envoyer la même requête lui-même depuis l'onglet Console, quand il le veut :


fetch('/api/attempts/42/answers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ answerId: 7 }),
})
Le timer du front n'intervient jamais : il n'est même pas exécuté. Le joueur peut afficher la question, chercher la réponse sur Google pendant 2 minutes, puis taper cette ligne. Si le serveur ne mesure pas le temps lui-même, la réponse est acceptée.

Méthode 2 : mettre le timer en pause
Dans l'onglet Sources, un bouton « pause » arrête toute l'exécution JavaScript de la page. Le setInterval qui fait 15, 14, 13… est figé. Le joueur réfléchit autant qu'il veut, puis relance.

Méthode 3 : modifier la valeur du timer
Avec l'extension React DevTools, on peut voir et modifier directement le state des composants. Le joueur change timeLeft de 3 à 999.

Pourquoi le serveur règle les trois d'un coup
Les trois méthodes trafiquent ce qui se passe dans le navigateur. L'horloge du serveur et la valeur questionSentAt en base, le joueur ne peut pas y toucher. Quelle que soit la méthode, le serveur calcule « question envoyée à 10:00:06, réponse reçue à 10:02:10 → 124 s » et refuse la réponse.

C'est une règle générale en web : le front sert à l'affichage et au confort, le back décide. Toute vérification qui compte (timer, score, droits d'accès) doit être faite côté serveur. Le front peut la dupliquer pour l'ergonomie, mais jamais à sa place.