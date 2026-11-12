//Component file for all the little containers !

//Container that contains an entire page
export const MainContainer = ({ children }) => (
  <div className="h-full overflow-hidden flex flex-col">
    {children}
  </div>
);

//Page container
export const PageContainer = ({ children }) => (
  <div className="flex-1 min-h-0 overflow-hidden flex flex-col items-center justify-center gap-4 p-4 md:px-20 md:pb-20 md:pt-[min(10rem,10dvh)]">
    {children}
  </div>
);

//Container for vertical lists
export const ListContainer = ({ children }) => {
  return <ul className="flex flex-col p-2 w-full items-center gap-2 overflow-y-auto min-h-0">{children}</ul>;
};

//Container for list entries, stuff like that (flex horizontal full width)
export const CardContainer = ({ children }) => {
  return (
    <div className="flex p-2 w-full items-center bg-blue-950 border-gray-500 rounded-md justify-between">
      {children}
    </div>
  );
};

//General container background for items
export const BlockContainer = ({ children }) => {
  return (
    <div className="bg-blue-950 w-full p-6 rounded-md align-middle">
      {children}
    </div>
  );
};

export function StyledDiv({
  children,
  variant = 'primary',
  className = '',
  outerClassName = '',
  ...props
}) {

  const variantClasses = {
    primary: 'bg-gradient-to-br from-amber-400 via-amber-200 to-amber-500 shadow-[0px_0px_10px_2px_rgba(234,_179,_8,_0.5)] ',
    selected: 'bg-gradient-to-tl from-amber-400 via-amber-200 to-amber-500 shadow-[0px_0px_17px_4px_rgba(234,_179,_8,_0.5)] ',
  };

  return(
    <div className={`p-1 rounded-sm ${variantClasses[variant]} ${outerClassName}`}>
      <div className={`flex flex-col justify-center inset-shadow-3xl inset-shadow-black bg-gradient-to-br from-slate-800 to-slate-950 h-full w-full p-2 rounded-sm ${className}`}
        {...props}
      >
       {children}
      </div>
    </div>
  )
}
