const { broadcast, getRoomMembers} = require('../rooms');
const { setQuiz, startQuiz, answer } = require('../quizGame'); 


const handlers = {
  setQuiz: setQuiz, //data : {type: category/custom, nquestions, difficulty,}
  start: startQuiz,
  answer : answer,
};

async function quizHandler(data, ws) {
  const roomId = ws.currentRoom;
  const handler = handlers[data.type];

  if (handler)
    handler(data, ws);

  
// starQuiz : 
// set tout le quiz  attente de tous les player ready et renvoie quiz started 
  // if (!game || game.questions[game.currentQuestionIndex].id !== questionId) {
  //   ws.send(JSON.stringify({
  //     type: 'ERROR',
  //     message: 'Question invalide ou game terminée.'
  //   }));
  //   return;
  // }

  // if (game.answered.has(ws.userId)) {
  //   ws.send(JSON.stringify({
  //     type: 'ERROR',
  //     message: 'Tu as déjà répondu à cette question !'
  //   }));

  //   return;

  // }

  // game.answered.set(ws.userId, true);

  // const currentQuestion = game.questions[game.currentQuestionIndex];
  // const correctAnswer = currentQuestion.answers.find(a => a.isCorrect);
  // const isCorrect = correctAnswer && correctAnswer.id === answer;


  // if (isCorrect) {
  //   game.scores[ws.userId] += 1;
  // }
  // broadcast(roomId, {
  //   type: 'PLAYER_ANSWERED',
  //   data: {
  //     user: ws.username,
  //     questionId: questionId,
  //     answer: answer,
  //     isCorrect: isCorrect,
  //     scores: game.scores
  //   }

  // });


  // const members = getRoomMembers(roomId);
  // if (game.answered.size === members.length) {
  //   clearTimeout(game.timer);
  //   revealAnswer(roomId);

  // }
}



module.exports = { quizHandler };

