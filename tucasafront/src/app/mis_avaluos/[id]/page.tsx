"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAvaluoById } from "../services/getAvaluoById";
import LoadingSpinner from "@/components/Loading";

interface Propietario {
  nombre: string;
  apellido: string;
}

interface Avaluo {
  tipoInmueble: string;
  propietario: Propietario;
  celular: number;
  direccion: string;
  latitud: number;
  longitud: number;
  estado: string;
}

const AvaluoDetallePage = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [avaluo, setAvaluo] = useState<Avaluo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        // Aquí accedemos a res.data directamente
        const data = await getAvaluoById(id); 
        setAvaluo(data);
      } catch (error) {
        console.error("Error cargando detalle del avalúo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Cargando detalle del avalúo..." />
      </div>
    );
  }

  if (!avaluo) {
    return <p className="text-center mt-10">No se encontró el avalúo.</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">{avaluo.tipoInmueble}</h1>
      <p>
        <strong>Propietario:</strong>{" "}
        {avaluo.propietario?.nombre ?? "N/A"} {avaluo.propietario?.apellido ?? ""}
      </p>
      <p>
        <strong>Celular:</strong> {avaluo.celular ?? "N/A"}
      </p>
      <p>
        <strong>Dirección:</strong> {avaluo.direccion ?? "N/A"}
      </p>
      <p>
        <strong>Latitud:</strong> {avaluo.latitud ?? "N/A"}
      </p>
      <p>
        <strong>Longitud:</strong> {avaluo.longitud ?? "N/A"}
      </p>
      <p>
        <strong>Estado:</strong> {avaluo.estado ?? "N/A"}
      </p>
      <div className="mt-6">
  <button
    onClick={() => console.log("Cambiar estado")}
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  >
    Cambiar Estado
  </button>
</div>
    </div>
  );
};

export default AvaluoDetallePage;
