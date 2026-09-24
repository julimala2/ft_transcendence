Authentification avec OAuth
    -creer l'app sur l'intra avec un nom pour remplir l'env 
    -proteger avec un parametre "state"

Routes user 
    -changer username ? generalement unique
    - a terme :: 
        - rechercher/lister des utilisateurs (ex quand demande ami)
        - voir is_online quand websockets


Routes friends
    - creer la table friends
    - request, :id/accept, :id/decline, GET /friends, DELETE /friends, GET /friend/requests