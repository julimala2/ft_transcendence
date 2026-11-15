import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

import { getAllCategories, getAllQuizs, startCustomQuiz } from '../../Api/quiz.jsx';
import { getAllThemes } from '../../Api/themes.jsx';
import { getCategoryTags } from '../../Api/categories.jsx';
import { StyledButton } from '../../Components/Buttons';
import { MainContainer, PageContainer, StyledDiv } from '../../Components/Containers';
import { QuizOfflineSelector } from './QuizOfflineSelector';
import { LengthSelector } from '../Online/LengthSelector';

/**
 * OfflineMenu - Main solo quiz selection page with 3 tabs:
 * - Rush: Quick mode with categories
 * - Custom: Custom mode with difficulty and length options
 * - Communauté: Community quizs
 */
const tagChipClass = selected =>
  `px-3 py-2 rounded-2xl border-2 cursor-pointer select-none transition-colors ${
    selected
      ? 'bg-amber-400 text-black border-amber-300 font-bold'
      : 'bg-gray-800 border-gray-200'
  }`;

export default function OfflineMenu() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [themes, setThemes] = useState([]);
    const [quizs, setQuizs] = useState([]);
    const [quizsLoading, setQuizsLoading] = useState(false);
    
    // Tab state: 'rush' | 'custom' | 'community'
    const [activeTab, setActiveTab] = useState('rush');
    
    // Rush mode state
    const [rushCategory, setRushCategory] = useState(null);
    const [rushThemeId, setRushThemeId] = useState(null);
    const [rushTags, setRushTags] = useState([]);
    const [rushSelectedTag, setRushSelectedTag] = useState(null);
    
    // Custom mode state
    const [customCategory, setCustomCategory] = useState(null);
    const [customThemeId, setCustomThemeId] = useState(null);
    const [customLength, setCustomLength] = useState(10);
    const [customDifficulty, setCustomDifficulty] = useState('medium');
    const [customTags, setCustomTags] = useState([]);
    const [customSelectedTag, setCustomSelectedTag] = useState(null);
    
    // Community mode state
    const [communityQuiz, setCommunityQuiz] = useState(null);
    const [communityThemeId, setCommunityThemeId] = useState(null);

    useEffect(() => {
        let cancelled = false;
        
        async function loadData() {
            try {
                const [cats, ths, qs] = await Promise.all([
                    getAllCategories(),
                    getAllThemes(),
                    getAllQuizs(),
                ]);
                if (!cancelled) {
                    setCategories(cats);
                    setThemes(ths);
                    setQuizs(qs);
                    setLoading(false);
                }
            } catch (err) {
                console.error('Erreur chargement données:', err);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }
        
        loadData();
        return () => { cancelled = true; };
    }, []);

    // Load tags when rush category changes
    useEffect(() => {
        if (!rushCategory || !rushCategory?.id) {
            setRushTags([]);
            setRushSelectedTag(null);
            return;
        }
        let cancelled = false;
        async function loadRushTags() {
            try {
                const tags = await getCategoryTags(rushCategory.id);
                if (!cancelled) {
                    setRushTags(tags || []);
                    setRushSelectedTag(null);
                }
            } catch (err) {
                console.error('Erreur chargement tags rush:', err);
            }
        }
        loadRushTags();
        return () => { cancelled = true; };
    }, [rushCategory]);

    // Load tags when custom category changes
    useEffect(() => {
        if (!customCategory || !customCategory?.id) {
            setCustomTags([]);
            setCustomSelectedTag(null);
            return;
        }
        let cancelled = false;
        async function loadCustomTags() {
            try {
                const tags = await getCategoryTags(customCategory.id);
                if (!cancelled) {
                    setCustomTags(tags || []);
                    setCustomSelectedTag(null);
                }
            } catch (err) {
                console.error('Erreur chargement tags custom:', err);
            }
        }
        loadCustomTags();
        return () => { cancelled = true; };
    }, [customCategory]);

    const [isStarting, setIsStarting] = useState(false);
    const [startError, setStartError] = useState(null);

    const handleStartRush = async () => {
        if (!rushCategory || !rushSelectedTag) return;
        setIsStarting(true);
        setStartError(null);
        try {
            const requestBody = {
                categoryId: rushCategory.id,
                themeId: rushThemeId,
                tag: rushSelectedTag,
                mode: 'rush'
            };
            const attempt = await startCustomQuiz(requestBody);
            navigate(`/play/attempt/${attempt.id}?mode=rush`);
        } catch (err) {
            setStartError(err.error || err.message || 'Erreur lors du démarrage du quiz');
        } finally {
            setIsStarting(false);
        }
    };

    const handleStartCustom = async () => {
        if (!customCategory) return;
        setIsStarting(true);
        setStartError(null);
        try {
            // Map difficulty string to numeric value (1, 2, 3)
            const difficultyMap = { easy: 1, medium: 2, hard: 3 };
            const requestBody = {
                categoryId: customCategory.id,
                themeId: customThemeId,
                count: customLength,
                difficulty: difficultyMap[customDifficulty] || 2,
                mode: 'classic'
            };
            if (customSelectedTag !== null) {
                requestBody.tag = customSelectedTag;
            }
            const attempt = await startCustomQuiz(requestBody);
            navigate(`/play/attempt/${attempt.id}?mode=classic`);
        } catch (err) {
            setStartError(err.error || err.message || 'Erreur lors du démarrage du quiz');
        } finally {
            setIsStarting(false);
        }
    };

    const handleStartCommunity = async () => {
        if (!communityQuiz) return;
        setIsStarting(true);
        setStartError(null);
        try {
            const requestBody = {
                quizId: communityQuiz.id
            };
            const attempt = await startCustomQuiz(requestBody);
            navigate(`/play/attempt/${attempt.id}?mode=custom`);
        } catch (err) {
            setStartError(err.error || err.message || 'Erreur lors du démarrage du quiz');
        } finally {
            setIsStarting(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    if (loading) {
        return (
            <MainContainer>
                <PageContainer>
                    <StyledDiv className="items-center gap-4 p-10">
                        <svg className="w-10 h-10 animate-spin text-amber-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4z" />
                        </svg>
                        <p className="font-bold text-xl text-amber-200 animate-pulse w-full text-center">Chargement...</p>
                    </StyledDiv>
                </PageContainer>
            </MainContainer>
        );
    }

    return (
        <MainContainer>
            <PageContainer>
                <div className="flex flex-col items-center gap-6 w-full min-h-0 max-h-full overflow-y-auto p-1">
                    <motion.h1
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="font-[Slackey] text-4xl md:text-5xl text-center bg-gradient-to-br from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent drop-shadow-[0px_0px_14px_rgba(234,179,8,0.45)]"
                    >
                        Mode Solo
                    </motion.h1>

                    {/* Tab selection */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="w-full"
                    >
                        <StyledDiv className="flex flex-col gap-5 p-6 w-full items-center justify-center">
                            {/* Tabs */}
                            <div className="flex items-center gap-2 w-full max-w-lg mb-6">
                                <StyledButton
                                    variant={activeTab === 'rush' ? 'primary' : 'secondary'}
                                    onClick={() => handleTabChange('rush')}
                                    className="flex-1"
                                >
                                    Rush
                                </StyledButton>
                                <StyledButton
                                    variant={activeTab === 'custom' ? 'primary' : 'secondary'}
                                    onClick={() => handleTabChange('custom')}
                                    className="flex-1"
                                >
                                    Custom
                                </StyledButton>
                                <StyledButton
                                    variant={activeTab === 'community' ? 'primary' : 'secondary'}
                                    onClick={() => handleTabChange('community')}
                                    className="flex-1"
                                >
                                    Communauté
                                </StyledButton>
                            </div>

                            {/* Rush Tab */}
                            {activeTab === 'rush' && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full flex flex-col items-center"
                                >
                                    <p className="text-muted text-center mb-4">Sélectionne une catégorie pour un quiz rapide</p>
                                    <QuizOfflineSelector
                                        mode="categories"
                                        categories={categories}
                                        themes={themes}
                                        selectedCategory={rushCategory}
                                        selectedThemeId={rushThemeId}
                                        onCategorySelect={setRushCategory}
                                        onThemeSelect={setRushThemeId}
                                    />
                                    {rushCategory && (
                                        <div className="flex flex-col gap-2 items-center w-full mt-4">
                                            <p className="text-sm font-semibold text-center">Tag</p>
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                <button
                                                    type="button"
                                                    className={tagChipClass(rushSelectedTag === null)}
                                                    onClick={() => setRushSelectedTag(null)}
                                                >
                                                    Tous
                                                </button>
                                                {rushTags.map((tag, index) => {
                                                    const tagId = tag.id || tag.slug || index;
                                                    const tagName = tag.name || tag.slug || `Tag ${index + 1}`;
                                                    return (
                                                        <button
                                                            type="button"
                                                            key={tagId}
                                                            className={tagChipClass(rushSelectedTag === tagId)}
                                                            onClick={() => setRushSelectedTag(tagId)}
                                                        >
                                                            {tagName}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    <StyledButton
                                        variant="primary"
                                        className="w-full max-w-md mt-4"
                                        onClick={handleStartRush}
                                        disabled={!rushCategory || !rushSelectedTag || isStarting}
                                    >
                                        {isStarting ? 'Démarrage...' : 'Commencer en mode Rush'}
                                    </StyledButton>
                                </motion.div>
                            )}

                            {/* Custom Tab */}
                            {activeTab === 'custom' && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full flex flex-col items-center"
                                >
                                    <p className="text-muted text-center mb-4">Personnalise ton quiz</p>
                                    <QuizOfflineSelector
                                        mode="categories"
                                        categories={categories}
                                        themes={themes}
                                        selectedCategory={customCategory}
                                        selectedThemeId={customThemeId}
                                        onCategorySelect={setCustomCategory}
                                        onThemeSelect={setCustomThemeId}
                                    />
                                    {customCategory && (
                                        <div className="flex flex-col gap-2 items-center w-full mt-4">
                                            <p className="text-sm font-semibold text-center">Tag</p>
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                <button
                                                    type="button"
                                                    className={tagChipClass(customSelectedTag === null)}
                                                    onClick={() => setCustomSelectedTag(null)}
                                                >
                                                    Tous
                                                </button>
                                                {customTags.map((tag, index) => {
                                                    const tagId = tag.id || tag.slug || index;
                                                    const tagName = tag.name || tag.slug || `Tag ${index + 1}`;
                                                    return (
                                                        <button
                                                            type="button"
                                                            key={tagId}
                                                            className={tagChipClass(customSelectedTag === tagId)}
                                                            onClick={() => setCustomSelectedTag(tagId)}
                                                        >
                                                            {tagName}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Difficulty and Length options */}
                                    <div className="flex flex-col gap-4 w-full max-w-md mt-4">
                                        <div className="flex flex-col gap-2">
                                            <p className="text-sm font-semibold text-center">Difficulté</p>
                                            <div className="flex gap-2">
                                                <StyledButton
                                                    variant={customDifficulty === 'easy' ? 'primary' : 'secondary'}
                                                    onClick={() => setCustomDifficulty('easy')}
                                                    className="flex-1"
                                                >
                                                    Facile
                                                </StyledButton>
                                                <StyledButton
                                                    variant={customDifficulty === 'medium' ? 'primary' : 'secondary'}
                                                    onClick={() => setCustomDifficulty('medium')}
                                                    className="flex-1"
                                                >
                                                    Moyenne
                                                </StyledButton>
                                                <StyledButton
                                                    variant={customDifficulty === 'hard' ? 'primary' : 'secondary'}
                                                    onClick={() => setCustomDifficulty('hard')}
                                                    className="flex-1"
                                                >
                                                    Difficile
                                                </StyledButton>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-sm font-semibold text-center">Nombre de questions</p>
                                            <LengthSelector value={customLength} onChange={setCustomLength} />
                                        </div>
                                    </div>
                                    
                                    <StyledButton
                                        variant="primary"
                                        className="w-full max-w-md mt-4"
                                        onClick={handleStartCustom}
                                        disabled={!customCategory || isStarting}
                                    >
                                        {isStarting ? 'Démarrage...' : 'Commencer en mode Custom'}
                                    </StyledButton>
                                </motion.div>
                            )}

                            {/* Community Tab */}
                            {activeTab === 'community' && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full flex flex-col items-center"
                                >
                                    <p className="text-muted text-center mb-4">Sélectionne un quiz de la communauté</p>
                                    <QuizOfflineSelector
                                        mode="quizs"
                                        categories={categories}
                                        themes={themes}
                                        quizs={quizs}
                                        quizsLoading={quizsLoading}
                                        selectedQuiz={communityQuiz}
                                        onQuizSelect={setCommunityQuiz}
                                    />
                                    <StyledButton
                                        variant="primary"
                                        className="w-full max-w-md mt-4"
                                        onClick={handleStartCommunity}
                                        disabled={!communityQuiz || isStarting}
                                    >
                                        {isStarting ? 'Démarrage...' : 'Commencer en mode Communauté'}
                                    </StyledButton>
                                </motion.div>
                            )}
                        </StyledDiv>
                        {startError && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full text-center mt-4"
                            >
                                <p className="font-bold text-red-400 bg-red-950/60 border-2 border-red-500 rounded-md p-2 shadow-[0px_0px_10px_2px_rgba(239,68,68,0.35)]">
                                    Erreur : {startError}
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </PageContainer>
        </MainContainer>
    );
}
