import { URL_BACKEND } from "@/config/constants";

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  correo: string;
  rol: string;
}

export interface SolicitudAval {
  id: number;
  tipoInmueble: string;
  propietario: Usuario;
  agente?: Usuario;
  celular: string | number;
  latitud: number;
  longitud: number;
  direccion: string;
  estado: string;
  fechaSolicitud?: string;
}

interface Response {
  error: boolean;
  message: string;
  code: number;
  data: SolicitudAval[];
}

export const getMisAvaluos = async (token: string, agenteId: number): Promise<SolicitudAval[]> => {
  try {
    const res = await fetch(`${URL_BACKEND}/api/oferta/avaluo/lista/agente/${agenteId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}: No se pudieron obtener los avaluos`);
    }

    const response: Response = await res.json();
    return response.data || [];
  } catch (error) {
    console.error("Error en getMisAvaluos:", error);
    throw error;
  }
};
