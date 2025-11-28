"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { URL_BACKEND } from "@/config/constants";
interface User {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  direccion: string
  rol: "CLIENTE" | "ADMIN" | "AGENTE_INMOBILIARIO";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User | false>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false); // evita parpadeo inicial

  //Cargar datos de localStorage cuando ya existe `window`
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedToken) setToken(savedToken);
      setLoaded(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${URL_BACKEND}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      const userData: User = data.data;
      const userToken: string =
        data.token;

      setUser(userData);
      setToken(userToken);

      localStorage.setItem("token", userToken);
      localStorage.setItem("user", JSON.stringify(userData));


      setUser(userData);
      setToken(userToken);
      return data.data;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
  };

  //Evitar renderizar los hijos hasta que cargue el estado inicial
  if (!loaded) return null;

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};