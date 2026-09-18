import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { apiLogin, getToken, setToken, clearToken, getStoredUsername, setStoredUsername } from '@/hooks/useApi';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
}

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    const token = getToken();
    return {
      isAuthenticated: !!token,
      username: token ? getStoredUsername() : null
    };
  });

  // A 401/403 from any admin call clears the session and returns to login.
  useEffect(() => {
    const handleUnauthorized = () => setAuth({ isAuthenticated: false, username: null });
    window.addEventListener('malaby:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('malaby:unauthorized', handleUnauthorized);
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const data = await apiLogin(username, password);
      setToken(data.token);
      setStoredUsername(data.username);
      setAuth({ isAuthenticated: true, username: data.username });
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setAuth({ isAuthenticated: false, username: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
