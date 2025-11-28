"use client";
import { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { URL_BACKEND } from "@/config/constants";
import { useToast } from "@/components/Toast";


export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    contrasena: "",
    rol: "AGENTE_INMOBILIARIO",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (formData.contrasena !== confirmPassword) {
      showError("Las contraseñas no coinciden");
      return;
    }
    setIsSubmitting(true);

    try {
      const res = await fetch(URL_BACKEND + "api/usuarios/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.error) {
        showError(data.message);
      } else {
        showSuccess("Cuenta creada correctamente");
        setFormData({
          nombre: "",
          apellido: "",
          correo: "",
          telefono: "",
          contrasena: "",
          rol: "",
        });
        setConfirmPassword("");
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
        <h2 className="text-2xl pb-5 font-semibold text-center mb-2 text-black">
          Crear Cuenta de Agente Inmobiliario
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <p className="text-red-600 text-center font-medium">{error}</p>
          )}

          <div className="flex space-x-2">
            <div className="relative w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de Agente
              </label>
              <User
                className="absolute left-3 top-11 text-gray-400"
                size={18}
              />
              <input
                type="text"
                name="nombre"
                placeholder="Ej: Michael"
                required
                value={formData.nombre}
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
              name="correo"
              placeholder="Correo Electrónico"
              required
              value={formData.correo}
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
              name="contrasena"
              placeholder="Contraseña"
              required
              value={formData.contrasena}
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
            {isSubmitting
              ? "Creando Cuenta de Agente..."
              : "Crear Cuenta de Agente"}
          </button>
        </form>
      </div>
    </div>
  );
}
