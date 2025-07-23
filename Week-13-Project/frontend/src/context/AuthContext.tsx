// AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios'; // ✅ Adjust path to your axios instance

type AuthContextType = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  loading : boolean;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true); // ⏳ optional loading state

    const login = () => setIsLoggedIn(true);
    const logout = () => setIsLoggedIn(false);

    // ✅ Fetch /me on app mount
    useEffect(() => {
      const fetchUser = async () => {
        try {
            setLoading(true);
            await api.get("/api/v1/user/me");
            setIsLoggedIn(true);
        }
        catch {
            setIsLoggedIn(false);
        }
        finally {
            setLoading(false);
        }
      };

      fetchUser();
    }, []);

  // Optionally block render until auth is checked
  // if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
