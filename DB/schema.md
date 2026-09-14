# Schéma DB

**Choix** : SQL (PostgreSQL ou MariaDB) + ORM (Prisma)

## Tables

### User

#### User

| Champ         | Type / FK     | Notes       |
|---------------|---------------|-------------|
| id            |               | PK          |
| nom           |               |             |
| niveau        |               |             |
| email         |               |             |
| password_hash |               |             |
| is_online     |               |             |
| last_seen_at  |               |             |
| display_name  |               |             |
| avatar_url    |               |             |
| created_at    |               |             |

#### User_stats

| Champ         | Type / FK     | Notes       |
|---------------|---------------|-------------|
| user_id       | FK            |             |
| total_games   |               |             |
| wins          |               |             |
| losses        |               |             |
| total_points  |               |             |
| best_streak   |               |             |
| updated_at    |               |             |


#### OAuth accounts

| Champ         | Type / FK     | Notes       |
|---------------|---------------|-------------|
| id            |               | PK          |
| user_id       |               |             |
| provider      |               |             |
| provider_user_id |               |             |
| created_at    |               |             |

#### Amitie *(table de jonction, relation plusieurs-à-plusieurs)*

| Champ     | Type / FK    | Notes |
|-----------|--------------|-------|
| id        |              |       |
| user_id_1 | FK → User.id |       |
| user_id_2 | FK → User.id |       |
| created_at|              |       |

#### blocked_users

| Champ         | Type / FK     | Notes       |
|---------------|---------------|-------------|
| blocker_id    |  FK           |             |
| blocked_id    |  FK           |             |
| created_at    |               |             |


#### Notifications

| Champ         | Type / FK     | Notes       |
|---------------|---------------|-------------|
| id            |               | PK          |
| user_id       |               | Destinataire|
| type          |               |             |
| message       |               |             |
| is_read       |               |             |
| created_at    |               |             |




### Quizzes

#### Theme

| Champ       | Type / FK    | Notes                            |
|-------------|--------------|----------------------------------|
| id          |              | PK                               |
| nom         |              |                                  |
| description |              |                                  |
| creator_id  | FK → User.id | NULL si thème par défaut du jeu  |
| created_at  |              |                                  |


#### Question

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


### Achievements

#### Achievements

| Champ         | Type / FK     | Notes       |
|---------------|---------------|-------------|
| id            |               | PK          |
| code          |               |             |
| name          |               |             |
| description   |               |             |
| icon          |               |             |

#### user_achievements

| Champ         | Type / FK     | Notes       |
|---------------|---------------|-------------|
| user_ id      |               |           |
| achievement_id|               |             |
| unlocked_at   |               |             |


## À faire

- [ ] Table **Partie** (multijoueur : relie plusieurs Users à une partie + un Theme)
- [ ] Table **Chat** (messages liés à un User, et probablement une Partie)
- [ ] Choisir PostgreSQL vs MariaDB 
- [ ] schema.prisma
- [ ] Table Notifications
- [ ] Table Achievement
- [ ] Table Tournois
- [ ] Table utilisateurs bloques ? Dans amitie

