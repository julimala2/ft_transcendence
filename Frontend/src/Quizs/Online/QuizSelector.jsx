import { motion } from 'motion/react';
import { StyledButton, BlingButton } from '../../Components/Buttons';
import { StyledDiv } from '../../Components/Containers';

/**
 * QuizSelector - Component for selecting quiz mode (categories or community quizs)
 * 
 * Props:
 * - categories: Array of category objects
 * - themes: Array of theme objects
 * - quizs: Optional array of quiz objects (for community mode)
 * - quizsLoading: Boolean indicating if quizs are loading
 * - mode: Current mode ('categories' or 'quizs')
 * - selectedCategory: Currently selected category object
 * - selectedThemeId: Currently selected theme ID
 * - selectedQuiz: Currently selected quiz object
 * - disabled: Boolean to disable interactions
 * - onModeChange: Callback when mode changes
 * - onCategorySelect: Callback when category is selected
 * - onThemeSelect: Callback when theme is selected
 * - onQuizSelect: Callback when quiz is selected
 */
export function QuizSelector({
    categories = [],
    themes = [],
    quizs = [],
    quizsLoading = false,
    mode = 'categories',
    selectedCategory = null,
    selectedThemeId = null,
    selectedQuiz = null,
    disabled = false,
    onModeChange = () => {},
    onCategorySelect = () => {},
    onThemeSelect = () => {},
    onQuizSelect = () => {},
}) {
    const showCommunityMode = quizs && quizs.length > 0;
    
    // Filter themes with categories
    const displayableThemes = (themes || []).filter(
        theme => !Array.isArray(theme.categories) || theme.categories.length > 0
    );
    
    const selectedTheme = displayableThemes.find(theme => theme.id === selectedThemeId) || null;
    
    // Get categories in selected theme (or all if no theme selected)
    const themeCategories = selectedTheme && Array.isArray(selectedTheme.categories)
        ? categories.filter(cat => selectedTheme.categories.some(c => c.id === cat.id))
        : categories;
    
    // Get categories NOT in selected theme (empty if no theme selected)
    const otherCategories = selectedTheme
        ? categories.filter(cat => !themeCategories.some(c => c.id === cat.id))
        : [];
    
    // All categories: theme categories first, then others
    const sortedCategories = [...themeCategories, ...otherCategories];

    return (
        <div className="w-full flex-col items-center flex gap-3 overflow-y-scroll">
            {/* Mode selection buttons - only show if community mode is available */}
            {showCommunityMode && (
                <div className="flex items-center flex-row gap-2 w-full">
                    <StyledButton
                        variant={mode === 'categories' ? 'primary' : 'secondary'}
                        onClick={() => {
                            onModeChange('categories');
                            onQuizSelect(null);
                            onCategorySelect(null);
                            onThemeSelect(null);
                        }}
                        disabled={disabled}
                        className="flex-1"
                    >
                        Catégories
                    </StyledButton>
                    <StyledButton
                        variant={mode === 'quizs' ? 'primary' : 'secondary'}
                        onClick={() => {
                            onModeChange('quizs');
                            onCategorySelect(null);
                            onThemeSelect(null);
                            onQuizSelect(null);
                        }}
                        disabled={disabled}
                        className="flex-1"
                    >
                        Communauté
                    </StyledButton>
                </div>
            )}

            {/* Categories mode */}
            {mode === 'categories' && (
                <>
                    <div className="flex items-center justify-center gap-3">
                        <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <p className="font-bold text-xl bg-gradient-to-br from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
                            {showCommunityMode ? 'Choisis une catégorie' : 'Choisis une catégorie pour le quiz'}
                        </p>
                    </div>
                    {/* Theme selector */}
                    {onThemeSelect && displayableThemes.length > 0 && (
                        <div className="flex flex-wrap gap-4 justify-center">
                            <BlingButton
                                onClick={() => onThemeSelect(null)}
                                selected={selectedThemeId === null}
                                disabled={disabled}
                            >
                                Tous
                            </BlingButton>
                            {displayableThemes.map(theme => (
                                <BlingButton
                                    key={theme.id}
                                    onClick={() => onThemeSelect(theme.id)}
                                    selected={selectedThemeId === theme.id}
                                    disabled={disabled}
                                >
                                    {theme.name}
                                </BlingButton>
                            ))}
                        </div>
                    )}
                    
                    {/* Categories grid - all shown, theme ones first, others disabled */}
                    <div className="flex gap-4 flex-wrap justify-center w-full">
                        {sortedCategories.map(cat => {
                            const isInTheme = selectedThemeId ? themeCategories.some(c => c.id === cat.id) : true;
                            const isDisabled = disabled || !isInTheme;
                            
                            return (
                                <BlingButton
                                    key={cat.id}
                                    variant="quiz"
                                    className="w-32 md:w-40"
                                    innerClassName="h-20 md:h-40"
                                    onClick={() => !isDisabled && onCategorySelect(cat)}
                                    selected={selectedCategory?.id === cat.id}
                                    disabled={isDisabled}
                                >
                                    {cat.name}
                                </BlingButton>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Community quizs mode */}
            {mode === 'quizs' && showCommunityMode && (
                <>
                    <div className="flex items-center justify-center gap-3">
                        <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <p className="font-bold text-xl bg-gradient-to-br from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
                            Choisis un quiz public
                        </p>
                    </div>
                    {quizsLoading ? (
                        <p className="text-muted text-center">Chargement des quizs...</p>
                    ) : (
                        <ul className="flex flex-col gap-3 w-full max-h-64 overflow-y-auto">
                            {quizs
                                .filter(quiz => quiz.visibility === "public" && (quiz._count?.questions ?? 0) > 0)
                                .map(quiz => (
                                    <li
                                        key={quiz.id}
                                        className={`flex items-center justify-between gap-3 bg-gray-800 rounded-2xl p-4 cursor-pointer ${selectedQuiz?.id === quiz.id ? 'border-2 border-amber-400' : ''}`}
                                        onClick={() => !disabled && onQuizSelect(quiz)}
                                    >
                                        <div className="flex flex-col gap-1 min-w-0">
                                            <p className="font-bold truncate">{quiz.title}</p>
                                            <p className="text-sm text-muted">
                                                par {quiz.owner?.username || 'inconnu'} · {quiz._count?.questions ?? 0} question(s) · {quiz.visibility}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}
