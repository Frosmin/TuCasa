import { URL_BACKEND } from "@/config/constants";

export interface SolicitudAgente {
  id: number;
  usuario: {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
  };
  descripcion: string;
  experiencia: string;
  matricula?: string;
  cvPath: string;
  estado: "PENDIENTE" | "APROBADA" | "RECHAZADA";
}

export async function obtenerSolicitudesPendientes(): Promise<SolicitudAgente[]> {
  const res = await fetch(`${URL_BACKEND}/api/agentes/pendientes`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al obtener solicitudes");
  return res.json();
}

export async function aprobarSolicitud(id: number) {
  const res = await fetch(`${URL_BACKEND}/api/agentes/aprobar/${id}`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al aprobar solicitud");
}

export async function rechazarSolicitud(id: number) {
  const res = await fetch(`${URL_BACKEND}/api/agentes/rechazar/${id}`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al rechazar solicitud");
}
