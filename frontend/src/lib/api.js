import axios from 'axios';
import { toast } from 'sonner';

const serverUrl = import.meta.env.VITE_SERVER_URL;

// Create axios instance with base URL
const api = axios.create({
  baseURL: serverUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      toast.error('Session expired. Please login again');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else {
      // Handle other errors
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// API functions for categories
export const fetchCategories = async () => {
  try {
    const response = await api.get('/api/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// API functions for entries
export const fetchEntriesByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/api/entries/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching entries for category ${categoryId}:`, error);
    throw error;
  }
};

export const createEntry = async (entryData) => {
  try {
    const response = await api.post('/api/entries', entryData);
    return response.data;
  } catch (error) {
    console.error('Error creating entry:', error);
    throw error;
  }
};

// API functions for user profile
export const fetchUserProfile = async () => {
  try {
    const response = await api.get('/api/users/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export default api;
