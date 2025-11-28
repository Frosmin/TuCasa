"use client";

import { useAuth } from "@/context/AuthContext";
import { Phone, Mail, MapPin, X, IdCard, FileText, BriefcaseBusiness, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "@/app/pages/perfil/perfil.module.css";
import { Agente, obtenerAgente } from "../../services/agenteService";
import Link from 'next/link'
import Image from "next/image";

export default function ProfilePage() {
  const [user, setUser] = useState<Agente>();
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();
  const [zoomOpen, setZoomOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const agente = async () => {
      try {
        const data = await obtenerAgente(id);
        setUser(data);
      } catch (error) {
        console.error('Error al cargar al agente:', error);
      }
    }

    if (id) agente();
  }, [id]);

  if (!mounted) return null;



  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Cargando Agente...</p>
      </div>
    );
  }


  const profileSrc = "../../profile.png";

  const openModal = () => setZoomOpen(true);

  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setZoomOpen(false);
      setClosing(false);
    }, 250);
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-gradient-to-br from-gray-100 to-gray-300 py-8 relative">
      <div className="bg-white w-full max-w-3xl shadow-xl rounded-3xl p-10 flex flex-col items-center gap-8">
        <Link
          href="/agentes"
          className="absolute top-4 left-4 flex items-center gap-2 text-blue-600 hover:underline"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Volver a Agentes</span>
        </Link>
        <div className="flex flex-col items-center gap-4">
          <div
            className={`w-50 h-50 rounded-full overflow-hidden shadow-lg border-4 border-white cursor-pointer ${styles.hoverProfile}`}
            onClick={openModal}
          >
            <img
              src={profileSrc}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          </div>
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
          {user.usuario.nombre} {user.usuario.apellido}
        </h1>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
          <div
            className={`flex flex-col bg-gray-100 p-4 rounded-xl shadow-sm ${styles.hoverField}`}
          >
            <span className="text-xs text-gray-500 mb-1">Correo</span>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-600" />
              <span>{user.usuario.correo}</span>
            </div>
          </div>

          <div
            className={`flex flex-col bg-gray-100 p-4 rounded-xl shadow-sm ${styles.hoverField}`}
          >
            <span className="text-xs text-gray-500 mb-1">Teléfono</span>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-gray-600" />
              <span>{user.usuario.telefono}</span>
            </div>
          </div>

          <div
            className={`flex flex-col bg-gray-100 p-4 rounded-xl shadow-sm ${styles.hoverField}`}
          >
            <span className="text-xs text-gray-500 mb-1">Dirección</span>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-600" />
              <span>{user.usuario.direccion}</span>
            </div>
          </div>

          <div
            className={`flex flex-col bg-gray-100 p-4 rounded-xl shadow-sm ${styles.hoverField}`}
          >
            <span className="text-xs text-gray-500 mb-1">matricula</span>
            <div className="flex items-center gap-2">
              <IdCard className="w-5 h-5 text-gray-600" />
              <span>{user.matricula}</span>
            </div>
          </div>

          <div
            className={`flex flex-col bg-gray-100 p-4 rounded-xl shadow-sm col-span-1 sm:col-span-2 ${styles.hoverField}`}
          >
            <span className="text-xs text-gray-500 mb-1">Descripción</span>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              <span>{user.descripcion}</span>
            </div>
          </div>

          <div
            className={`flex flex-col bg-gray-100 p-4 rounded-xl shadow-sm ${styles.hoverField}`}
          >
            <span className="text-xs text-gray-500 mb-1">Experiencia</span>
            <div className="flex items-center gap-2">
              <BriefcaseBusiness className="w-5 h-5 text-gray-600" />
              <span>{user.experiencia}</span>
            </div>
          </div>

          <div
            className={`flex flex-col bg-gray-100 p-4 rounded-xl shadow-sm ${styles.hoverField}`}
          >
            <span className="text-xs text-gray-500 mb-1">Curriculum Vitae</span>
            <div className="flex items-center gap-2">
              <a
                href={user.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:underline"

              >

                <Image
                  src="/pdf.png"
                  alt="PDF Icon"
                  width={24}
                  height={24}
                  className="object-contain"
                />

                {user.cv.split(/[/\\]/).pop()}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
