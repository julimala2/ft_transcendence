const { broadcast, getRoomMembers } = require("../rooms/room.manager");
const { getCategoryById } = require("../../src/services/category.service");
const { findActiveQuestionIds } = require("../../src/models/attempt.model");
const { shuffle } = require("../../src/services/attempt.service");
const { getCompleteQuestionById } = require("../../src/services/question.service");

const games = {};
const votes = {};

const TIME_TO_ANSWER = 15000;
//endVote -> empecher de relancer un vote.
//gameEnded -> envoyer les scores etc et supprimer games[roomId];


async function proposeQuiz(data, ws) {
  const roomId = ws.currentRoom;
  //Check here if game is in progress
  if (!roomId) throw new Error(`roomId error.`);
  if(!games[roomId]){
    const game = {
      questionsId: [],
      currentQuestionIndex: 0,
      scores: new Map(),
      answered: new Map(),
      phase: 'vote',
      timer: null,
    };
    games[roomId] = game;
  }
  
  if (games[roomId].phase !== 'vote') throw new Error(`game already started.`);
  

  //Recup data values
  const categoryId = data.categoryId;
  const category = await getCategoryById(data.categoryId);
  const categoryName = category.name;
  const count = data.count;
  
  console.log(categoryName);
  const vote = votes[roomId] ?? startVote(roomId);
  
  const PropositionExisting = vote.quizList.find(
      q => q.categoryId === categoryId && q.count === count
  );
  if (PropositionExisting) {
    PropositionExisting.nbVotes++;
  } else {
      vote.quizList.push({categoryId, categoryName, count, nbVotes: 1});
  }

  sendGameState(roomId);
}


function startVote(roomId){
  const vote = {
    quizList: [],
    endsAt: Date.now() + 5000,
    interval: null,
  };

  votes[roomId] = vote;
  
  vote.interval = setInterval(() => {
    const remaining = (vote.endsAt - Date.now());
    games[roomId].timer = remaining;
    if(remaining <= 0){
        endVote(roomId);
        return;
    }
    sendGameState(roomId);
  }, 1000);
  return (vote);
}

function endVote(roomId) {
  const vote = votes[roomId];
  if (!vote) return;
  clearInterval(vote.interval);
  delete votes[roomId];

  let winner = vote.quizList[0];
  for (let i = 1; i < vote.quizList.length; i++){
    if(vote.quizList[i].nbVotes > winner.nbVotes)
        winner = vote.quizList[i];
  }
  games[roomId].phase = 'endVote';
  games[roomId].winner = winner;
  sendGameState(roomId);
  games[roomId].timeout = setTimeout(() => {
    startGame(roomId);
  }, 5000);
}

async function startGame(roomId) {

  clearTimeout(games[roomId].timeout);
  try {
    const available = await findActiveQuestionIds({categoryId : games[roomId].winner.categoryId });
    if(available.length < games[roomId].winner.count)
        games[roomId].winner.count = available.length;

    games[roomId].questionsId = shuffle(available).slice(0, games[roomId].winner.count);
    getRoomMembers(roomId).forEach(player => { 
      games[roomId].scores.set(player.userId, 0);
    });
    await sendQuestion(roomId);
    } catch (error) {
        console.log("quiz start error", error);
    }
}

async function sendQuestion(roomId) {
  clearTimeout(games[roomId].timeout);
  games[roomId].phase = "question";
  const questionId = games[roomId].questionsId[games[roomId].currentQuestionIndex];
  const question = await getCompleteQuestionById(questionId);
  const publicQuestion = {
        text: question.text,
        image: question.image,
        answers: question.answers.map(({isCorrect, ...rest}) => rest),
    };
  
  games[roomId].publicQuestion = publicQuestion;
  games[roomId].currentQuestion = question;
  games[roomId].timer = TIME_TO_ANSWER;
  games[roomId].timeout = setTimeout(() => {
    revealAnswers(roomId);
  }, TIME_TO_ANSWER)
  sendGameState(roomId);
  
}

