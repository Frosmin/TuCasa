"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getOffertsByOwnerId } from "./services/offerts.service";
import { OffertCard, type Oferta } from "./components/OffertCard";
import Link from "next/link";
import ProtectedRoute from "@/context/ProtectedRoute";
import type { EstadoPublicacion } from "@/models/Oferta";
import { colorClasses, type ColorName } from "./types/offertStatus";
type FilterStatus = "todas" | "publicado" | "terminado" | "cancelado";
export default function MyOfferts() {
  const [offerts, setOfferts] = useState<Oferta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<EstadoPublicacion | "todas">("todas");

  const { user } = useAuth();

  const filtros: {
    key: FilterStatus | "todas";
    label: string;
    color: ColorName;
  }[] = [
      { key: "todas", label: "Todas", color: "gray" },
      { key: "publicado", label: "Publicadas", color: "green" },
      { key: "terminado", label: "Terminadas", color: "blue" },
      { key: "cancelado", label: "Canceladas", color: "red" },
    ];


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

  const handleOffertDeleted = (deletedOffertId: number) => {
    setOfferts((prevOfferts) =>
      prevOfferts.filter((offert) => offert.id !== deletedOffertId)
    );
  };

  const handleStatusChange = (offertId: number, newStatus: EstadoPublicacion) => {
    setOfferts((prevOfferts) =>
      prevOfferts.map((offert) =>
        offert.id === offertId
          ? { ...offert, estadoPublicacion: newStatus }
          : offert
      )
    );
  };

  // Filtrar ofertas según el estado seleccionado
  const filteredOfferts = offerts.filter((offert) => {
    if (filterStatus === "todas") return true;
    return offert.estadoPublicacion === filterStatus;
  });

  // Contar ofertas por estado (solo los estados visibles)
  const statusCounts = {
    todas: offerts.length,
    publicado: offerts.filter((o) => o.estadoPublicacion === "publicado").length,
    terminado: offerts.filter((o) => o.estadoPublicacion === "terminado").length,
    cancelado: offerts.filter((o) => o.estadoPublicacion === "cancelado").length,
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

        {/* Filtros por estado */}
        {!isLoading && offerts.length > 0 && (
          <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Filtrar por estado:
            </h3>
            <div className="flex flex-wrap gap-2">

              {filtros.map(({ key, label, color }) => (
                <button
                  key={key}
                  onClick={() => setFilterStatus(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
    ${filterStatus === key
                      ? colorClasses[color].active
                      : colorClasses[color].inactive
                    }`}
                >
                  {label} ({statusCounts[key]})
                </button>

              ))}

            </div>
          </div>
        )}

        <div className="mt-6">
          {isLoading && (
            <p className="text-center text-gray-600">
              Cargando publicaciones...
            </p>
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
                  href="/publicar"
                  className="inline-flex items-center px-6 py-2 text-base font-semibold 
                   bg-indigo-600 rounded-lg text-white
                   hover:bg-indigo-700 transition duration-150 shadow-md"
                >
                  Publicar un Inmueble 🏠
                </Link>
              </div>
            </div>
          )}
          {!isLoading && filteredOfferts.length === 0 && offerts.length > 0 && (
            <div className="text-center p-12 border border-dashed border-gray-300 rounded-xl bg-white">
              <p className="text-xl font-semibold text-gray-700">
                No hay ofertas con el estado "{filterStatus}".
              </p>
              <p className="text-gray-500 mt-2">
                Prueba con otro filtro o publica una nueva oferta.
              </p>
            </div>
          )}
          {!isLoading && filteredOfferts.length > 0 && (
            <div className="space-y-6">
              {filteredOfferts.map((offert, i) => (
                <OffertCard
                  key={i}
                  offert={offert}
                  onDeleteSuccess={handleOffertDeleted}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}