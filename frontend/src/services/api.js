import axios from 'axios';
import { toast } from "@/components/ui/use-toast";

const serverUrl = import.meta.env.VITE_SERVER_URL;

// Create axios instance with base URL
const api = axios.create({
  baseURL: serverUrl
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors globally
api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || 'Something went wrong';
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
    return Promise.reject(error);
  }
);

// Entry related API calls
export const entryService = {
  // Create a new entry
  createEntry: async (entryData) => {
    try {
      const response = await api.post('/api/entries', entryData);
      toast({
        title: "Success",
        description: "Entry has been created successfully.",
      });
      return response.data;
    } catch (error) {
      console.error('Error creating entry:', error);
      throw error;
    }
  },

  // Create a quick entry (simplified version)
  createQuickEntry: async (amount) => {
    try {
      const entryData = {
        description: `Quick expense of ${amount}`,
        amount,
        category: "Miscellaneous",
        tags: [],
        doneAt: new Date()
      };
      const response = await api.post('/api/entries/quick', entryData);
      toast({
        title: "Success",
        description: `Quick entry of ${amount} added.`,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating quick entry:', error);
      throw error;
    }
  },

  // Process speech for entry
  processSpeechEntry: async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      const response = await api.post('/api/entries/speech', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast({
        title: "Success",
        description: "Audio processed successfully.",
      });
      
      return response.data; // Should return parsed entry data from speech
    } catch (error) {
      console.error('Error processing speech:', error);
      throw error;
    }
  },
  
  // Get user tags for autocomplete
  getUserTags: async () => {
    try {
      const response = await api.get('/api/user/tags');
      return response.data.tags;
    } catch (error) {
      console.error('Error fetching user tags:', error);
      throw error;
    }
  }
};

export default api;