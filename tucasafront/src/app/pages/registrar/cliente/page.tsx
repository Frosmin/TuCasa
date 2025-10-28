"use client";
import { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff, BookUser } from "lucide-react";

import { useToast } from "@/components/Toast";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    apellido: "",
    telefono: "",
    email: "",
    direccion: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "telefono") {
      const filteredValue = value.replace(/[^0-9+ ]/g, "");
      setFormData({
        ...formData,
        [name]: filteredValue,
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== confirmPassword) {
      showError("Las contraseñas no coinciden");
      return;
    }
    setIsSubmitting(true);

    try {
      const API_BASE_URL = "http://localhost:8000/tucasabackend/api";

      const res = await fetch(API_BASE_URL + "/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.error) {
        showError(data.message);
      } else {
        showSuccess(data.message);
        setFormData({
          name: "",
          apellido: "",
          email: "",
          telefono: "",
          direccion:"",
          password: "",
        });
        setConfirmPassword("");
        router.push("/");
      }
    } catch (err) {
      console.error("Error al enviar los datos:", err);
      showError("Ocurrió un error al crear la cuenta");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-2 text-black">
          Crear Cuenta
        </h2>
        <p className="text-gray-500 text-center mb-6">Únete a TuCasa hoy</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <p className="text-red-600 text-center font-medium">{error}</p>
          )}

          <div className="flex space-x-2">
            <div className="relative w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <User
                className="absolute left-3 top-11 text-gray-400"
                size={18}
              />
              <input
                type="text"
                name="name"
                placeholder="Ej: Michael"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-10 py-3 bg-gray-50 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="relative w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido
              </label>
              <User
                className="absolute left-3 top-11 text-gray-400"
                size={18}
              />
              <input
                type="text"
                name="apellido"
                placeholder="Ej: Jackson"
                required
                value={formData.apellido}
                onChange={handleChange}
                className="w-full px-10 py-3 bg-gray-50 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo
            </label>
            <Mail className="absolute left-3 top-11 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-10 py-3 bg-gray-50 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <BookUser className="absolute left-3 top-11 text-gray-400" size={18} />
            <input
              type="text"
              name="direccion"
              placeholder="Dirección"
              required
              value={formData.direccion}
              onChange={handleChange}
              className="w-full px-10 py-3 bg-gray-50 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <Phone className="absolute left-3 top-11 text-gray-400" size={18} />
            <input
              type="tel"
              name="telefono"
              placeholder="+591 000 00000"
              required
              value={formData.telefono}
              onChange={handleChange}
              className="w-full px-10 py-3 bg-gray-50 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <Lock className="absolute left-3 top-11 text-gray-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              required
              value={formData.password}
              onChange={handleChange}
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

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <Lock className="absolute left-3 top-11 text-gray-400" size={18} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar Contraseña"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-10 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-11 text-gray-400 hover:text-blue-700"
            >
              {showConfirmPassword ? (
                <EyeOff className="text-blue-700" size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg 
                       font-medium transition${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
              `}
          >
            {isSubmitting ? "Creando Cuenta..." : "Crear Cuenta"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}
