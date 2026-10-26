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
    primary: 'bg-blue-700 hover:bg-blue-500 text-white',
    secondary: 'bg-gray-700 hover:bg-gray-500 text-white',
    danger: 'bg-red-700 hover:bg-red-300 text-white',
    success: 'bg-green-700 hover:bg-green-300 text-white',
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={buttonClasses}
      {...props}
    >
      {isLoading ? props.loadingText || 'Loading...' : children}
    </button>
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
    quiz_selected: `bg-gradient-to-tl scale-90 text-amber-200`,
    menu: ` font-bold rounded-4xl text-2xl w-150 h-40 text-[#ffffff] border-3 border-black`
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