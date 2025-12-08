import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Adjust if needed

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: Redirect to login or clear local state if needed
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
