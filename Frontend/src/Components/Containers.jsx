//Component file for all the little containers !

//Container that contains an entire page
export const MainContainer = ({ children }) => {
  return (
    <div className="h-screen min-h-full w-full">
      {children}
    </div>
  );
};

//Page container
export const PageContainer = ({ children }) => {
  return (
    <div className=" flex-col flex items-center justify-center align-items-center p-4 rounded-md gap-4 pt-50 w-full pl-20 pr-20 pb-20">
      {children}
    </div>
  );
};

//Container for vertical lists
export const ListContainer = ({ children }) => {
  return <ul className="flex flex-col p-2 w-full items-center gap-2">{children}</ul>;
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
    primary: 'bg-gradient-to-br from-amber-400 via-amber-200 to-amber-500 shadow-[0px_0px_17px_4px_rgba(234,_179,_8,_0.5)] ',
  };

  return(
    <div className={`p-1 rounded-lg ${variantClasses[variant]} ${outerClassName}`}>
      <div className={`flex flex-col justify-center inset-shadow-3xl inset-shadow-black bg-gradient-to-br from-slate-800 to-slate-950 h-full w-full p-2 rounded-lg ${className}`}
        {...props}
      >
       {children}
      </div>
    </div>
  )
}