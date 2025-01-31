import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Preloader = () => {
  const { isDark } = useTheme()

  return (
    <div 
      className={`fixed inset-0 ${
        isDark ? 'bg-mainBlack' : 'bg-white'
      } z-50 flex flex-col items-center justify-center transition-colors duration-300`}
    >
        {/* <div className="mb-8 animate-fade-in">
          <h1 className={`text-4xl font-recoleta ${
            isDark 
              ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' 
              : 'text-mainBlack drop-shadow-[0_0_5px_rgba(0,0,0,0.3)]'
          } text-center`}>
            Local Market
          </h1>
          <p className={`${
            isDark ? 'text-gray-300' : 'text-gray-600'
          } text-center mt-2`}>
            {[
              "Connecting producers and community",
              "Fresh local goods at your fingertips",
              "Supporting local businesses",
              "Your neighborhood marketplace",
              "From farm to table",
              "Connecting local producers with their community",  
              "Discover local flavors, support local farmers",
              "Shop local, support local",
              "Supporting local farmers, one product at a time",
            ][Math.floor(Math.random() * 9)]}
          </p>
        </div> */}
      <div className="w-32 h-32 relative">
        <div className={`absolute inset-0 rounded-full border-t-2 border-primary animate-spin`}></div>
        <div className={`absolute inset-2 rounded-full border-r-2 border-primary animate-spin-reverse`}></div>
        <div className={`absolute inset-4 rounded-full border-b-2 border-primary animate-spin`}></div>
        <div className={`absolute inset-6 rounded-full border-l-2 border-primary animate-spin-reverse`}></div>
      </div>
    </div>
  );
};

export default Preloader; 