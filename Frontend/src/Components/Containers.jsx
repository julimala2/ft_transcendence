//Component file for all the little containers !

//Container that contains an entire page
export const MainContainer = ({ children }) => {
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      {children}
    </div>
  );
};

//Page container
export const PageContainer = ({ children }) => {
  return (
    <div className="flex-col flex items-center w-2/3 p-4 rounded-md gap-4 mt-64 mb-32">
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
