import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
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
  selected = false,
  type = 'button',
  ...props
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async e => {
    if (loading || disabled) return;

    setIsLoading(true);
    try {
      await onClick?.(e);
    } finally {
      setIsLoading(false);
    }
  };

  const baseClasses =
    'font-bold py-2 px-6 rounded-md disabled:opacity-50 transition-colors';

  const variantClasses = {
    primary: `text-blue-900 bg-gradient-to-br from-amber-400 via-amber-200 to-amber-500 
      shadow-[0px_0px_8px_2px_rgba(234,_179,_8,_0.5)] 
      hover:shadow-[0px_0px_18px_6px_rgba(234,_179,_8,_0.5)] border-2 border-amber-300` ,
    selected: `border-2 text-blue-900 bg-gradient-to-tl from-amber-800 via-amber-500 to-amber-700 text-white
      shadow-[0px_0px_2px_1px_rgba(234,_179,_8,_0.5)] scale-95` ,
    secondary: 'bg-gray-700 hover:bg-gray-500 text-white',
    danger: 'bg-red-700 hover:bg-red-300 text-white',
    success: 'bg-green-700 hover:bg-green-300 text-white',
    bling: 'h-10 rounded-md min-w-0 max-w-60 flex flex-row items-center justify-center text-white hover:bg-gradient-to-bl bg-gradient-to-br from-blue-900 via-blue-950 to-blue-800 shadow-[0px_0px_10px_2px_rgba(234,_179,_8,_0.5)] hover:shadow-[0px_0px_18px_6px_rgba(234,_179,_8,_0.5)] ',
    blingselected: 'h-10 rounded-md min-w-0 max-w-60 flex flex-row items-center justify-center text-white hover:bg-gradient-to-bl bg-gradient-to-br from-blue-900 via-blue-950 to-blue-800 shadow-[0px_0px_10px_2px_rgba(234,_179,_8,_0.5)] hover:shadow-[0px_0px_18px_6px_rgba(234,_179,_8,_0.5)] ',
    outerbling: `p-0.75 bg-gradient-to-br from-amber-400 via-amber-200 to-amber-500 rounded-md`,
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  const buttonElement = (    
  <button
      type={type}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={buttonClasses}
      {...props}
      >
      {isLoading ? props.loadingText || 'Loading...' : children}
  </button> );

return variant === 'bling' ? (
  <div className={variantClasses['outerbling']}>{buttonElement}</div>
) : (
  buttonElement
);
}

//Square tile button
export function TileButton({
  onClick,
  children,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  selected = false,
  ...props
  }) {
  
  
  const [isLoading, setIsLoading] = useState(false);
  const [randomGradient, setRandomGradient] = useState('');

  const handleClick = async e => {
    if (loading || disabled) return;

    setIsLoading(true);
    try {
      await onClick?.(e);
    } finally {
      setIsLoading(false);
    }
  };

 useEffect(() => {
  // Random gradients (cant build them at runtime because react sux)
  const gradientClasses = [
    'bg-gradient-to-br from-red-300 to-red-700',
    'bg-gradient-to-br from-blue-300 to-blue-700',
    'bg-gradient-to-br from-green-300 to-green-700',
    'bg-gradient-to-br from-amber-300 to-amber-700',
    'bg-gradient-to-br from-purple-300 to-purple-700',
    'bg-gradient-to-br from-pink-300 to-pink-700',
    'bg-gradient-to-br from-lime-300 to-lime-700',
    'bg-gradient-to-br from-sky-300 to-sky-700',
    'bg-gradient-to-br from-emerald-300 to-emerald-700',
    'bg-gradient-to-br from-orange-300 to-orange-700',
  ];

  const randomIndex = Math.floor(Math.random() * gradientClasses.length);
  setRandomGradient(gradientClasses[randomIndex]);
}, []);

  const baseClasses = 'flex justify-center items-center';
  const shadow = 'shadow-[6px_6px_3px_0px_rgba(0,_0,_0,_0.5)]';
  const shadowSelected = 'shadow-inner'

  // Define variant classes with pressed-down effect for selected state
  const variantClasses = {
    quiz: `${randomGradient} font-bold rounded-4xl text-2xl w-50 h-50 text-[#ffffff] border-3 border-black`,
    quiz_selected: `bg-gradient-to-tl scale-100 text-amber-200`,
    menu: ` font-bold rounded-4xl text-2xl w-160 h-40 text-[#ffffff] border-3 border-black`
  }

  // Apply selected effect when button is selected
  let buttonClasses = `${baseClasses} ${variantClasses.quiz} ${selected ? variantClasses.quiz_selected : ''} 
    ${selected ? shadowSelected: shadow} ${className}`;

  switch (variant) {
    case "menu":
      buttonClasses = `${baseClasses} ${variantClasses.menu} ${selected ? variantClasses.quiz_selected : ''} 
    ${selected ? undefined: shadow} ${className}`;
  }

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled || isLoading}
      selected={selected}
      className={`${buttonClasses} `}
      whileHover={!selected ? {scale:1.1} : {scale:1.0}}
      layout
      {...props}
    >
      {isLoading ? props.loadingText || 'Chargement...' : children}
    </motion.button>
  );
}

export function AnswerButton({
  text,
  id,
  onClick,
  disabled,
  isSelected,
  isCorrectAnswer,
  isWrongSelection
}){
  return(
    <p></p>
  );
}