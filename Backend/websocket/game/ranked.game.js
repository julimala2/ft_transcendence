const { findActiveQuestionIds, findQuizQuestionIds } = require("../../src/models/attempt.model");
const { shuffle } = require("../../src/services/attempt.service");
const { getCompleteQuestionById } = require("../../src/services/question.service");

const pool = new Map();
const duelRooms = {};


const TIME_TO_ANSWER = 20000;
const NB_QUESTIONS = 5;
const GOOD_ANSWER_POINTS = 1;

    // tenvoie un msg "duelFound"
    // front dans useSocket ca detecte duelFound et ca te propose de rejoindre

/******************
 *  MATCHMAKING   *
 ******************/ 
function rankedGame(data, ws) {

    const quiz = {type: data.category ? "cat" : "com", id : data.category ? data.category : data.quizId };

    let opponent;
    pool.forEach((w, q) => {
        if (q.type === quiz.type && q.id === quiz.id) {
          opponent = w;
        }
    })

    if (opponent && opponent != ws) {     //adversaire trouvé -> creer duelroom
        const duelId = Math.random().toString(36).substr(2, 6).toUpperCase();
        ws.duelId = duelId;
        opponent.duelId = duelId;
        leavePool(null, opponent);
        duelRooms[duelId] = createDuel(ws, opponent, quiz);
        duelcast(duelId, {type: 'matchFounded', data: { time: 3000 }});
        setTimeout(() => {
          startDuel(duelId);
        }, 3000);
    }
    else { 
        pool.set(quiz, ws);
        ws.poolCategory = quiz;
    }
}

function leavePool(data, ws)
{
  if (ws.poolCategory && pool.get(ws.poolCategory) === ws) {
    pool.delete(ws.poolCategory);
  }
  ws.poolCategory = null;
  ws.send(JSON.stringify({type:'leavedPool'}));
}
/******************
 *      GAME      *
 ******************/ 

async function startDuel(duelId)
{
  const duel = duelRooms[duelId];
  if (!duel) { return; }

  sendDuelState(duelId);
  try {
    let available;
    if (duel.type === "cat")
      available = await findActiveQuestionIds({categoryId : duel.categoryId });
    else
      available = await findQuizQuestionIds(duel.categoryId);
    const nQuestions = NB_QUESTIONS > available.length ? available.length : NB_QUESTIONS;
    duel.questionsId = shuffle(available).slice(0, nQuestions);
    duel.members.forEach(player => { 
      duel.scores.set(player.username, 0);
    });
    await sendQuestion(duelId);
    } catch (error) {
        console.log("quiz start error", error);
    }
}

async function sendQuestion(duelId)
{
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

function rankedAnswer(data, ws)
{
  const duelId = ws.duelId;
  if (!duelRooms[duelId] || duelRooms[duelId].phase !== 'question' ) {
     return; }
  if (duelRooms[duelId].answered.has(ws.username)) {
    ws.send(JSON.stringify({type: 'duelAnswer', data: 'already answered'}));
    return;
  }
  duelRooms[duelId].answered.set(ws.username, data.answerId);
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

function revealAnswers(duelId)
{
  const duel = duelRooms[duelId];
  if (!duel) { return; }

  duel.phase = "revealAnswers";

  duel.answered.forEach((answer, username) => {
    if (answer === duel.correctAnswer.id) {
      duel.scores.set(username, duel.scores.get(username) + GOOD_ANSWER_POINTS);
    }
   });
  sendDuelState(duelId);
  duel.answered.clear();
  if ((duel.currentQuestionIndex + 1) === duel.questionsId.length) {
    duelTimer(duelId, 5000, endDuel); }
  else {
    duel.currentQuestionIndex++;
    duelTimer(duelId, 5000, sendQuestion); }
}

function endDuel(duelId)
{ 
  const duel = duelRooms[duelId];
  duel.phase = "endDuel";
  sendDuelState(duelId);
  //ENVOYER LES RESULTATS AUX STATS
}

function leaveDuel(message, ws) 
{
  const duel = duelRooms[ws.duelId];
  if (!duel) { return; }
  duel.members = duel.members.filter(player => player !== ws);
  ws.send(JSON.stringify({ type:'leavedDuel'}));
  if (duel.members.length === 0)
    delete duelRooms[ws.duelId];
  else {
    duelcast(ws.duelId, {type: 'playerLeaved' })
  }
  ws.duelId = null;
}

//front -> rematchRequest
//if room pas vide, duelcast rematchRequest
//front -> rematchAccepted
//back -> relancer quiz sur la pool


function rematchRequest(data, ws)
{
  const duel = duelRooms[ws.duelId];
  if (!duel) return ;
  if (duel.rematch.length === 1 && !duel.rematch.includes(ws))
  {
    //reset le duelRoom (score, question index etc)
    const newDuel = createDuel(ws, duel.rematch[0], {type: duel.type, id: duel.categoryId});
    duelRooms[ws.duelId] = newDuel;
    startDuel(ws.duelId);
    return;
  }
  else
  {
    duel.rematch.push(ws);
    duelcast(ws.duelId, {type: 'rematchRequest'}, ws);
  }
}

/**********
*  UTILS  *
***********/

function duelTimer(duelId, time, funct)
{
  if (!duelRooms[duelId])
    return;
  const endsAt = Date.now() + time;

  duelcast(duelId,  {type: 'time', data : time});
  duelRooms[duelId].interval = setInterval(() => {
    if (!duelRooms[duelId])
      return;
    duelRooms[duelId].timer = (endsAt - Date.now());
    if(duelRooms[duelId].timer <= 0){
        clearInterval(duelRooms[duelId].interval);
        funct(duelId);
        return;
    }
    duelcast(duelId,  {type: 'time', data : duelRooms[duelId].timer});
  }, 1000);
}

function requestDuelState(message, ws)
{
  if(duelRooms[ws.duelId])
    sendDuelState(ws.duelId);
  else
    ws.send(JSON.stringify({type: "duelState", data :{type : "noDuelState"}}));
}

function sendDuelState(duelId)
{
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


function duelcast(duelId, data, except = null)
{
  const duel = duelRooms[duelId];
  if (!duel) return;
  duel.members.forEach(ws => {
    if (ws !== except && ws.readyState === 1) {
      ws.send(JSON.stringify(data));
    }
  });
}

function createDuel(player1, player2, quiz) 
{
  const duel = {
            type: quiz.type,
            phase: "starting",
            members: [player1, player2],
            categoryId: quiz.id,
            scores: new Map(),
            questionsId: null,
            currentQuestionIndex: 0,
            publicQuestion: null,
            answered: new Map(),
            correctAnswer: null,
            timer: null,
            interval: null,
            rematch: [],
  }
  return(duel);
}

module.exports = {rankedGame, rankedAnswer, requestDuelState, rematchRequest, leavePool, leaveDuel };