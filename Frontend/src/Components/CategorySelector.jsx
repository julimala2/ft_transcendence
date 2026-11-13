import { BlingButton } from './Buttons.jsx';

export function CategorySelector({
  categories,
  selectedId,
  onSelect,
  themes = null,
  selectedThemeId = null,
  onSelectTheme = null,
  disabled = false,
}) {
  // Un thème avec un tableau de catégories vide n'est pas affiché (cf. prisma/themes.json).
  // Si l'API ne renvoie pas le champ categories, on affiche le thème sans filtrer.
  const displayableThemes = (themes || []).filter(
    theme => !Array.isArray(theme.categories) || theme.categories.length > 0
  );

  const selectedTheme =
    displayableThemes.find(theme => theme.id === selectedThemeId) || null;

  const visibleCategories =
    selectedTheme && Array.isArray(selectedTheme.categories)
      ? categories.filter(cat =>
          selectedTheme.categories.some(c => c.id === cat.id)
        )
      : categories;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {onSelectTheme && displayableThemes.length > 0 && (
        <div className="flex flex-wrap gap-4 justify-center">
          <BlingButton
            onClick={() => onSelectTheme(null)}
            selected={selectedThemeId === null}
            disabled={disabled}
          >
            Tous
          </BlingButton>
          {displayableThemes.map(theme => (
            <BlingButton
              key={theme.id}
              onClick={() => onSelectTheme(theme.id)}
              selected={selectedThemeId === theme.id}
              disabled={disabled}
            >
              {theme.name}
            </BlingButton>
          ))}
        </div>
      )}

      <div className="flex gap-7 flex-wrap justify-center">
        {visibleCategories.map(cat => (
          <BlingButton
            key={cat.id}
            variant="quiz"
            className="w-40"
            innerClassName="h-40"
            onClick={() => onSelect(cat)}
            selected={selectedId === cat.id}
            disabled={disabled}
          >
            {cat.name}
          </BlingButton>
        ))}
      </div>
    </div>
  );
}
