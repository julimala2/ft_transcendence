const prisma = require('../../lib/prisma');

const PLAYER_STATUS = {
  PLAYING: 'playing',
  FINISHED: 'finished',
  ABANDONED: 'abandoned',
};

const MODE = {
  ROOM: 'room',
  RANKED: 'ranked',
};


// model OnlineGame {
//   id             Int       @id @default(autoincrement())
//   startedAt      DateTime  @default(now())
//   finishedAt     DateTime?
//   status         String    @default("in_progress") // "in_progress" | "finished" | "abandoned"
//   totalQuestions Int       @default(0)

//   quizId     Int?
//   quiz       Quiz?     @relation(fields: [quizId], references: [id], onDelete: SetNull)
//   categoryId Int?
//   category   Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)

//   players OnlineGamePlayer[]

//   @@index([categoryId])
// }

// model OnlineGamePlayer {
//   gameId Int
//   game   OnlineGame @relation(fields: [gameId], references: [id], onDelete: Cascade)
//   userId Int
//   user   User       @relation(fields: [userId], references: [id], onDelete: Cascade)

//   score    Int     @default(0)
//   rank     Int? // 1 = premier, égalité possible ; null si abandon
//   isWinner Boolean @default(false)
//   status   String  @default("playing") // "playing" | "finished" | "abandoned"

//   @@id([gameId, userId])
//   @@index([userId])
// }

//qu'est ce que JF renvoie ? 
async function createOnlineGame(game) {
    return prisma.onlineGame.create({
        data: {
            startedAt: game.startedAt,
            finishedAt: new Date(),
            mode: game.mode,
            quizId: game.quizId,
            categoryId: game.categoryId,
            totalQuestions: game.totalQuestions,
            status: 'finished',
            players: {
                create: game.players,
            },
        },
        include: { players: true },
    });
}

module.exports = {
    PLAYER_STATUS,
    MODE,
    createOnlineGame,
};

