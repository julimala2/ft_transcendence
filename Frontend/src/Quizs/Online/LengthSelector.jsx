import { StyledButton } from "../../Components/Buttons";

const OPTIONS = [
  { value: 5, label: 'Court' , mojis : '⏱️'},
  { value: 10, label: 'Moyen' ,mojis : '⏱️⏱️'},
  { value: 20, label: 'Long', mojis : '⏱️⏱️⏱️' },
];

export function LengthSelector({value,onChange}) {
    return (
        <div className="flex flex-row flex-wrap justify-around w-full gap-5">
            {OPTIONS.map (o => (
                <StyledButton key={o.value} variant={value === o.value ? "selected":"primary"} onClick={()=> onChange(o.value)}>
                    <label className="pointer-events-none">{o.label}</label>
                </StyledButton>
            ))}
        </div>
    );
}