import { BlingButton } from '../../Components/Buttons';

/**
 * QuizOfflineSelector - Component for selecting categories or community quizs in offline mode
 * Used by OfflineMenu for Rush, Custom, and Communauté modes
 * 
 * Props:
 * - mode: 'categories' | 'quizs' - What to display
 * - categories: Array of category objects (required for mode='categories')
 * - themes: Array of theme objects (required for mode='categories')
 * - quizs: Array of quiz objects (required for mode='quizs')
 * - quizsLoading: Boolean indicating if quizs are loading (for mode='quizs')
 * - selectedCategory: Currently selected category object
 * - selectedThemeId: Currently selected theme ID
 * - selectedQuiz: Currently selected quiz object (for mode='quizs')
 * - disabled: Boolean to disable interactions
 * - onCategorySelect: Callback when category is selected
 * - onThemeSelect: Callback when theme is selected
 * - onQuizSelect: Callback when quiz is selected (for mode='quizs')
 */
export function QuizOfflineSelector({
    mode = 'categories',
    categories = [],
    themes = [],
    quizs = [],
    quizsLoading = false,
    selectedCategory = null,
    selectedThemeId = null,
    selectedQuiz = null,
    disabled = false,
    onCategorySelect = () => {},
    onThemeSelect = () => {},
    onQuizSelect = () => {},
}) {
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
        <div className="w-full">
            {/* Categories mode */}
            {mode === 'categories' && (
                <>
                    {/* Theme selector */}
                    {onThemeSelect && displayableThemes.length > 0 && (
                        <div className="flex flex-wrap gap-4 justify-center mb-6">
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
                    <div className="flex gap-7 flex-wrap justify-center w-full">
                        {sortedCategories.map(cat => {
                            const isInTheme = selectedThemeId ? themeCategories.some(c => c.id === cat.id) : true;
                            const isDisabled = disabled || !isInTheme;
                            
                            return (
                                <BlingButton
                                    key={cat.id}
                                    variant="quiz"
                                    className="w-40"
                                    innerClassName="h-40"
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

            {/* Quizs mode (Community) */}
            {mode === 'quizs' && (
                <>
                    {quizsLoading ? (
                        <p className="text-muted text-center">Chargement des quizs...</p>
                    ) : quizs.length === 0 ? (
                        <p className="text-muted text-center">Aucun quiz public disponible</p>
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
                                                par {quiz.owner?.username || 'inconnu'} · {quiz._count?.questions ?? 0} question(s)
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
