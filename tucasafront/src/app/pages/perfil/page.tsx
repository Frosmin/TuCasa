"use client";

import { useAuth } from "@/context/AuthContext";
import { User, Phone, Mail, MapPin } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth(); 

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex justify-center bg-gradient-to-br from-gray-100 to-gray-300 py-8">
      <div className="bg-white w-full max-w-3xl shadow-xl rounded-3xl p-10 flex flex-col items-center gap-8">

        <div className="flex flex-col items-center gap-4">
          <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg border-4 border-white">
            <img
              src="../profile.png"
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          </div>
          <button className="text-sm text-blue-600 font-medium hover:underline">
            Cambiar foto
          </button>
        </div>

        <h1 className="text-3xl font-semibold text-gray-800">
          {user.nombre} {user.apellido}
        </h1>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
          <div className="flex flex-col bg-gray-100 p-4 rounded-xl shadow-sm">
            <span className="text-xs text-gray-500 mb-1">Correo</span>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-600" />
              <span>{user.correo}</span>
            </div>
          </div>

          <div className="flex flex-col bg-gray-100 p-4 rounded-xl shadow-sm">
            <span className="text-xs text-gray-500 mb-1">Teléfono</span>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-gray-600" />
              <span>{user.telefono}</span>
            </div>
          </div>

          <div className="flex flex-col bg-gray-100 p-4 rounded-xl shadow-sm">
            <span className="text-xs text-gray-500 mb-1">Dirección</span>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-600" />
              <span>{user.direccion}</span>
            </div>
          </div>

          <div className="flex flex-col bg-gray-100 p-4 rounded-xl shadow-sm">
            <span className="text-xs text-gray-500 mb-1">Rol</span>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              <span>{user.rol}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full justify-center">
          <button className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md">
            Quiero ser agente
          </button>
          <button className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-all shadow-md">
            Editar perfil
          </button>
        </div>

      </div>
    </div>
  );
}
