export function StyledInput({
    id,
    type,
    value,
    onChange,
    label,
    className,
    placeholder,
    ...props
}) {
    return(
        <div className="gap-2 flex items-center justify-end min-w-0 w-full">
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
             className={`bg-gray-800 p-2 rounded-2xl border-2 border-gray-200 ${className}`}
             >

            </input>
        </div>
        </div>

    );
}