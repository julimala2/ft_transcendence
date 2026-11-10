const OPTIONS = [
  { value: 5, label: 'Court', mojis: '⏱️' },
  { value: 10, label: 'Moyen', mojis: '⏱️⏱️' },
  { value: 20, label: 'Long', mojis: '⏱️⏱️⏱️' },
];

const chipClass = selected =>
  `flex items-center gap-2 px-4 py-2 rounded-2xl border-2 cursor-pointer select-none transition-colors ${
    selected
      ? 'bg-amber-400 text-black border-amber-300 font-bold'
      : 'bg-gray-800 border-gray-200'
  }`;

export function TimeSelector({ value, onChange }) {
  return (
    <div className="flex flex-row flex-wrap gap-3 justify-center max-w-full">
      {OPTIONS.map(o => (
        <label key={o.value} className={chipClass(value === o.value)}>
          <input
            className="sr-only"
            type="radio"
            name="time"
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
          />
          <span>{o.label}</span>
          <span aria-hidden="true">{o.mojis}</span>
        </label>
      ))}
    </div>
  );
}