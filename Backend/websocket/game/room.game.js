const { broadcast, getRoomMembers } = require("../rooms/room.manager");
const { getCategoryById } = require("../../src/services/category.service");
const { findActiveQuestionIds } = require("../../src/models/attempt.model");
const { shuffle } = require("../../src/services/attempt.service");
const { getCompleteQuestionById } = require("../../src/services/question.service");

const games = {};
const votes = {};

const TIME_TO_VOTE = 15000;
const TIME_ENDVOTE = 5000;
const TIME_TO_ANSWER = 15000;


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
  
  const vote = votes[roomId] ?? startVote(roomId);
  
  const PropositionExisting = vote.quizList.find(
      q => q.categoryId === categoryId && q.count === count
  );
  if (PropositionExisting) {
    PropositionExisting.nbVotes++;
  } else {
      vote.quizList.push({categoryId, categoryName, count, nbVotes: 1});
  }
}


function startVote(roomId){
  const vote = {
    quizList: [],
    endsAt: Date.now() + TIME_TO_VOTE,
    interval: null,
  };

  votes[roomId] = vote;
  let remaining = (vote.endsAt - Date.now()); 
  games[roomId].timer = remaining;
  sendGameState(roomId);
  
  vote.interval = setInterval(() => {
    remaining = (vote.endsAt - Date.now());
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
  games[roomId].timer = TIME_ENDVOTE;
  sendGameState(roomId);
  quizTimer(roomId, TIME_ENDVOTE, startGame);
}

async function startGame(roomId) {

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
  sendGameState(roomId);
  quizTimer(roomId, TIME_TO_ANSWER, revealAnswers);
}

function onAnswer(data, ws){
  const roomId = ws.currentRoom;
  games[roomId].answered.set(ws.userId, {id : data.answerId, time : data.answerTime});
  if (games[roomId].answered.size === games[roomId].scores.size)
  {
    clearInterval(games[roomId].interval);
    revealAnswers(roomId);
  }
}

function revealAnswers(roomId){
  const game = games[roomId];
  game.phase = "revealAnswers";
  const correctAnswer = game.currentQuestion.answers.find(a => a.isCorrect === true);
  game.correctAnswer = correctAnswer.text;
  
  game.answered.forEach((answer, userId) => {
    if (answer.id === correctAnswer.id) {
      const points = 3;
      game.scores.set(userId, game.scores.get(userId) + points);
    }
   });
  sendGameState(roomId);
  game.answered.clear();
  if ((game.currentQuestionIndex + 1) === game.winner.count) {
    quizTimer(roomId, 5000, endGame); }
  else {
    game.currentQuestionIndex++;
    quizTimer(roomId, 5000, sendQuestion); }
}

function endGame(roomId){ 
  const game = games[roomId];
  game.phase = "endGame";
  //ENVOYER LES RESULTATS AUX STATS
  sendGameState(roomId);
  delete games[roomId];
  sendGameState(roomId);
}

function quizTimer(roomId, time, funct) {
  const endsAt = Date.now() + time;
  broadcast(roomId,  {type: 'time', data : time});
  games[roomId].interval = setInterval(() => {
    const remaining = (endsAt - Date.now());
      if(remaining <= 0){
          clearInterval(games[roomId].interval);
          funct(roomId);
          return;
      }
      broadcast(roomId,  {type: 'time', data : remaining});
  }, 1000);
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
    gameState.correctAnswer = games[roomId].correctAnswer;
  }
  broadcast(roomId, {type: 'gameState', data : gameState});
}

module.exports = { proposeQuiz, onAnswer, requestGameState };
