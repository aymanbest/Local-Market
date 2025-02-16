import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, ShoppingBasket } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const NotFound = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start pt-20 relative bg-background overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div 
          className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full" 
          style={{
            background: `radial-gradient(circle, ${isDark ? 'rgba(169, 196, 108, 0.05)' : 'rgba(93, 135, 54, 0.05)'} 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] px-4">
        <div className="flex flex-col items-center text-center mb-8">
          {/* 404 Typography with mode-specific styling */}
          <div className="relative">
            {/* Background glow */}
            <div 
              className="absolute inset-0 blur-3xl opacity-30"
              style={{
                background: `radial-gradient(circle at center, ${isDark ? 'rgba(169, 196, 108, 0.2)' : 'rgba(93, 135, 54, 0.2)'} 0%, transparent 70%)`
              }}
            />
            
            {/* Main 404 text */}
            <div 
              className="text-[12rem] leading-none font-black select-none relative"
              style={{
                color: isDark ? 'rgba(169, 196, 108, 0.1)' : 'rgba(93, 135, 54, 0.1)',
                WebkitTextStroke: isDark 
                  ? '2px rgba(255, 255, 255, 0.15)' 
                  : '2px rgba(0, 0, 0, 0.1)',
                textShadow: isDark
                  ? `
                    -1px -1px 0 rgba(255, 255, 255, 0.2),
                    1px -1px 0 rgba(255, 255, 255, 0.2),
                    -1px 1px 0 rgba(255, 255, 255, 0.2),
                    1px 1px 0 rgba(255, 255, 255, 0.2),
                    0 0 20px rgba(169, 196, 108, 0.5),
                    0 0 40px rgba(169, 196, 108, 0.3),
                    0 0 80px rgba(169, 196, 108, 0.1)
                  `
                  : `
                    -1px -1px 0 rgba(0, 0, 0, 0.1),
                    1px -1px 0 rgba(0, 0, 0, 0.1),
                    -1px 1px 0 rgba(0, 0, 0, 0.1),
                    1px 1px 0 rgba(0, 0, 0, 0.1),
                    0 0 20px rgba(93, 135, 54, 0.3),
                    0 0 40px rgba(93, 135, 54, 0.2),
                    0 0 80px rgba(93, 135, 54, 0.1)
                  `
              }}
            >
              404
            </div>
          </div>

          {/* Message with mode-specific contrast */}
          <div className="mt-8 space-y-4 max-w-2xl relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-text drop-shadow-lg">
              Your Cart Seems Empty!
            </h1>
            <p className="text-text md:text-xl text-textSecondary/90 max-w-xl mx-auto drop-shadow">
              We couldn't find the page you're looking for. It might have been moved or doesn't exist.
            </p>
          </div>
        </div>

        {/* Interactive Elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
          {/* Go Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className={`
              group flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl
              transition-all duration-300
              ${isDark 
                ? 'bg-[#1a1a1a] border-2 border-white/10 text-white hover:bg-white/5' 
                : 'bg-white border-2 border-black/10 text-gray-800 hover:bg-gray-50'
              }
              hover:scale-105 hover:shadow-lg
            `}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Go Back</span>
          </button>

          {/* Homepage Button */}
          <button 
            onClick={() => navigate('/')}
            className={`
              group relative flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl
              transition-all duration-300
              ${isDark 
                ? 'bg-[#2a2a2a] text-white hover:bg-[#333333]' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }
              hover:scale-105 hover:shadow-lg
            `}
          >
            <Home className="w-5 h-5 transition-all duration-300 group-hover:scale-110" />
            <span className="font-medium">Homepage</span>
          </button>
        </div>


        {/* Support message with mode-specific colors */}
        <div className="mt-8 mb-12 text-center text-textSecondary">
          <p>Need help? Contact our support team at{' '}
            <span className={`font-medium transition-colors cursor-pointer ${
              isDark 
                ? 'text-primary hover:text-primary/80' 
                : 'text-primary hover:text-primaryHover'
            }`}>
              support@localmarket.com
            </span>
          </p>
        </div>
      </div>

      {/* Mode-specific gradient overlay */}
      <div className={`fixed bottom-0 left-0 w-full h-20 pointer-events-none bg-gradient-to-t ${isDark ? 'from-background' : 'from-background'} to-transparent`} />
    </div>
  );
};

export default NotFound; 