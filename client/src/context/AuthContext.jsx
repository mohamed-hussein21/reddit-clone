import { createContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth.api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const data = await authApi.getMe();
          setUser(data);
        } catch {
          localStorage.removeItem('token');
        }
      }

      setLoading(false);
    }

    loadUser();
  }, []);

  async function login(email, password) {
    const data = await authApi.login(email, password);

    localStorage.setItem('token', data.token);
    setUser(data.user);

    return data.user;
  }

  async function register(username, email, password) {
    const data = await authApi.register(username, email, password);

    localStorage.setItem('token', data.token);
    setUser(data.user);

    return data.user;
  }

  async function logout() {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      loading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}