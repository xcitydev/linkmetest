"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  login: (userData: string) => void;
  logout: () => void;
  user: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(() => {
    const storedUser =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    }
  }, [user]);

  const login = (userData: string) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ login, logout, user }}>
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
