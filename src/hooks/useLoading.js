import { useState } from 'react';
import api from '../lib/axios';

const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Add request interceptor
  api.interceptors.request.use(
    (config) => {
      setIsLoading(true);
      return config;
    },
    (error) => {
      setIsLoading(false);
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  api.interceptors.response.use(
    (response) => {
      setIsLoading(false);
      return response;
    },
    (error) => {
      setIsLoading(false);
      return Promise.reject(error);
    }
  );

  return isLoading;
};

export default useLoading; 