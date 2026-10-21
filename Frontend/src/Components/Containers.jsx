//Component file for all the little containers !

export const MainContainer = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-4xl p-4">
        {children}
      </div>
    </div>
  );
};
