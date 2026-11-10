const OPTIONS = [
  { value: 0, label: 'Aléatoire' },
  { value: 1, label: 'Facile', mojis: '⭐' },
  { value: 2, label: 'Moyenne', mojis: '⭐⭐' },
  { value: 3, label: 'Difficile', mojis: '⭐⭐⭐' },
];

const chipClass = selected =>
  `flex items-center gap-2 px-4 py-2 rounded-2xl border-2 cursor-pointer select-none transition-colors ${
    selected
      ? 'bg-amber-400 text-black border-amber-300 font-bold'
      : 'bg-gray-800 border-gray-200'
  }`;

export function DifficultySelector({ value, onChange }) {
  return (
    <div className="flex flex-row flex-wrap gap-3 justify-center max-w-full">
      {OPTIONS.map(o => (
        <label key={o.value} className={chipClass(value === o.value)}>
          <input
            className="sr-only"
            type="radio"
            name="difficulty"
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
          />
          <span>{o.label}</span>
          {o.mojis && <span aria-hidden="true">{o.mojis}</span>}
        </label>
      ))}
    </div>
  );
}