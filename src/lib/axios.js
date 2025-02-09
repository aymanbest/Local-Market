import axios from 'axios';
import store from '../store';
import { clearAuth } from '../store/slices/authSlice';

const createApi = (withCredentials = true) => axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials
});

const api = createApi();

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