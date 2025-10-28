"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/Toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      setLoading(true);

      const success = await login(formData.email, formData.password);

      if (success) {
        showSuccess("Inicio Correcto.");
        router.push("/");
      } else {
        setError("Credenciales Incorrectas.");
        showError("Credenciales Incorrectas.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al iniciar sesión");
      showError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Iniciar Sesión
        </h1>

        {/* Email */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correo Electrónico
          </label>
          <Mail className="absolute left-3 top-11 text-gray-400" size={18} />
          <input
            type="email"
            name="email"
            placeholder="Tu correo"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-10 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/*Contrasena */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <Lock className="absolute left-3 top-11 text-gray-400" size={18} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Tu contraseña"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-10 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-11 text-gray-400 hover:text-blue-700"
          >
            {showPassword ? (
              <EyeOff className="text-blue-700" size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-medium transition-all
            ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Iniciando..." : "Entrar"}
        </button>

        <p className="text-center text-sm text-gray-500">
          ¿No tienes una cuenta?{" "}
          <a
            href="/pages/registrar/cliente"
            className="text-blue-600 hover:underline"
          >
            Regístrate
          </a>
        </p>
      </form>
    </div>
  );
}
