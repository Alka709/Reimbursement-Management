import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get('/rest/onboardings/profile');
        if (response.data && response.data.success) {
          setUser(response.data.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // 1. Login to get cookie
      const loginResponse = await axiosInstance.post('/rest/onboardings/login', { email, password });
      
      if (loginResponse.data && loginResponse.data.success) {
        // 2. Fetch profile to ensure cookie is set and get user data
        const profileResponse = await axiosInstance.get('/rest/onboardings/profile');
        if (profileResponse.data && profileResponse.data.success) {
          setUser(profileResponse.data.data);
          return profileResponse.data.data;
        } else {
          const loggedInUser = loginResponse.data.data;
          setUser(loggedInUser);
          return loggedInUser;
        }
      } else {
        throw new Error(loginResponse.data?.message || 'Login failed');
      }
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/rest/onboardings/logout');
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;

