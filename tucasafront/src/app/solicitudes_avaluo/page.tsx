"use client";
import { useEffect, useState, useCallback } from "react";
import SolicitudAvalCard from "./components/solicitudAvalCard";
import { asignarmeAvaluo, getSolicitudes } from "./services/getSolicitudes";
import LoadingSpinner from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/Toast";

export interface Usuario{
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  correo: string;
  rol: string;
}

export interface SolicitudAval {
  id: string,
  tipoInmueble: string;
  propietario: Usuario;
  celular: number;
  latitud: number;
  longitud: number;
  estado: string;
  direccion: string;
  // fechaSolicitud?: string;
}

const Solicitudes = () => {
  const { token, user } = useAuth();
  const { showError, showSuccess } = useToast();
  const userId = user?.id;

  // cambiar la lista hardcodeada con la recuperacion desde el back
  const [solicitudes, setSolicitudes] = useState<SolicitudAval[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const data = await getSolicitudes(token);
      console.log("data:", data);
      setSolicitudes(data);
    } catch (error: any) {
      console.error("Error cargando solicitudes:", error);
      showError("No se pudieron cargar las solicitudes de avalúo.");
    } finally {
      setLoading(false);
    }
  }, [token, showError]);

  const handleAsignar = useCallback(async (idAvaluo: string | number) => {
    if (!userId) {
      showError("No se encontro el id del usuario para la asignacion");
      return;
    }
    try {
      await asignarmeAvaluo(userId, idAvaluo);
      showSuccess("Avalúo asignado correctamente.");
      await fetchData(); 
    } catch (error) {
      console.error("Error al asignar avalúo:", error);
      showError("Error al asignar el avalúo. Por favor, inténtalo de nuevo.");
    }
  }, [userId, showSuccess, showError, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // al aceptar cambiar el estado de active a EN_CURSO o algo similar

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Cargando solicitudes..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl font-extrabold mt-5">Solicitudes de avaluo</h1>

      <p className="text-gray-500">
        Gestiona los avaluos de inmuebles que han publicado.
      </p>
      <div className="flex flex-col justify-center items-center w-[50%]">
        {solicitudes.length > 0 ? (
          solicitudes.map((solicitud, index) => (
            <SolicitudAvalCard key={index} solicitud={solicitud} onAsign={handleAsignar}/>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center rounded-2xl w-full mt-5 mb-5 p-10 bg-gray-100">
            <h1 className="text-lg font-semibold">
              Aún no existen solicitudes de avaluo.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Solicitudes;
