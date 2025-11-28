"use client";

import { useAuth } from "@/context/AuthContext";
import { User, Phone, Mail, MapPin, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./perfil.module.css";
import { URL_BACKEND } from "@/config/constants";
import { useToast } from "@/components/Toast";

export default function ProfilePage() {
  const { user, logout } = useAuth(); 
  const router = useRouter();
  const [zoomOpen, setZoomOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmClosing, setConfirmClosing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const dejarDeSerAgente = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const response = await fetch(URL_BACKEND + `/api/agentes/toClient/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      showSuccess("Cambiaste de rol. Cerrando sesión...");
      logout();

      router.push("/");
      showSuccess("Cambiaste de rol.")
    } catch (err) {
      console.error(err);
      showError("Ocurrió un error al cambiar tu rol.")
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Cargando perfil...</p>
      </div>
    );
  }

  const profileSrc = "../profile.png";

  const openModal = () => setZoomOpen(true);

  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setZoomOpen(false);
      setClosing(false);
    }, 250);
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-gradient-to-br from-gray-100 to-gray-300 py-8">
      <div className="bg-white w-full max-w-3xl shadow-xl rounded-3xl p-10 flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <div
            className={`w-40 h-40 rounded-full overflow-hidden shadow-lg border-4 border-white cursor-pointer ${styles.hoverProfile}`}
            onClick={openModal}
          >
            <img
              src={profileSrc}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          </div>
          <button className="text-sm text-blue-600 font-medium hover:underline">
            Cambiar foto
          </button>
        </div>

        {zoomOpen && (
          <div
            className="fixed inset-0 bg-gradient-to-br from-black/20 to-black/10 backdrop-blur-md flex justify-center items-center z-50"
            onClick={closeModal}
          >
            <div
              className={`relative max-w-3xl w-full p-4 transform transition-all duration-300 ease-out ${closing ? styles.animateCloseModal : styles.animateOpenModal
                }`}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={profileSrc}
                alt="Foto de perfil ampliada"
                className="w-full h-auto rounded-xl shadow-lg"
              />
              <button
                className="absolute top-2 right-2 text-white bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition"
                onClick={closeModal}
              >
                <X className="w-5 h-5 cursor-pointer" />
              </button>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-semibold text-gray-800">
          {user.nombre} {user.apellido}
        </h1>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
          <div
            className={`flex flex-col bg-gray-100 p-4 rounded-xl shadow-sm ${styles.hoverField}`}
          >
            <span className="text-xs text-gray-500 mb-1">Correo</span>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-600" />
              <span>{user.correo}</span>
            </div>
          </div>

          <div
            className={`flex flex-col bg-gray-100 p-4 rounded-xl shadow-sm ${styles.hoverField}`}
          >
            <span className="text-xs text-gray-500 mb-1">Teléfono</span>
            <div className="flex items-center gap-2 truncate">
              <Phone className="w-5 h-5 text-gray-600" />
              <span>{user.telefono}</span>
            </div>
          </div>

          <div
            className={`flex flex-col bg-gray-100 p-4 rounded-xl shadow-sm ${styles.hoverField}`}
          >
            <span className="text-xs text-gray-500 mb-1">Dirección</span>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-600" />
              <span>{user.direccion}</span>
            </div>
          </div>

          <div
            className={`flex flex-col bg-gray-100 p-4 rounded-xl shadow-sm ${styles.hoverField}`}
          >
            <span className="text-xs text-gray-500 mb-1">Rol</span>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              <span>{user.rol}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full justify-center">

          {user.rol !== "AGENTE_INMOBILIARIO" ? (
            <button
              onClick={() => router.push("/convertirse-agente")}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md"
            >
              Quiero ser agente
            </button>
          ) : (
            <button
              onClick={() => setConfirmOpen(true)}
              className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all shadow-md"
            >
              Dejar de ser agente
            </button>
          )}

          {/* <button className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-all shadow-md">
            Editar perfil
          </button> */}
        </div>
      </div>
      {confirmOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => {
            setConfirmClosing(true);
            setTimeout(() => {
              setConfirmOpen(false);
              setConfirmClosing(false);
            }, 200);
          }}
        >
          <div
            className={`bg-white rounded-2xl p-6 w-full max-w-md shadow-xl transition-all duration-300 ${confirmClosing ? "scale-90 opacity-0" : "scale-100 opacity-100"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              ¿Estás seguro que quieres dejar de ser agente?
            </h2>

            <p className="text-gray-600 mb-6">
              Esta acción cambiará tu rol nuevamente a CLIENTE.
              Podrás volver a aplicar más adelante.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setConfirmClosing(true);
                  setTimeout(() => {
                    setConfirmOpen(false);
                    setConfirmClosing(false);
                  }, 200);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>

              <button
                onClick={dejarDeSerAgente}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow disabled:bg-red-400"
              >
                {loading ? "Procesando..." : "Estoy seguro"}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
