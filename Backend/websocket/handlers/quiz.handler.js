const { proposeQuiz } = require('../game/quiz.game');

const handlers = {
  proposeQuiz, // data : {type: proposeQuiz, categoryId, count}
};

async function quizHandler(data, ws) {
  try {
      const handler = handlers[data.type];
      if (!handler) throw new Error(`Quiz error : ${data.type} `);
      
      await handler(data, ws);
  } 
  catch (error) {
      console.error('[QUIZ]', error);
      ws.send(JSON.stringify({ type: 'ERROR', message: 'Erreur du quiz.' }));
  }
}

module.exports = {quizHandler};