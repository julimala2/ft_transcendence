const { findActiveQuestionIds } = require("../../src/models/attempt.model");
const { shuffle } = require("../../src/services/attempt.service");
const { getCompleteQuestionById } = require("../../src/services/question.service");

const pool = new Map();
const duelRooms = {};


const TIME_TO_ANSWER = 20000;
const NB_QUESTIONS = 5;
const GOOD_ANSWER_POINTS = 3;

    // tenvoie un msg "duelFound"
    // front dans useSocket ca detecte duelFound et ca te propose de rejoindre

/******************
 *  MATCHMAKING   *
 ******************/ 
function rankedGame(data, ws) {

    const opponent = pool.get(data.category);

    if (opponent && opponent != ws) {     //adversaire trouvé -> creer duelroom
        const duelId = Math.random().toString(36).substr(2, 6).toUpperCase();
        ws.duelId = duelId;
        opponent.duelId = duelId;
        leavePool(null, opponent);
        duelRooms[duelId] = {
            phase: "starting",
            members: [ws, opponent],
            categoryId: data.category,
            scores: new Map(),
            questionsId: null,
            currentQuestionIndex: 0,
            publicQuestion: null,
            answered: new Map(),
            correctAnswer: null,
            timer: null,
            interval: null,
          };
          startDuel(duelId);
    }

    else {     // ajouter ws a la pool
        pool.set(data.category, ws);
        ws.poolCategory = data.category;
    }
}

function leavePool(data, ws) {
  if (ws.poolCategory && pool.get(ws.poolCategory) === ws) {
    pool.delete(ws.poolCategory);
  }
  ws.poolCategory = null;
  ws.send(JSON.stringify({type:'leavedPool'}));
}
/******************
 *      GAME      *
 ******************/ 
// temps de reponse = 20sec -> des que un joueur repond 5sec restante pour l'autre joueur 

async function startDuel(duelId) {

  const duel = duelRooms[duelId];
  if (!duel) { return; }

  sendDuelState(duelId);
  try {
    const available = await findActiveQuestionIds({categoryId : duel.categoryId });
    duel.questionsId = shuffle(available).slice(0, NB_QUESTIONS);
    duel.members.forEach(player => { 
      duel.scores.set(player.username, 0);
    });
    await sendQuestion(duelId);
    } catch (error) {
        console.log("quiz start error", error);
    }
}

async function sendQuestion(duelId) {
  const duel = duelRooms[duelId];
  if (!duel) { return; }

  duel.phase = "question";
  const questionId = duel.questionsId[duel.currentQuestionIndex];
  const question = await getCompleteQuestionById(questionId);
  const publicQuestion = {
        text: question.text,
        image: question.image,
        answers: question.answers.map(({isCorrect, ...rest}) => rest),
    };
  
  duel.publicQuestion = publicQuestion;
  duel.correctAnswer = question.answers.find(a => a.isCorrect === true);
  duel.timer = TIME_TO_ANSWER;
  sendDuelState(duelId);
  duelTimer(duelId, TIME_TO_ANSWER, revealAnswers);
}

function rankedAnswer(data, ws){
  const duelId = ws.duelId;
  if (!duelRooms[duelId] || duelRooms[duelId].phase !== 'question' ) {
     return; }
  if (duelRooms[duelId].answered.get(ws.userId)) {
    ws.send(JSON.stringify({type: 'duelAnswer', data: 'already answered'}));
    return;
  }
  duelRooms[duelId].answered.set(ws.userId, data.answerId);
  duelcast(duelId, {type: 'duelAnswer', data: { type:'hasAnswer', user: ws.username }});
  if (duelRooms[duelId].answered.size === 1 && duelRooms[duelId].timer > 5000)
  {
    clearInterval(duelRooms[duelId].interval);
    duelTimer(duelId, 5000, revealAnswers);
  }
  else if (duelRooms[duelId].answered.size === 2)
  {
    clearInterval(duelRooms[duelId].interval);
    revealAnswers(duelId);
  }
}

function revealAnswers(duelId){
  const duel = duelRooms[duelId];
  if (!duel) { return; }

  duel.phase = "revealAnswers";

  duel.answered.forEach((answer, userId) => {
    if (answer.id === duel.correctAnswer.id) {
      duel.scores.set(userId, duel.scores.get(userId) + GOOD_ANSWER_POINTS);
    }
   });
  sendDuelState(duelId);
  duel.answered.clear();
  if ((duel.currentQuestionIndex + 1) === NB_QUESTIONS) {
    duelTimer(duelId, 5000, endDuel); }
  else {
    duel.currentQuestionIndex++;
    duelTimer(duelId, 5000, sendQuestion); }
}

function endDuel(duelId){ 
  const duel = duelRooms[duelId];
  duel.phase = "endDuel";
  //ENVOYER LES RESULTATS AUX STATS
  sendDuelState(duelId);
  duel.members.forEach(player => {player.duelId = null; });
  delete duelRooms[duelId];
}

function duelTimer(duelId, time, funct) {
  const endsAt = Date.now() + time;

  duelcast(duelId,  {type: 'time', data : time});
  duelRooms[duelId].interval = setInterval(() => {
    duelRooms[duelId].timer = (endsAt - Date.now());
    if(duelRooms[duelId].timer <= 0){
        clearInterval(duelRooms[duelId].interval);
        funct(duelId);
        return;
    }
    duelcast(duelId,  {type: 'time', data : duelRooms[duelId].timer});
  }, 1000);
}

function requestDuelState(message, ws) {
  if(duelRooms[ws.duelId])
    sendDuelState(ws.duelId);
  else
    ws.send(JSON.stringify({type: "duelState", data :{type : "noDuelState"}}));
}

function sendDuelState(duelId){
  if (!duelRooms[duelId]) return;
  const duelState = {
    phase : duelRooms[duelId]?.phase || null,
    timer: duelRooms[duelId]?.timer || null,
    scores : Object.fromEntries(duelRooms[duelId]?.scores || new Map()),
    question : duelRooms[duelId]?.publicQuestion || null,
  };
  if (duelRooms[duelId].phase != 'revealAnswers')
      duelState.correctAnswer = null;
  else {
    duelState.correctAnswer = duelRooms[duelId].correctAnswer.text;
  }
  duelcast(duelId, {type: 'duelState', data : duelState});
}


function duelcast(duelId, data, except = null) {
  const duel = duelRooms[duelId];
  if (!duel) return;

  duel.members.forEach(ws => {
    if (ws !== except && ws.readyState === 1) {
      ws.send(JSON.stringify(data));
    }
  });
}

module.exports = {rankedGame, rankedAnswer, requestDuelState, leavePool };