"use client";

import { useEffect, useState } from "react";
import SolicitudCard from "../components/SolicitudCard";
import { obtenerSolicitudesPendientes, aprobarSolicitud, rechazarSolicitud, SolicitudAgente } from "../services/adminService";

export default function DashboardAdmin() {
  const [solicitudes, setSolicitudes] = useState<SolicitudAgente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      const data = await obtenerSolicitudesPendientes();
      setSolicitudes(data);
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async (id: number) => {
    try {
      await aprobarSolicitud(id);
      alert("Solicitud aprobada ✅");
      cargarSolicitudes();
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  const handleRechazar = async (id: number) => {
    try {
      await rechazarSolicitud(id);
      alert("Solicitud rechazada ❌");
      cargarSolicitudes();
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  if (loading) return <p>Cargando solicitudes...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración - Solicitudes de Agentes</h1>
      <div className="flex flex-col gap-4">
        {solicitudes.length === 0 && <p>No hay solicitudes pendientes.</p>}
        {solicitudes.map((solicitud) => (
          <SolicitudCard
            key={solicitud.id}
            solicitud={solicitud}
            onAprobar={() => handleAprobar(solicitud.id)}
            onRechazar={() => handleRechazar(solicitud.id)}
          />
        ))}
      </div>
    </div>
  );
}
