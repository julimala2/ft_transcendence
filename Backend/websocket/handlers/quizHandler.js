const { proposeQuiz, setQuiz, answer } = require('../quizGame');

const handlers = {
  proposeQuiz, // data : {type: proposeQuiz, categoryId, count}
  setQuiz,
  answer,
};

async function quizHandler(data, ws) {
  const handler = handlers[data.type];
  if (!handler) return;

  try {
    await handler(data, ws);
  } catch (error) {
    console.error('[QUIZ]', error);
    ws.send(JSON.stringify({ type: 'ERROR', message: 'Erreur du quiz.' }));
  }
}

module.exports = {quizHandler};