// "use client";

// import { createContext, useContext, useState, ReactNode, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { URL_BACKEND } from "@/config/constants";
// interface User {
//   id: number;
//   nombre: string;
//   apellido: string;
//   telefono: string;
//   email: string;
//   rol: "CLIENTE" | "ADMIN" | "AGENTE_INMOBILIARIO";
// }

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   login: (email: string, password: string) => Promise<boolean>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const router = useRouter();


//   const [user, setUser] = useState<User | null>(() => {
//     const savedUser = localStorage.getItem("user");
//     return savedUser ? JSON.parse(savedUser) : null;
//   });

//   const [token, setToken] = useState<string | null>(() => {
//     return localStorage.getItem("token");
//   });

//   const login = async (email: string, password: string) => {
//     try {
//       const response = await fetch(`${URL_BACKEND}/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!response.ok) {
//         return false;
//       }

//       const data = await response.json();

//       setUser(data.data);
//       setToken(data.token);
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.data));

//       return true;
//     } catch (error) {
//       console.error("Error al iniciar sesión:", error);
//       return false;
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     router.push("/");
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth debe usarse dentro de un AuthProvider");
//   }
//   return context;
// };


"use client";

// 1. Importa useEffect
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { URL_BACKEND } from "@/config/constants";

interface User {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  rol: "CLIENTE" | "ADMIN" | "AGENTE_INMOBILIARIO";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  // 2. Inicializa el estado como null (seguro para el servidor)
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // 3. Usa useEffect para cargar el estado desde localStorage (solo en el cliente)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedToken) {
      setToken(savedToken);
    }
  }, []); // El array vacío asegura que esto solo se ejecute una vez en el cliente

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${URL_BACKEND}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      setUser(data.data);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.data));

      return true;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};