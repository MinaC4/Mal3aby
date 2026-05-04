import { useState, useEffect, useCallback } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
}

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>(() => {
    const stored = localStorage.getItem('malaby_admin_auth');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { isAuthenticated: false, username: null };
      }
    }
    return { isAuthenticated: false, username: null };
  });

  useEffect(() => {
    localStorage.setItem('malaby_admin_auth', JSON.stringify(auth));
  }, [auth]);

  const login = useCallback((username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setAuth({ isAuthenticated: true, username });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setAuth({ isAuthenticated: false, username: null });
    localStorage.removeItem('malaby_admin_auth');
  }, []);

  return {
    ...auth,
    login,
    logout
  };
}
