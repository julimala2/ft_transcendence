export function StyledInput({
    id,
    type,
    value,
    onChange,
    label,
    placeholder,
    ...props
}) {
    return(
        <div className="gap-2 flex items-center h-full justify-end">
            <div className="w-full flex flex-col gap-2">

            {label ? (
                <p className="text-xl font-bold ">{label}</p>
            ) : ( undefined )}
            <input
             id={id}
             type={type}
             value={value}
             onChange={onChange}
             placeholder={placeholder}
             required
             className="bg-gray-800 p-2 rounded-2xl border-2 border-gray-200"
             >

            </input>
        </div>
        </div>

    );
}