function onAnswer(data, ws){
  const roomId = ws.currentRoom;
  games[roomId].answered.set(ws.userId, {id : data.answerId, time : data.answerTime});
  if (games[roomId].answered.size === games[roomId].scores.size)
  {
    clearTimeout(games[roomId].timeout);
    revealAnswers(roomId);
  }
}

function revealAnswers(roomId){
  const game = games[roomId];
  game.phase = "revealAnswers";
  const correctAnswer = game.currentQuestion.answers.find(a => a.isCorrect === true);
  game.correctAnswerId = correctAnswer.id;
  
  game.answered.forEach((answer, userId) => {
    if (answer.id === correctAnswer.id) {
      const points = 3;
      game.scores.set(userId, game.scores.get(userId) + points);
    }
   });
  sendGameState(roomId);
  game.answered.clear();
  game.timeout = setTimeout (() => {
    if ((game.currentQuestionIndex + 1) === game.winner.count) {
      endGame(roomId); }
    else {
      game.currentQuestionIndex++;
      sendQuestion(roomId);
    }
  }, 5000)
}

function endGame(roomId){ 
  const game = games[roomId];
  game.phase = "endGame";
  //ENVOYER LES RESULTATS AUX STATS
  sendGameState(roomId);
  delete games[roomId];
  sendGameState(roomId);
}

function requestGameState(message, ws) {
  if(games[ws.currentRoom])
    sendGameState(ws.currentRoom);
  else
    ws.send(JSON.stringify({type: "gameState", data :{type : "noGameState"}}));
}

function sendGameState(roomId){
  if (!games[roomId]) return;
  const gameState = {
    phase : games[roomId]?.phase || null,
    quizList : votes[roomId]?.quizList || null,
    timer: games[roomId]?.timer || null,
    winner : games[roomId]?.winner || null,
    scores : games[roomId]?.scores || null,
    question : games[roomId]?.publicQuestion || null,
  };
  if (games[roomId].phase != 'revealAnswers')
      gameState.correctAnswerId = null;
  else {
    gameState.correctAnswerId = games[roomId].correctAnswerId;
  }
  broadcast(roomId, {type: 'gameState', data : gameState});
}

module.exports = { proposeQuiz, startVote, onAnswer, requestGameState };

// reduce() parcourt un tableau et le réduit à une seule valeur, en gardant un résultat qu'il met à jour à chaque élément.

// Exemple simple, une somme :


// const total = [1, 2, 3].reduce((acc, n) => acc + n, 0);
// // total = 6
// acc est le résultat en cours (l'accumulateur).
// n est l'élément actuel.
// 0 est la valeur de départ.
// Ce que la fonction renvoie devient le nouvel acc pour le tour suivant.
// Ici : 0 + 1 = 1, puis 1 + 2 = 3, puis 3 + 3 = 6.

// Dans ton vote, il sert à garder le quiz qui a le plus de votes :


// const winner = vote.quizList.reduce((best, quiz) =>
//   quiz.nbVotes > best.nbVotes ? quiz : best
// );
// Sans valeur de départ, best commence avec le premier quiz de la liste. Ensuite, à chaque tour, on garde le quiz actuel s'il a plus de votes que best, sinon on garde best.

// Avec 3 quiz ayant 1, 4 et 2 votes :

// best commence avec le quiz à 1 vote.
// 4 > 1, donc best devient le quiz à 4 votes.
// 2 n'est pas supérieur à 4, donc best ne change pas.
// Le résultat est le quiz à 4 votes. En cas d'égalité, le premier reste gagnant, car > ne remplace best que si le nouveau score est strictement plus grand.

// Sur un tableau vide et sans valeur de départ, reduce lève une erreur. Ça n'arrive pas ici, car un vote démarre toujours avec au moins une proposition.