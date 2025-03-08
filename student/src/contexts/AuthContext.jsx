import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuth = async () => {
      if (token) {
        setIsAuthenticated(true);
        await fetchUserProfile();
      }
      setLoading(false);
    };
    
    checkAuth();
  }, [token]);

  const login = async (userData, authToken) => {
    setToken(authToken);
    localStorage.setItem('token', authToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const fetchUserProfile = async () => {
    if (!token) return;
    
    setProfileLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // Token expired or invalid
        logout();
      }
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        loading, 
        profileLoading,
        login, 
        logout,
        fetchUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
