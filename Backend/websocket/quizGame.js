const { quizAttempt } = require('../lib/prisma');
const quizService = require('../src/services/quiz.service');
const questionService = require('../src/services/question.service');
const { broadcast, getRoomMembers } = require('./rooms');
const games = {};

// setQuiz message : data: {type : setQuiz, quizId:'12312', categoryId: '1', count : '10'}
 
// const category = await categoryModel.findById(params.categoryId);
// if(!category) non

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function setQuiz(data, ws){
  let quiz;
  let question;
  
  question = await questionService.getCompleteQuestionById(1);

  if(data.quizId){
    quiz = await quizService.getQuizById(data.quizId, ws.userId);
  } 
  else if (data.categoryId) {
    const category = await categoryModel.findById(params.categoryId);
    // if(!category)
      // ws.send(error)
    const available = await attemptModel.findActiveQuestionIds({
        categoryId: category.id,
      });
    const count = data.count ?? available.length;
    questionIds = shuffle(available).slice(0, count);

    //GET CATEGORYID
    //CHECK IF EXISTS
    //IF EXISTS GET QUESTIONS (COUNT IN DATA PAYLOAD)
    //IF ENOUGH QUESTIONS : SEND QUIZREADY TO THE FRONT
    //FRONT SENDS ACKNO BACK TO THE BACK
    //IF TOUT LE MONDE READY
    //SEND FIRST QUESTION
  }
  ws.send(JSON.stringify({ type: 'question', data: { question } })); 
}


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

async function answer(roomId,answerId){
  
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

function revealAnswer(roomId) {
  const game = games[roomId];

  if (!game) 
    return;

  const currentQuestion = game.questions[game.currentQuestionIndex];
  const correctAnswer = currentQuestion.answers.find(a => a.isCorrect);

  broadcast(roomId, {
    type: 'revealAnswer',
    data: {
      questionId: currentQuestion.id,
      correctAnswer: correctAnswer ? correctAnswer.id : null,
      scores: game.scores
    }
  });

  setTimeout(() => {
    game.currentQuestionIndex += 1;

    if (game.currentQuestionIndex >= game.questions.length) {
      broadcast(roomId, {
        type: 'gameOver',
        data: {
          finalScores: game.scores
        }
      });
      delete games[roomId];
    } else {
      sendQuestion(roomId); 
    }
  }, 3000);
}

module.exports = { setQuiz, startGame, revealAnswer, games };