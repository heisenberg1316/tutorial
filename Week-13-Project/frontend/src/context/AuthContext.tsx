// AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios'; // ✅ Adjust path to your axios instance
import type { AuthContextType } from '../types/contextTypes';
import type { UserType } from '../types/types';

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true); // ⏳ optional loading state
    const [user, setUser] = useState<UserType | null>(null);


    const fetchUser = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/v1/user/me');
            setIsLoggedIn(true);
            setUser(res.data.data); // Make sure backend returns data in { data: { id, username, ... } }
        }
        catch {
            setIsLoggedIn(false);
            setUser(null);
        }
        finally {
            setLoading(false);
        }
    };


    const login = () => {
        setIsLoggedIn(true);
    }
    const logout = async () => {
        const resp = await api.get("/api/v1/user/logout", {withCredentials : true});
        console.log("resp is ", resp);
        setIsLoggedIn(false);
        alert("Logout successfull");
        setUser(null);
    } 

    // ✅ Fetch /me on app mount
    useEffect(() => {
        fetchUser();
    }, []);

  // Optionally block render until auth is checked
  // if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, login, logout, loading, user, setUser }}>
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
