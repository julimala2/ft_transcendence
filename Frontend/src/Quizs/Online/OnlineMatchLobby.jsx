import { useState, useEffect } from 'react';

import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';

import { getAllCategories, getAllQuizs } from '../../Api/quiz.jsx';
import { getAllThemes } from '../../Api/themes.jsx';
import { StyledButton } from '../../Components/Buttons';
import { CategorySelector } from '../../Components/CategorySelector.jsx';
import { MainContainer, PageContainer, StyledDiv } from '../../Components/Containers';
import { StyledSeparator } from '../../Components/Separators';
import { useSocket } from '../../Hooks/SocketProvider';
import { useAuth } from '../../Hooks/useAuth';

function DuelDisplay({ duelState, time, hasAnswered, opponentAnswered, user, onAnswer, onClean }) {
    return (
        <StyledDiv outerClassName="w-full max-w-2xl" className="gap-3 p-6">
                    {duelState.phase === "starting" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-full flex justify-center"
                        >
                            <div className="flex flex-col items-center gap-3">
                                <p className="text-muted text-center">Duel en cours de préparation...</p>
                                <svg className="w-8 h-8 animate-spin text-muted" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4z" />
                                </svg>
                            </div>
                        </motion.div>
                    )}

                    {duelState.phase === "question" && duelState.question && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full"
                        >
                            <div className="flex flex-row w-full gap-3">
                                <div className="flex-1 bg-gray-800 rounded-2xl p-4 flex flex-col items-center gap-1">
                                    <p className="text-muted text-xs font-semibold uppercase tracking-wide">
                                        Temps restant
                                    </p>
                                    {opponentAnswered ? (
                                        <p className="text-3xl font-extrabold text-danger">5s</p>
                                    ) : (
                                        <p className={`text-3xl font-extrabold ${time && time <= 5000 ? 'text-danger' : 'text-white'}`}>
                                            {time ? Math.ceil(time / 1000) : 20}s
                                        </p>
                                    )}
                                </div>
                                <div className="flex-1 bg-gray-800 rounded-2xl p-4 flex flex-col items-center gap-1">
                                    <p className="text-muted text-xs font-semibold uppercase tracking-wide">
                                        Adversaire
                                    </p>
                                    <p className="text-2xl font-bold text-ok">
                                        {opponentAnswered ? '✓ Répondu' : '...'}
                                    </p>
                                </div>
                            </div>

                            <StyledSeparator />

                            <h2 className="text-xl font-bold text-center leading-tight">
                                {duelState.question.text}
                            </h2>

                            {duelState.question.image && (
                                <div className="flex justify-center w-full">
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}/quiz-images/${duelState.question.image.src}`}
                                        alt={duelState.question.image.alt || 'Image de la question'}
                                        className="max-w-full max-h-[300px] rounded-2xl object-contain"
                                    />
                                </div>
                            )}

                            <div className="flex flex-col gap-3 w-full">
                                {duelState.question.answers.map((answer) => (
                                    <StyledButton
                                        key={answer.id}
                                        variant="secondary"
                                        onClick={() => onAnswer(answer.id)}
                                        disabled={hasAnswered}
                                        className={`w-full p-3.5 text-left border-2! transition-all duration-200 ${
                                            hasAnswered
                                                ? 'bg-gray-800! border-gray-200! cursor-not-allowed'
                                                : 'bg-gray-800! border-gray-200! hover:bg-gray-700!'
                                        }`}
                                    >
                                        {answer.text}
                                    </StyledButton>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {duelState.phase === "revealAnswers" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full"
                        >
                            <div className="flex flex-row w-full gap-3">
                                <div className="flex-1 bg-gray-800 rounded-2xl p-4 flex flex-col items-center gap-1">
                                    <p className="text-muted text-xs font-semibold uppercase tracking-wide">
                                        Prochaine question
                                    </p>
                                    <p className="text-3xl font-extrabold text-white">
                                        {time ? Math.ceil(time / 1000) : 5}s
                                    </p>
                                </div>
                                <div className="flex-1 bg-gray-800 rounded-2xl p-4 flex flex-col items-center gap-1">
                                    <p className="text-muted text-xs font-semibold uppercase tracking-wide">
                                        Adversaire
                                    </p>
                                    <p className="text-2xl font-bold text-ok">
                                        {opponentAnswered ? '✓ Répondu' : '...'}
                                    </p>
                                </div>
                            </div>

                            <StyledSeparator />

                            <h2 className="text-xl font-bold text-center leading-tight">
                                {duelState.question?.text}
                            </h2>

                            {duelState.question?.image && (
                                <div className="flex justify-center w-full">
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}/quiz-images/${duelState.question.image.src}`}
                                        alt={duelState.question.image.alt || 'Image de la question'}
                                        className="max-w-full max-h-[300px] rounded-2xl object-contain"
                                    />
                                </div>
                            )}

                            {duelState.correctAnswer && (
                                <div className="p-4 rounded-2xl text-center border bg-green-500/12 text-ok border-ok">
                                    <p className="font-bold">
                                        ✓ Réponse correcte: {duelState.correctAnswer}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {duelState.phase === "endDuel" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-full flex flex-col items-center gap-5"
                        >
                            <div className="bg-gray-800 rounded-2xl p-6 flex flex-col items-center gap-4 w-full">
                                <p className="text-muted text-sm font-semibold uppercase tracking-wide">
                                    Score final
                                </p>
                                <div className="flex flex-row w-full gap-3">
                                    {Object.entries(duelState.scores || {}).map(([username, score], index) => (
                                        <div key={username} className="flex-1 flex flex-col items-center gap-2">
                                            <p className="text-muted text-sm font-medium">
                                                {username === user?.username ? 'Toi' : username}
                                            </p>
                                            <p className="text-4xl font-extrabold text-amber-300">{score}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <StyledButton onClick={onClean}>
                                    Retour au lobby
                                </StyledButton>
                            </div>
                        </motion.div>
                    )}
                </StyledDiv>
    );
}

export function OnlineMatchLobby() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, loading: authLoading } = useAuth();
    const { send, on, off, connected, connectionError } = useSocket();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [themes, setThemes] = useState([]);
    const [category, setCategory] = useState(null);
    const [selectedThemeId, setSelectedThemeId] = useState(null);
    const [searching, setSearching] = useState(false);
    const [duelState, setDuelState] = useState(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [time, setTime] = useState(null);
    const [opponentAnswered, setOpponentAnswered] = useState(false);
    const [mode, setMode] = useState('categories');
    const [quizs, setQuizs] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [quizsLoading, setQuizsLoading] = useState(false);

    useEffect(() => {
        const duelStateHandler = (data) => {
            if(data){
                setDuelState(data);
                if(data.phase && data.phase == "starting"){
                    setHasAnswered(false);
                    setSearching(false);
                    setOpponentAnswered(false);
                }
            }
        }

        const timeHandler = (data) => {
            setTime(data);
        }

        const duelAnswerHandler = (data) => {
            if (data.type === 'hasAnswer' && data.user) {
                setOpponentAnswered(true);
            }
        }

        let cancelled = false;

        async function load() {
            try {
                const [cats, ths] = await Promise.all([
                    getAllCategories(),
                    getAllThemes(),
                ]);
                if (!cancelled) {
                    setCategories(cats);
                    setThemes(ths);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.error || err.message || 'Erreur inconnue');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        load();

        on('duelState', duelStateHandler);
        on('time', timeHandler);
        on('duelAnswer', duelAnswerHandler);
        return () => {
            off('duelState', duelStateHandler);
            off('time', timeHandler);
            off('duelAnswer', duelAnswerHandler);
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (connectionError) {
            setError(connectionError);
            return;
        }
        if (!connected) return;

        return () => {
        }
    }, [connected, connectionError, on, off, navigate]);

    useEffect(() => {
        if (duelState?.phase === "question") {
            setHasAnswered(false);
            setOpponentAnswered(false);
        }
    }, [duelState?.phase]);

    useEffect(() => {
        let cancelled = false;
        async function loadQuizs() {
            setQuizsLoading(true);
            try {
                const data = await getAllQuizs();
                if (!cancelled) {
                    setQuizs(data);
                }
            } catch (err) {
                if (!cancelled) {
                    console.error('Erreur chargement quizs:', err);
                }
            } finally {
                if (!cancelled) {
                    setQuizsLoading(false);
                }
            }
        }
        loadQuizs();
        return () => { cancelled = true; };
    }, []);

    function handleAnswer(answerId) {
        if (hasAnswered || !duelState || duelState.phase !== "question") return;
        
        // Vérifier que la réponse fait partie des réponses de la question actuelle
        const currentQuestion = duelState.question;
        if (!currentQuestion || !currentQuestion.answers.some(a => a.id === answerId)) {
            console.error("Réponse invalide pour la question actuelle");
            return;
        }
        
        setHasAnswered(true);
        send('quiz', { type: 'rankedAnswer', answerId: answerId });
    }

    function cleanDuelState() {
        setDuelState(null);
        setHasAnswered(false);
        setTime(null);
    }

    function searchOpponent() {
        if (mode === 'categories' && !category) return;
        if (mode === 'quizs' && !selectedQuiz) return;
        
        const payload = {
            type: 'rankedGame',
            ...(mode === 'categories' && { category: category.id }),
            ...(mode === 'quizs' && { quizId: selectedQuiz.id })
        };
        send('quiz', payload);
        setSearching(true);
    }

    function cancelSearch() {
        send('quiz', { type: 'leavePool' });
        setSearching(false);
        setSelectedQuiz(null);
        setCategory(null);
    }

    return (
        <MainContainer>
            <PageContainer>
        {authLoading || loading ? (
                    <StyledDiv className="items-center gap-4 p-10">
                        <svg className="w-10 h-10 animate-spin text-amber-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4z" />
                        </svg>
                        <p className="font-bold text-xl text-amber-200 animate-pulse w-full text-center">Chargement...</p>
                    </StyledDiv>
            )
            : !user ?
            (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <StyledDiv className="items-center gap-6 p-8">
                        <p className="font-bold text-xl text-center w-full">Tu dois être connecté pour jouer en ligne.</p>
                        <StyledButton
                            onClick={() => navigate('/account', { state: { backgroundLocation: location.pathname } })}
                        >Se connecter</StyledButton>
                    </StyledDiv>
                </motion.div>
            )
            :
            (
                <div className="flex flex-col items-center gap-6 w-full max-w-4xl min-h-0 max-h-full overflow-y-auto p-1">
                    {duelState ? (
                        <DuelDisplay
                            duelState={duelState}
                            time={time}
                            hasAnswered={hasAnswered}
                            opponentAnswered={opponentAnswered}
                            user={user}
                            onAnswer={handleAnswer}
                            onClean={cleanDuelState}
                        />
                    ) : (
                        <>
                        <motion.h1
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                            className="font-[Slackey] text-4xl md:text-5xl text-center bg-gradient-to-br from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent drop-shadow-[0px_0px_14px_rgba(234,179,8,0.45)]"
                        >
                            Commencer un match
                        </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="w-full"
                    >
                    <StyledDiv className="flex flex-col gap-5 p-6 w-full items-center justify-center ">
                        <div className="flex items-center gap-2 w-full max-w-sm">
                            <StyledButton
                                variant={mode === 'categories' ? 'primary' : 'secondary'}
                                onClick={() => {
                                    setMode('categories');
                                    setSelectedQuiz(null);
                                    setCategory(null);
                                    setSelectedThemeId(null);
                                }}
                                className="flex-1"
                            >
                                Catégories
                            </StyledButton>
                            <StyledButton
                                variant={mode === 'quizs' ? 'primary' : 'secondary'}
                                onClick={() => {
                                    setMode('quizs');
                                    setCategory(null);
                                    setSelectedQuiz(null);
                                    setSelectedThemeId(null);
                                }}
                                className="flex-1"
                            >
                                Communauté
                            </StyledButton>
                        </div>
                        
                        {mode === 'categories' && (
                            <>
                                <div className="flex items-center justify-center gap-3">
                                    <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                    <p className="font-bold text-xl bg-gradient-to-br from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">Choisis une catégorie</p>
                                </div>
                                <CategorySelector
                                    categories={categories}
                                    selectedId={category?.id ?? null}
                                    onSelect={cat => setCategory(cat)}
                                    themes={themes}
                                    selectedThemeId={selectedThemeId}
                                    onSelectTheme={id => {
                                        setSelectedThemeId(id);
                                        setCategory(null);
                                    }}
                                    disabled={searching}
                                />
                            </>
                        )}
                        
                        {mode === 'quizs' && (
                            <>
                                <div className="flex items-center justify-center gap-3">
                                    <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                    <p className="font-bold text-xl bg-gradient-to-br from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">Choisis un quiz public</p>
                                </div>
                                {quizsLoading ? (
                                    <p className="text-muted text-center">Chargement des quizs...</p>
                                ) : quizs.length === 0 ? (
                                    <p className="text-muted text-center">Aucun quiz public disponible</p>
                                ) : (
                                    <ul className="flex flex-col gap-3 w-full max-h-64 overflow-y-auto">
                                        {quizs.map(quiz => (
                                            <li
                                                key={quiz.id}
                                                className={`flex items-center justify-between gap-3 bg-gray-800 rounded-2xl p-4 cursor-pointer ${selectedQuiz?.id === quiz.id ? 'border-2 border-amber-400' : ''}`}
                                                onClick={() => setSelectedQuiz(quiz)}
                                            >
                                                <div className="flex flex-col gap-1 min-w-0">
                                                    <p className="font-bold truncate">{quiz.title}</p>
                                                    <p className="text-sm text-muted">
                                                        par {quiz.owner?.username || 'inconnu'} · {quiz._count?.questions ?? 0} question(s)
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        )}
                        <StyledButton
                            variant="primary"
                            className="flex flex-row items-center align-center justify-center max-w-100"
                            onClick={searchOpponent}
                            disabled={(mode === 'categories' && !category) || (mode === 'quizs' && !selectedQuiz) || searching}
                        >
                            <span className="flex items-center gap-2">
                                {searching ? (
                                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                                        <circle cx="11" cy="11" r="7" />
                                        <path d="m21 21-4.3-4.3" />
                                    </svg>
                                )}
                                {searching ? 'Recherche en cours...' : 'Chercher un adversaire'}
                            </span>
                        </StyledButton>
                        {searching &&
                            <StyledButton
                                variant="danger"
                                className="flex flex-row items-center align-center justify-center max-w-100"
                                onClick={cancelSearch}
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                                        <path d="M18 6 6 18M6 6l12 12" />
                                    </svg>
                                    Annuler la recherche
                                </span>
                            </StyledButton>
                        }
                        {error &&
                            <p className="w-full text-center font-bold text-red-400 bg-red-950/60 border-2 border-red-500 rounded-md p-2 shadow-[0px_0px_10px_2px_rgba(239,68,68,0.35)]">
                                Erreur : {error}
                            </p>
                        }
                    </StyledDiv>
                    </motion.div>
                        </>
                    )}
                </div>
                )
            }
            </PageContainer>
        </MainContainer>
    )
}
