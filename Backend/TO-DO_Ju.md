Authentification avec OAuth


auth OAuth
    -creer l'app sur l'intra avec un nom pour remplir l'env 
    -proteger avec un parametre "state"

Routes user 
    -supprimer compte (a finir avec le schema prisma ci-dessous)
    -changer username/email (username ? generalement unique)

Schema prisma (attendre que Joris ait fini dessus)
    -onDelete: Cascade sur OAuthAccount -> User (pour que la suppression de compte marche direct en DB sans suppression manuelle des OAuthAccount avant) => dans user.services aussi la ligne d'attente


