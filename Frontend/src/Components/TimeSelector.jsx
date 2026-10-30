const OPTIONS = [
  { value: 5, label: 'Court' , mojis : '⏱️'},
  { value: 10, label: 'Moyen' ,mojis : '⏱️⏱️'},
  { value: 20, label: 'Long', mojis : '⏱️⏱️⏱️' },
];


export function TimeSelector({value,onChange}){
    return (
        <div className="flex flex-row gap-5 justify-center">
            {OPTIONS.map (o => (
                <label key={o.value} className="w-60 rounded-full border-2 justify-between text-xl flex flex-row bg-linear-0 from-purple-700 to-purple-500 p-3 pr-5">
                    <input 
                        className="w-5"
                        type="radio"
                        name="time"
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