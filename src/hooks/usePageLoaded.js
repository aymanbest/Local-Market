import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to track when the page is fully loaded
 * @param {number} minDisplayTime - Minimum time in ms to consider the page "loading"
 * @returns {boolean} - Whether the page is fully loaded
 */
const usePageLoaded = (minDisplayTime = 1000) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Reset loading state on route change
    setIsLoaded(false);
    
    let timer;
    
    const handleFullyLoaded = () => {
      // Set a minimum display time for the loading state
      timer = setTimeout(() => {
        setIsLoaded(true);
      }, minDisplayTime);
    };

    // Check if document is already loaded
    if (document.readyState === 'complete') {
      // Even if document is complete, wait for images and other resources
      const resourcesLoaded = Promise.all(
        Array.from(document.images)
          .filter(img => !img.complete)
          .map(img => new Promise(resolve => {
            img.onload = img.onerror = resolve;
          }))
      );

      resourcesLoaded.then(handleFullyLoaded);
    } else {
      // Add event listener for when the page loads
      window.addEventListener('load', handleFullyLoaded);
    }
    
    // Also set a maximum timeout in case the load event doesn't fire
    const maxTimer = setTimeout(() => {
      setIsLoaded(true);
    }, minDisplayTime + 2000); // Add 2 seconds as a safety
    
    // Cleanup
    return () => {
      clearTimeout(timer);
      clearTimeout(maxTimer);
      window.removeEventListener('load', handleFullyLoaded);
    };
  }, [minDisplayTime, location.pathname]); // Re-run when route changes

  return isLoaded;
};

export default usePageLoaded; 