# Schéma DB

**Choix** : SQL (PostgreSQL ou MariaDB) + ORM (Prisma)

## Tables

### User

#### User

| Champ         | Type / FK        | Notes                            |
|---------------|------------------|-----------------------------------|
| id            | Int              | PK, autoincrement                |
| username      | String, unique   | identifiant technique (login)    |
| email         | String, unique   |                                   |
| password_hash | String, nullable | null si compte 100% OAuth        |
| display_name  | String           | pseudo public affiché en jeu     |
| avatar_url    | String, nullable |                                   |
| is_online     | Boolean          | default false                    |
| last_seen_at  | DateTime, nullable |                                 |
| created_at    | DateTime         | default now()                    |
| updated_at    | DateTime         | mis à jour automatiquement       |

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
| user_ id      |               |             |
| achievement_id|               |             |
| unlocked_at   |               |             |


## À faire

- [ ] Table **Partie** (multijoueur : relie plusieurs Users à une partie + un Theme)
- [ ] Table **Chat** (messages liés à un User, et probablement une Partie)
- [ ] Choisir PostgreSQL vs MariaDB 
- [ ] schema.prisma
- [x] Table Notifications
- [x] Table Achievement
- [ ] Table Tournois
- [x] Table utilisateurs bloques ? Dans amitie

