const onlineModel = require('../models/onlineGame.model');

const { PLAYER_STATUS, MODE } = onlineModel;


function buildPlayers(players) {
    const finishers = [];
    const quitters = [];

    for (let i = 0; i < players.length; i++) {
        if (players[i].abandoned === true) {
            quitters.push(players[i]);
        }
        else {
            finishers.push(players[i]);
        }
    }

    finishers.sort(function (a, b) {
        return b.score - a.score;
    });

    const result = [];
    let rank = 0;

    for (let i = 0; i < finishers.length; i++) {
        const player = finishers[i];
        if (i === 0 || player.score !== finishers[i - 1].score) {
            rank = i + 1;
        }
        result.push({
            userId: player.userId,
            score: player.score,
            rank: rank,
            isWinner: rank === 1,
            status: PLAYER_STATUS.FINISHED,
        });
    }

    for (let i = 0; i < quitters.length; i++) {
        result.push({
            userId: quitters[i].userId,
            score: quitters[i].score,
            rank: null,
            isWinner: false,
            status: PLAYER_STATUS.ABANDONED,
        });
    }

    return result;
}

function checkGame(game) {
    if (game.mode !== MODE.ROOM && game.mode !== MODE.RANKED) {
        throw new Error('saveOnlineGame : mode invalide (' + game.mode + ')');
    }

    const hasQuiz = Number.isInteger(game.quizId);
    const hasCategory = Number.isInteger(game.categoryId);
    if (hasQuiz === hasCategory) {
        throw new Error('saveOnlineGame : il faut soit un quizId, soit un categoryId');
    }

    if (!Array.isArray(game.players) || game.players.length === 0) {
        throw new Error('saveOnlineGame : aucun joueur');
    }

    for (let i = 0; i < game.players.length; i++) {
        const player = game.players[i];
        if (typeof player.abandoned !== 'boolean') {
            throw new Error('saveOnlineGame : abandoned manquant pour le joueur ' + player.userId);
        } // a garder ?? Verifier les abandons avec JF
        if (player.score < 0) {
            throw new Error('saveOnlineGame : score négatif pour le joueur ' + player.userId);
        }
    }
}

async function saveOnlineGame(game) {
    checkGame(game);

    return onlineModel.createOnlineGame({
        mode: game.mode,
        quizId: game.quizId,
        categoryId: game.categoryId,
        totalQuestions: game.totalQuestions,
        startedAt: game.startedAt,
        players: buildPlayers(game.players),
    });
}

module.exports = {
    saveOnlineGame,
};
