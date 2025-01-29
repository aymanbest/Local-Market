import React from 'react';
const Preloader = () => {

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center transition-colors duration-300">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="h-1 bg-cardBg rounded-full overflow-hidden transition-colors duration-300">
          <div className={`h-full w-full animate-loading-bar bg-gradient-to-r from-primary via-primary/80 to-primary`}></div>
        </div>
      </div>
    </div>
  );
};

export default Preloader; 