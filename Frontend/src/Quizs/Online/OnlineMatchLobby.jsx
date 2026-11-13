import { useState, useEffect } from 'react';

import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';

import { getAllCategories } from '../../Api/quiz.jsx';
import { getAllThemes } from '../../Api/themes.jsx';
import { StyledButton } from '../../Components/Buttons';
import { CategorySelector } from '../../Components/CategorySelector.jsx';
import { MainContainer, PageContainer, StyledDiv } from '../../Components/Containers';
import { useSocket } from '../../Hooks/SocketProvider';
import { useAuth } from '../../Hooks/useAuth';

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

    useEffect(() => {
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

        return () => {
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

    function searchOpponent() {
        if (!category) return;
        send('quiz', { type: 'rankedGame', category: category.id });
        setSearching(true);
    }

    function cancelSearch() {
        send('quiz', { type: 'leavePool' });
        setSearching(false);
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
                        <StyledButton
                            variant="primary"
                            className="flex flex-row items-center align-center justify-center max-w-100"
                            onClick={searchOpponent}
                            disabled={!category || searching}
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
                </div>
                )
            }
            </PageContainer>
        </MainContainer>
    )
}
