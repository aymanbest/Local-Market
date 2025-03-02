import { useState, useEffect } from 'react';
import api from '../lib/axios';
import usePageLoaded from './usePageLoaded';

const useLoading = () => {
  const [isApiLoading, setIsApiLoading] = useState(false);
  const isPageLoaded = usePageLoaded(1200); // Minimum 1.2 seconds display time
  
  // Add request interceptor
  api.interceptors.request.use(
    (config) => {
      setIsApiLoading(true);
      return config;
    },
    (error) => {
      setIsApiLoading(false);
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  api.interceptors.response.use(
    (response) => {
      setIsApiLoading(false);
      return response;
    },
    (error) => {
      setIsApiLoading(false);
      return Promise.reject(error);
    }
  );

  // Return true if either API is loading or page is not fully loaded yet
  return isApiLoading || !isPageLoaded;
};

export default useLoading; 