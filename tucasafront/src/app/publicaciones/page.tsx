"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getOffertsByOwnerId } from "./services/offerts.service";
import { OffertCard } from "./components/OffertCard";
import Link from "next/link";
import ProtectedRoute from "@/context/ProtectedRoute";

export default function MyOfferts() {
  const [offerts, setOfferts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchOfferts = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const data = await getOffertsByOwnerId(user.id);
      setOfferts(data);
    } catch (error) {
      console.error("Error al obtener las ofertas de publicaciones:", error);
      setOfferts([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchOfferts();
    }
  }, [user, fetchOfferts]);

  const handleOffertDeleted = (deletedOffertId) => {
    setOfferts((prevOfferts) =>
      prevOfferts.filter((offert) => offert.id !== deletedOffertId)
    );
  };

  return (
    <ProtectedRoute>
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Mis Publicaciones
          </h1>
          <p className="text-gray-500">
            Gestión de todas las ofertas de inmuebles que has publicado.
          </p>
        </header>

        <div className="mt-6">
          {isLoading && (
            <p className="text-center text-gray-600">Cargando publicaciones...</p>
          )}

          {!isLoading && offerts.length === 0 && (
            <div className="text-center p-12 border border-dashed border-gray-300 rounded-xl bg-white">
              <p className="text-xl font-semibold text-gray-700">
                Aún no tienes publicaciones activas.
              </p>
              <p className="text-gray-500 mt-2">
                ¡Empieza a publicar tu primer inmueble hoy!
              </p>
              <div className="mt-4 flex justify-center">
                <Link
                  href={`/publicar`}
                  className="inline-flex items-center px-6 py-2 text-base font-semibold 
                   bg-indigo-600 rounded-lg text-white
                   hover:bg-indigo-700 transition duration-150 shadow-md"
                >
                  Publicar un Inmueble 🏠
                </Link>
              </div>
            </div>
          )}

          {!isLoading && offerts.length > 0 && (
            <div className="space-y-6">
              {offerts.map((offert) => (
                <OffertCard
                  key={offert.id}
                  offert={offert}
                  onDeleteSuccess={handleOffertDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
