import { URL_BACKEND } from "@/config/constants";
import { SolicitudAval } from "../page";

interface SolicitudResponse {
  error: boolean;
  message: string;
  code: number;
  data: SolicitudAval[];
}

// Obtener avalúos en progreso
export const getSolicitudes = async (token: string): Promise<SolicitudAval[]> => {
  try {
    const res = await fetch(`${URL_BACKEND}/api/oferta/avaluo/lista/en-progreso`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}: No se pudieron obtener las solicitudes`);
    }

    const response: SolicitudResponse = await res.json();
    return response.data || [];

  } catch (error) {
    console.error("Error en getSolicitudes:", error);
    throw error;
  }
};

// Asignar un agente a un avalúo
export const asignarmeAvaluo = async (
  idAgente: string | number,
  idAvaluo: string | number,
  token?: string
) => {
  try {
    const res = await fetch(`${URL_BACKEND}/api/oferta/avaluo/asignar-agente`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idAgente, idAvaluo })
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}: No se pudo asignar el avalúo`);
    }

    const response: SolicitudResponse = await res.json();
    return response.data || [];

  } catch (error) {
    console.error("Error en asignarmeAvaluo:", error);
    throw error;
  }
};
