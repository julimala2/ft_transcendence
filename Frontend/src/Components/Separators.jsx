export function StyledSeparator(
    className,
    variant = 'primary',
){

    const variantClasses ={
            primary: `bg-gradient-to-br w-full h-1 rounded-full
                from-amber-400 via-amber-200 to-amber-500
                shadow-[0px_0px_10px_2px_rgba(234,_179,_8,_0.5)] 
                `,
            };
    return (
        <div className="w-full h-5 flex flex-col justify-center pl-10 pr-10">
        <div className={variantClasses[variant]}/>
        </div>
    )
}