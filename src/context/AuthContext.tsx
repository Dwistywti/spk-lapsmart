import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Role = "admin" | "user";

interface User {
  id: string;
  username: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, role: Role) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("laptop_saw_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, role: Role) => {
    const userData: User = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      role,
    };
    setUser(userData);
    localStorage.setItem("laptop_saw_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("laptop_saw_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
