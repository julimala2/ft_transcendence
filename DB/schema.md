# Schéma DB

**Choix** : SQL (PostgreSQL ou MariaDB) + ORM (Prisma)

## Tables

### User

| Champ         | Type / FK     | Notes       |
|---------------|---------------|-------------|
| id            |               | PK          |
| nom           |               |             |
| niveau        |               |             |
| email         |               |             |
| password_hash |               |             |

### Theme

| Champ       | Type / FK    | Notes                            |
|-------------|--------------|----------------------------------|
| id          |              | PK                               |
| nom         |              |                                  |
| description |              |                                  |
| creator_id  | FK → User.id | NULL si thème par défaut du jeu  |

### Question

| Champ         | Type / FK     | Notes                                     |
|---------------|---------------|-------------------------------------------|
| id            |               | PK                                        |
| theme_id      | FK → Theme.id | une question appartient à UN SEUL thème   |
| question      |               | l'énoncé de la question                   |
| reponse_1     |               |                                           |
| reponse_2     |               |                                           |
| reponse_3     |               |                                           |
| reponse_4     |               |                                           |
| bonne_reponse |               | num    de la bonne réponse                |

### Amitie *(table de jonction, relation plusieurs-à-plusieurs)*

| Champ     | Type / FK    | Notes |
|-----------|--------------|-------|
| id        |              |       |
| user_id_1 | FK → User.id |       |
| user_id_2 | FK → User.id |       |

## À faire

- [ ] Table **Partie** (multijoueur : relie plusieurs Users à une partie + un Theme)
- [ ] Table **Chat** (messages liés à un User, et probablement une Partie)
- [ ] Choisir PostgreSQL vs MariaDB 
- [ ] schema.prisma
