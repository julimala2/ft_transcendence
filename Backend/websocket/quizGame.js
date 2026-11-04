const { broadcast, getRoomMembers } = require("./rooms");
const { findActiveQuestionIds } = require("../src/models/attempt.model");
const { shuffle } = require("../src/services/attempt.service");
const { getCompleteQuestionById } = require("../src/services/question.service");

const games = {};
const votes = {};

const QUESTION_DURATION = 10000;
//endVote -> empecher de relancer un vote.

function proposeQuiz(data, ws) {
    const roomId = ws.currentRoom;
    
    //Check here if game is in progress
    if (!roomId) return;
    if (games[roomId]) return;
    
    //Recup data values
    const categoryId = data.categoryId;
    const count = data.count;
    
    console.log("proposeQuiz reçu pour la room:", roomId, "avec categoryId:", categoryId, "et count:", count);
    
    const vote = votes[roomId] ?? startVote(roomId);
    
    const PropositionExisting = vote.quizList.find(
        q => q.categoryId === categoryId && q.count === count
    );
    if (PropositionExisting) {
      PropositionExisting.nbVotes++;
    } else {
        vote.quizList.push({categoryId,count,nbVotes:1});
    }

    broadcast(roomId, {type: 'quizList', quizList: vote.quizList});
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

    if(remaining <= 0){
        endVote(roomId);
        return;
    }
    broadcast(roomId, {type:"voteTimer", timer : remaining});  
  }, 1000);
  return (vote);
}

function endVote(roomId) {
  const vote = votes[roomId];
  clearInterval(vote.interval);
  delete votes[roomId];

  let winner = vote.quizList[0];
  for (let i = 1; i < vote.quizList.length; i++){
    if(vote.quizList[i].nbVotes > winner.nbVotes)
        winner = vote.quizList[i];
  }
  broadcast(roomId, {type: 'endVote', data: {category: winner}});
  startGame(roomId, winner);
}

async function startGame(roomId, winner) {
  const categoryId = winner.categoryId;
  const count = winner.count;
  if(games[roomId]) return; //one game per room

  const game = {
    questionsId: [],
    currentQuestionIndex: 0,
    scores: {},
    answered: new Map(),
    phase: 'loading',
    timer: null,
  };

  games[roomId] = game;
  try {
    const available = await findActiveQuestionIds({categoryId : categoryId });
    if(available.length < count)
        return;
    game.questionsId = shuffle(available).slice(0, count);
    getRoomMembers(roomId).forEach(player => { 
      game.scores[player.userId] = 0;
    });
    game.phase = 'playing';
    sendQuestion(roomId);

    } catch (error) {
        console.log("quiz start error", error);
    }
}

async function sendQuestion(roomId) {
  const questionId = games[roomId].questionsId[games[roomId].currentQuestionIndex];
  const question = await getCompleteQuestionById(questionId);
  const publicQuestion = {
        text: question.text,
        image: question.image,
        answers: question.answers.map(({isCorrect, ...rest}) => rest),
    };

  broadcast(roomId, {
    type: 'question',
    data: {
      question: publicQuestion,
      timeLeft: QUESTION_DURATION,
    },
  });
  

//   Explication :
// ({ isTrue, ...rest }) => rest :
// On déstructure chaque objet de question.answers pour extraire isTrue.
// ...rest récupère toutes les autres propriétés (ex: text, id, etc.).
// On retourne rest, qui est un nouvel objet sans isTrue.
}

module.exports = { proposeQuiz, startVote };


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