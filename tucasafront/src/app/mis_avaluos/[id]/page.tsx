'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAvaluoById } from "../services/getAvaluoById";
import LoadingSpinner from "@/components/Loading";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/dialog";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/select";

import { Button } from "@/components/button";
import { updateEstadoAvaluo } from "../services/updateEstado";

import PropertyLocationMap from "@/components/PropertyLocationMap";

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
  zona?: string;
  descripcion?: string;
}

const ESTADOS = [
  { label: "Pendiente", value: "PENDIENTE" },
  { label: "En Proceso", value: "EN_PROCESO" },
  { label: "Completado", value: "COMPLETADO" },
];

const AvaluoDetallePage = () => {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [avaluo, setAvaluo] = useState<Avaluo | null>(null);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
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

  const handleActualizarEstado = async () => {
    if (!id || !nuevoEstado) return;

    try {
      const response = await updateEstadoAvaluo(id, nuevoEstado);
      console.log("Respuesta backend:", response);
      setAvaluo((prev) => prev ? { ...prev, estado: nuevoEstado } : prev);
      setOpen(false);
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

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
      <div className="p-6 max-w-4xl mx-auto space-y-6">

      {/* BOTÓN VOLVER */}
      <div className="flex justify-start">
        <Button
          onClick={() => router.back()}
          className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-2 rounded-lg"
        >
          Volver
        </Button>
      </div>

      {/* INFORMACIÓN PRINCIPAL */}
      <div className="flex flex-col md:flex-row justify-between items-start bg-white rounded-3xl shadow-lg p-6 border border-gray-100 gap-6">
        
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">{avaluo.tipoInmueble}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Propietario</span>
              <span className="text-gray-900 font-medium">{avaluo.propietario?.nombre} {avaluo.propietario?.apellido}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Celular</span>
              <span className="text-gray-900 font-medium">{avaluo.celular}</span>
            </div>
            <div className="flex flex-col sm:col-span-2">
              <span className="text-gray-500 text-sm">Dirección</span>
              <span className="text-gray-900 font-medium">{avaluo.direccion}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Estado</span>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold 
                ${avaluo.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${avaluo.estado === 'EN_PROCESO' ? 'bg-blue-100 text-blue-800' : ''}
                ${avaluo.estado === 'COMPLETADO' ? 'bg-green-100 text-green-800' : ''}
              `}>
                {avaluo.estado}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center md:justify-start mt-4 md:mt-0">
          <Button onClick={() => setOpen(true)} className="w-full md:w-40">
            Cambiar Estado
          </Button>
        </div>
      </div>

      {/* MAPA */}
      <PropertyLocationMap
        latitude={avaluo.latitud}
        longitude={avaluo.longitud}
        address={avaluo.direccion}
        zone={avaluo.zona || "N/A"}
        propertyName={avaluo.descripcion || avaluo.tipoInmueble}
      />

      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar Estado</DialogTitle>
          </DialogHeader>

          <Select
            onValueChange={setNuevoEstado}
            defaultValue={avaluo.estado}
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Seleccionar estado..." />
            </SelectTrigger>
            <SelectContent>
              {ESTADOS.map((e) => (
                <SelectItem key={e.value} value={e.value}>
                  {e.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleActualizarEstado} disabled={!nuevoEstado}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

  );
};

export default AvaluoDetallePage;
