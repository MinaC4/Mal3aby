import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
}

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
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
