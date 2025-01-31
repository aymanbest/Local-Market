import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message === "Token not found" || 
        error.response?.status === 401) {
      // Clear localStorage
      localStorage.clear();
      
      // Redirect to login page
      window.location.href = '/login';
      
      // Show message to user
      alert('Session expired. Please login again.');
    }
    return Promise.reject(error);
  }
);

export default api; 