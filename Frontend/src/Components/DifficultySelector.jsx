const OPTIONS = [
  { value: 0, label: 'Aléatoire', color:'bg-gradient-to-br from-amber-300 to-amber-700' },
  { value: 1, label: 'Facile', mojis:'⭐', color:'bg-gradient-to-br from-green-300 to-green-700' },
  { value: 2, label: 'Moyenne',mojis:'⭐⭐', color:'bg-gradient-to-br from-blue-300 to-blue-700' },
  { value: 3, label: 'Difficile',mojis:'⭐⭐⭐', color:    'bg-gradient-to-br from-red-300 to-red-700' },
];


export function DifficultySelector({value,onChange}){
    return (
        <div className="flex flex-row gap-5 justify-center">
            {OPTIONS.map (o => (
                <label key={o.value} className={`${o.color} p-3 w-60 rounded-full border-2 shadow-[6px_6px_3px_0px_rgba(0,_0,_0,_0.5)] border-black justify-between text-xl flex flex-row `}>
                    <input 
                        className="w-5"
                        type="radio"
                        name="difficulty"
                        value={o.value}
                        checked={value === o.value}
                        onChange={() => onChange(o.value)}
                        />
                    <label className="pointer-events-none">{o.label}</label>
                    <label className="pointer-events-none">{o.mojis}</label>
                </label>
            ))}
        </div>
    );
}