import React, { useEffect, useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './PreloaderStyles.css';

const Preloader = () => {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const location = useLocation();
  const authStatus = useSelector(state => state.auth.status);

  // Reset states when route changes or auth status is loading
  useEffect(() => {
    if (authStatus === 'loading') {
      setIsVisible(true);
      setIsFading(false);
    }
  }, [location.pathname, authStatus]);

  // Ensure the preloader has a minimum display time and smooth fade-out
  useEffect(() => {
    if (!isVisible) return; // Skip if already hidden
    
    // Don't start fade-out if we're in the middle of authentication
    if (authStatus === 'loading') return;
    
    // The preloader will always be visible for at least 1 second
    const minDisplayTimer = setTimeout(() => {
      // After minimum display time, start fade-out
      setIsFading(true);
      
      // After fade-out animation completes, remove from DOM
      const fadeOutTimer = setTimeout(() => {
        setIsVisible(false);
      }, 500); // Match this with the CSS transition duration
      
      return () => clearTimeout(fadeOutTimer);
    }, 1000);

    return () => clearTimeout(minDisplayTimer);
  }, [isVisible, authStatus]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${isFading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500 ${isDark ? 'bg-mainBlack' : 'bg-white'}`}>
      <svg className="truck w-48 h-auto text-primary" viewBox="0 0 48 24" width="48px" height="24px">
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" transform="translate(0,2)">
          <g className="truck__body">
            <g strokeDasharray="105 105">
              <polyline className="truck__outside1" points="2 17,1 17,1 11,5 9,7 1,39 1,39 6" />
              <polyline className="truck__outside2" points="39 12,39 17,31.5 17" />
              <polyline className="truck__outside3" points="22.5 17,11 17" />
              <polyline className="truck__window1" points="6.5 4,8 4,8 9,5 9" />
              <polygon className="truck__window2" points="10 4,10 9,14 9,14 4" />
            </g>
            <polyline className="truck__line" points="43 8,31 8" strokeDasharray="10 2 10 2 10 2 10 2 10 2 10 26" />
            <polyline className="truck__line" points="47 10,31 10" strokeDasharray="14 2 14 2 14 2 14 2 14 18" />
          </g>
          <g strokeDasharray="15.71 15.71">
            <g className="truck__wheel">
              <circle className="truck__wheel-spin" r="2.5" cx="6.5" cy="17" />
            </g>
            <g className="truck__wheel">
              <circle className="truck__wheel-spin" r="2.5" cx="27" cy="17" />
            </g>
          </g>
        </g>
      </svg>
      
      <div className="mt-8 text-center">
        <p className="text-lg font-medium text-primary animate-pulse" style={{ animationDuration: '2s' }}>
          Loading Marketplace
        </p>
      </div>
    </div>
  );
};

export default Preloader; 