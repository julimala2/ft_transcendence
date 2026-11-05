import { StyledButton } from "../../Components/Buttons";
import { useState, useEffect } from "react";

const OPTIONS = [
  { value: 5, label: 'Court' , mojis : '⏱️'},
  { value: 10, label: 'Moyen' ,mojis : '⏱️⏱️'},
  { value: 20, label: 'Long', mojis : '⏱️⏱️⏱️' },
];

export function LengthSelector({value,onChange}) {
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
                    <label className="pointer-events-none"></label>
                </label>
            ))}
        </div>
    );
}