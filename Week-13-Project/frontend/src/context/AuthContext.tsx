// AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios'; // ✅ Adjust path to your axios instance
import axios from 'axios';

// Define the user type according to your /me response structure
type UserType = {
  id: string;
  name: string;
  email: string;
  // Add more fields as per your backend /me response
};

type AuthContextType = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  loading : boolean;
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
};

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
        await axios.get("http://localhost:8787/api/v1/user/logout", {withCredentials : true});
        setIsLoggedIn(false);
        setUser(null);
    } 

    // ✅ Fetch /me on app mount
    useEffect(() => {
        fetchUser();
    }, []);

  // Optionally block render until auth is checked
  // if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading, user, setUser }}>
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
