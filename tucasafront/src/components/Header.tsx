"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, User, LogOut, LayoutList, DollarSign, UserPlus,PanelTop } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { div } from "framer-motion/client";

export default function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={"/"} className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={180}
            height={60}
            className="h-16 w-auto"
          />
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8 text-sm font-medium">
          <Link
            href={"/mapa"}
            className="relative text-gray-700 font-bold hover:text-blue-600 transition-colors duration-300 group py-2"
          >
            Mapa
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
          </Link>
          <Link
            href={"/ventas"}
            className="relative text-gray-700 font-bold hover:text-blue-600 transition-colors duration-300 group py-2"
          >
            Ventas
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
          </Link>
          <Link
            href={"/alquiler"}
            className="relative text-gray-700 font-bold hover:text-blue-600 transition-colors duration-300 group py-2"
          >
            Alquiler
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
          </Link>
          <Link
            href={"/anticretico"}
            className="relative text-gray-700 font-bold hover:text-blue-600 transition-colors duration-300 group py-2"
          >
            Anticrético
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
          </Link>

          {!!user && (
            <div className="flex items-center gap-8 text-sm font-medium">
              <Link
                href={"/publicar"}
                className="relative text-gray-700 font-bold hover:text-blue-600 transition-colors duration-300 group py-2"
              >
                Publicar
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
              </Link>
              <Link
                href={"/agentes"}
                className="relative text-gray-700 font-bold hover:text-blue-600 transition-colors duration-300 group py-2"
              >
                Agentes
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
              </Link>
            </div>
          )}

          {!!user && (
            <Link
              href={"/avaluo"}
              className="relative text-gray-700 font-bold hover:text-blue-600 transition-colors duration-300 group py-2"
            >
              Servicios
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
            </Link>
          )}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/favoritos"
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105"
              >
                <Heart className="w-5 h-5" />
                <span className="text-sm font-medium">Favoritos</span>
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 bg-gray-200 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:scale-110"
              >
                <User className="w-5 h-5 text-gray-600 hover:text-white transition-colors duration-300" />
              </button>

              {menuOpen && (
                <div
                  ref={menuRef}
                  className="absolute top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
                >
                  {user.rol === "ADMIN" ? (
                    <Link
                      href={"/admin/dashboard"}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <PanelTop className="w-4 h-4" /> Panel Admin
                    </Link>
                  ) : (
                    <Link
                      onClick={() => setMenuOpen(false)}
                      href={"/pages/perfil"}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4" /> Perfil
                    </Link>
                  )}
                  <Link
                    href={"/publicaciones"}
                    onClick={() => setMenuOpen(false)}

                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <LayoutList className="w-4 h-4" /> Ver Publicaciones
                  </Link>

                  {/* solicitud avaluo */}
                  {user.rol as string === "AGENTE_INMOBILIARIO" && (
  <>
    <Link
      href={"/solicitudes_avaluo"}
      onClick={() => setMenuOpen(false)}
      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
    >
      <DollarSign className="w-4 h-4" /> Solicitudes avaluo
    </Link>

    <Link
      href={"/mis_avaluos"}
      onClick={() => setMenuOpen(false)}
      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
    >
      <LayoutList className="w-4 h-4" /> Mis Avalúos
    </Link>
  </>
)}

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4" /> Cerrar sesión
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-8 text-sm font-medium">
              <Link
                href={"/pages/registrar/cliente"}
                className="relative text-gray-700 font-bold hover:text-blue-600 transition-colors duration-300 group py-2"
              >
                Registrarse
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
              </Link>
              <Link
                href={"/login"}
                className="relative text-gray-700 font-bold hover:text-blue-600 transition-colors duration-300 group py-2"
              >
                Iniciar sesión
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
