const { proposeQuiz, onAnswer, requestGameState } = require('../game/room.game');
const { rankedGame, rankedAnswer, requestDuelState, leavePool } = require('../game/ranked.game');

const handlers = {
  requestGameState,
  proposeQuiz, 
  onAnswer,
  requestDuelState,
  rankedGame,
  rankedAnswer,
  leavePool
};

async function quizHandler(data, ws) {
  try {
      const handler = handlers[data.type];
      if (!handler) throw new Error(`Quiz error : ${data.type} `);
      
      await handler(data, ws);
  } 
  catch (error) {
      console.error('[QUIZ]', error.message);
      ws.send(JSON.stringify({ type: 'ERROR', message: 'Erreur du quiz.' }));
  }
}

module.exports = {quizHandler, leavePool};