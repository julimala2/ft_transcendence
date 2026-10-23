import { useState } from "react";
//Component file for storing all the little buttons !

//Basic button used for almost everything
//Onclick,variant,disabled,loading,props
export function StyledButton({
    onClick,
    children,
    variant = 'primary',
    disabled = false,
    loading = false,
    className = '',
    type = 'button',
    ... props
}) {
    const [isLoading,setIsLoading] = useState(false);

    const handleClick = async (e) => {
        if (loading || disabled) return;

        setIsLoading(true);
        try {
            await onClick?.(e);
        } finally {
            setIsLoading(false);
        }
    };

    const baseClasses = "font-bold py-2 px-6 rounded-md disabled:opacity-50 transition-colors";

    const variantClasses = {
        primary: "bg-blue-500 hover:bg-blue-700 text-white",
        secondary: "bg-gray-500 hover:bg-gray-700 text-white",
        danger: "bg-red-500 hover:bg-red-700 text-white",
        success: "bg-green-500 hover:bg-green-700 text-white",
    }

    const buttonClasses = `${baseClasses} ${variantClasses[variant]} $(className}`;

    return (
        <button
            type={type}
            onClick={handleClick}
            disabled={disabled||isLoading}
            className={buttonClasses}
            {...props}>

                {isLoading ? (props.loadingText || 'Loading...') : children}
            </button>
    );
}