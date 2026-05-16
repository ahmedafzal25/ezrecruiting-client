import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrateUser = async () => {
      const token = localStorage.getItem('ats_token');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data);
          localStorage.setItem('ats_user', JSON.stringify(data));
        } catch (error) {
          console.error('Failed to hydrate user', error);
          setUser(null);
          localStorage.removeItem('ats_token');
          localStorage.removeItem('ats_user');
        }
      }
      setLoading(false);
    };

    hydrateUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('ats_token', data.token);
    const userData = { ...data };
    delete userData.token;
    localStorage.setItem('ats_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('ats_token', data.token);
    const userData = { ...data };
    delete userData.token;
    localStorage.setItem('ats_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('ats_token');
    localStorage.removeItem('ats_user');
    setUser(null);
    window.location.href = '/login';
  };

  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem('ats_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
