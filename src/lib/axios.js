import axios from 'axios';
import store from '../store/store';
import { clearAuth } from '../store/slices/auth/authSlice';

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
  '/store/products',
  '/login',
  '/register',
  '/admin/login',
  '/forgot-password'
];

const publicEndpoints = [
  '/api/products',
  '/api/categories'
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
      
      // Always redirect on /api/auth/me 401 response, unless on public routes
      if (requestUrl.includes('/api/auth/me')) {
        if (!isPublicRoute) {
          store.dispatch(clearAuth());
          if (!currentPath.includes('/login')) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
      
      // Handle other 401 errors
      if (!isPublicRoute && !isPublicEndpoint) {
        store.dispatch(clearAuth());
        if (!currentPath.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api; 