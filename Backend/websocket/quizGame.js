const quizService = require('../src/services/quiz.service');
const { broadcast, getRoomMembers } = require('./rooms');
const games = {};

async function startGame(roomId, quizId) {
    const members = getRoomMembers(roomId);
    const scores = {};
    members.forEach(member => {
        scores[member.userId] = 0;
    });
    try {
        const quiz = await quizService.getQuizById(quizId);

        games[roomId] = {
            questions: quiz.questions,
            currentQuestionIndex: 0,
            scores: scores,
            answered: new Map(),
            phase: 'playing',
            timer: null,
        };
        sendQuestion(roomId);
    }
    catch (error) {
        return;
    }
}

function sendQuestion(roomId) {
    const game = games[roomId];
    const question = game.questions[game.currentQuestionIndex];
    const payload = {
        type: 'question',
        question: {
            id: question.id,
            text: question.text,
            options: question.answers.map(option => ({ id: option.id, text: option.text })),
        },  
        timeLeft: 15,
    };
    broadcast(roomId, payload);
    game.timer = setTimeout(() => {
        revealAnswer(roomId);
    }, 15000);
    game.answered = new Map();

    return;
}