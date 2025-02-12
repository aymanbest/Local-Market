import axios from 'axios';
import store from '../store/store';
import { clearAuth } from '../store/slices/authSlice';

const createApi = (withCredentials = true) => axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials
});

const api = createApi();

// Add a request interceptor to handle CSRF token
api.interceptors.request.use(config => {
  const cookies = document.cookie.split(';');
  const xsrfToken = cookies
    .find(cookie => cookie.trim().startsWith('XSRF-TOKEN='))
    ?.split('=')[1];
  
  if (xsrfToken) {
    console.log('XSRF-TOKEN:', xsrfToken);
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
  }
  return config;
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      S
    }
    return Promise.reject(error);
  }
);

export default api; 