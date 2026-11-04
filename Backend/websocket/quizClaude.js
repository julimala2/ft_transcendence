const quizService = require('../src/services/quiz.service');
const questionService = require('../src/services/question.service');
const categoryModel = require('../src/models/category.model');
const attemptModel = require('../src/models/attempt.model');
const { broadcast, getRoomMembers } = require('./rooms');

const VOTE_DURATION_MS = 60000;
const QUESTION_DURATION_MS = 15000;
const REVEAL_DELAY_MS = 3000;

const games = {}; // games[roomId] = { questions, currentQuestionIndex, scores, answered, phase, timer }
const votes = {}; // votes[roomId] = { quizList, voters, endsAt, interval }

function sendError(ws, message) {
  ws.send(JSON.stringify({ type: 'ERROR', message }));
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function loadCategoryQuestions(categoryId, count) {
  const category = await categoryModel.findById(Number(categoryId));
  if (!category) return null;

  const available = await attemptModel.findActiveQuestionIds({
    categoryId: category.id,
  });
  const questionIds = shuffle(available).slice(0, count ?? available.length);

  return Promise.all(
    questionIds.map(id => questionService.getCompleteQuestionById(id))
  );
}

// ---------- VOTE ----------
// proposition de quiz
// / timer 1min pour voter ou proposer un autre quiz
// / liste des quiz + nombre de votes
// / fin du timer ou tout le monde a voté : lancement du quiz n.1

function hasEveryoneVoted(roomId, vote) {
  return getRoomMembers(roomId).every(member => vote.voters.has(member.userId));
}

// Handler du message proposeQuiz : data : {type: proposeQuiz, categoryId, count}
// Proposer un quiz déjà dans la liste revient à voter pour lui.
function proposeQuiz(data, ws) {
  const roomId = ws.currentRoom;
  if (!roomId) return;

  if (games[roomId]) {
    sendError(ws, 'Une partie est déjà en cours.');
    return;
  }

  const categoryId = Number(data.categoryId);
  const count = Number(data.count);
  if (!Number.isInteger(categoryId) || !Number.isInteger(count) || count <= 0) {
    sendError(ws, 'Proposition de quiz invalide.');
    return;
  }

  const vote = votes[roomId] ?? startVote(roomId);

  if (vote.voters.has(ws.userId)) {
    sendError(ws, 'Tu as déjà voté.');
    return;
  }
  vote.voters.add(ws.userId);

  const existing = vote.quizList.find(
    quiz => quiz.categoryId === categoryId && quiz.count === count
  );

  if (existing) {
    existing.nbvotes++;
  } else {
    vote.quizList.push({ categoryId, count, nbvotes: 1 });
  }

  broadcast(roomId, {
    type: 'quizList',
    timer: Math.ceil((vote.endsAt - Date.now()) / 1000),
    quizList: vote.quizList,
  });

  if (hasEveryoneVoted(roomId, vote)) {
    endVote(roomId);
  }
}

function startVote(roomId) {
  const vote = {
    quizList: [],
    voters: new Set(),
    endsAt: Date.now() + VOTE_DURATION_MS,
    interval: null,
  };
  votes[roomId] = vote;

  vote.interval = setInterval(() => {
    // la room a été vidée ou supprimée
    if (getRoomMembers(roomId).length === 0) {
      stopVote(roomId);
      return;
    }

    const remaining = Math.ceil((vote.endsAt - Date.now()) / 1000);

    // le 2e test gère le cas où le dernier joueur sans vote quitte la room
    if (remaining <= 0 || hasEveryoneVoted(roomId, vote)) {
      endVote(roomId);
      return;
    }
    broadcast(roomId, { type: 'voteTimer', timer: remaining });
  }, 1000);

  return vote;
}

function stopVote(roomId) {
  const vote = votes[roomId];
  if (!vote) return null;

  clearInterval(vote.interval);
  delete votes[roomId];
  return vote;
}

function endVote(roomId) {
  const vote = stopVote(roomId);
  if (!vote) return; // déjà terminé

  // en cas d'égalité, le premier proposé gagne
  const winner = vote.quizList.reduce((best, quiz) =>
    quiz.nbvotes > best.nbvotes ? quiz : best
  );

  broadcast(roomId, { type: 'voteEnded', winner });
  startGame(roomId, winner);
}

// ---------- QUIZ ----------

// setQuiz message : data: {type : setQuiz, quizId:'12312', categoryId: '1', count : '10'}
async function setQuiz(data, ws) {
  const question = await questionService.getCompleteQuestionById(1); // question de test

  if (data.quizId) {
    await quizService.getQuizById(data.quizId, ws.userId);
  } else if (data.categoryId) {
    const questions = await loadCategoryQuestions(data.categoryId, data.count);
    if (!questions) {
      sendError(ws, 'Catégorie introuvable.');
      return;
    }

    //IF ENOUGH QUESTIONS : SEND QUIZREADY TO THE FRONT
    //FRONT SENDS ACKNO BACK TO THE BACK
    //IF TOUT LE MONDE READY
    //SEND FIRST QUESTION
  }
  ws.send(JSON.stringify({ type: 'question', data: { question } }));
}

async function startGame(roomId, { quizId, categoryId, count }) {
  if (games[roomId]) return; // une seule partie par room

  // réservé avant le await pour bloquer un 2e lancement pendant le chargement
  const game = {
    questions: [],
    currentQuestionIndex: 0,
    scores: {},
    answered: new Map(),
    phase: 'loading',
    timer: null,
  };
  games[roomId] = game;

  try {
    const questions = quizId
      ? (await quizService.getQuizById(quizId)).questions
      : await loadCategoryQuestions(categoryId, count);

    if (!questions || questions.length === 0) {
      stopGame(roomId);
      broadcast(roomId, { type: 'ERROR', message: 'Aucune question disponible pour ce quiz.' });
      return;
    }

    game.questions = questions;
    game.phase = 'playing';
    getRoomMembers(roomId).forEach(member => {
      game.scores[member.userId] = 0;
    });

    sendQuestion(roomId);
  } catch (error) {
    console.error('[QUIZ] startGame:', error);
    stopGame(roomId);
    broadcast(roomId, { type: 'ERROR', message: 'Impossible de lancer le quiz.' });
  }
}

function stopGame(roomId) {
  const game = games[roomId];
  if (!game) return;

  clearTimeout(game.timer);
  delete games[roomId];
}

async function answer(data, ws) {
  // TODO
}

function sendQuestion(roomId) {
  const game = games[roomId];
  if (!game) return;

  // la room a été vidée ou supprimée
  if (getRoomMembers(roomId).length === 0) {
    stopGame(roomId);
    return;
  }

  const question = game.questions[game.currentQuestionIndex];
  game.answered = new Map();

  broadcast(roomId, {
    type: 'question',
    question: {
      id: question.id,
      text: question.text,
      options: question.answers.map(option => ({ id: option.id, text: option.text })),
    },
    timeLeft: QUESTION_DURATION_MS / 1000,
  });

  game.timer = setTimeout(() => {
    revealAnswer(roomId);
  }, QUESTION_DURATION_MS);
}

function revealAnswer(roomId) {
  const game = games[roomId];
  if (!game) return;

  clearTimeout(game.timer); // utile si on révèle avant la fin du timer

  const currentQuestion = game.questions[game.currentQuestionIndex];
  const correctAnswer = currentQuestion.answers.find(a => a.isCorrect);

  broadcast(roomId, {
    type: 'revealAnswer',
    data: {
      questionId: currentQuestion.id,
      correctAnswer: correctAnswer ? correctAnswer.id : null,
      scores: game.scores,
    },
  });

  game.timer = setTimeout(() => {
    game.currentQuestionIndex += 1;

    if (game.currentQuestionIndex >= game.questions.length) {
      broadcast(roomId, {
        type: 'gameOver',
        data: { finalScores: game.scores },
      });
      stopGame(roomId);
    } else {
      sendQuestion(roomId);
    }
  }, REVEAL_DELAY_MS);
}

module.exports = { setQuiz, proposeQuiz, answer, startGame, revealAnswer, games };