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
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
  }
  return config;
});

const publicRoutes = [
  '/', 
  '/store', 
  '/about', 
  '/support', 
  '/faq', 
  '/become-seller',
  '/store/products'
];

const publicEndpoints = [
  '/api/products',
  '/api/categories',
  '/api/auth/me'
];

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const requestUrl = error.config.url;
      
      // Check if the request URL is a public endpoint
      const isPublicEndpoint = publicEndpoints.some(endpoint => requestUrl.includes(endpoint));
      // Check if current path is a public route
      const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route));
      
      if (isPublicEndpoint || isPublicRoute) {
        // Just clear auth state but don't redirect
        store.dispatch(clearAuth());
        return Promise.reject(error);
      }
      
      // Only redirect to login for protected routes
      if (!currentPath.includes('/login')) {
        store.dispatch(clearAuth());
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api; 