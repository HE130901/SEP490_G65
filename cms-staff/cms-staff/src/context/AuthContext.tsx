"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AuthAPI from "@/services/authService";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      AuthAPI.getCurrentUser(token)
        .then((response) => {
          console.log("Fetched user:", response.data); // Debug log
          setUser(response.data);
          setLoading(false);
          // Điều hướng người dùng dựa trên vai trò
          if (response.data.role === "Manager") {
            router.push("/manager-dashboard");
          } else if (response.data.role === "Staff") {
            router.push("/dashboard");
          } else {
            logout();
          }
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await AuthAPI.login(email, password);
      const data = response.data;
      localStorage.setItem("token", data.token);
      setUser(data);

      // Điều hướng dựa trên vai trò
      if (data.role === "Manager") {
        router.push("/manager-dashboard");
      } else if (data.role === "Staff") {
        router.push("/dashboard");
      } else {
        throw new Error("AccessDenied"); // Ném lỗi nếu vai trò không hợp lệ
      }
    } catch (error) {
      logout();
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
