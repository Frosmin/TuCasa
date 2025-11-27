import { URL_BACKEND } from "@/config/constants";
import { SolicitudAval } from "../page";
interface SolicitudResponse {
  error: boolean;
  message: string;
  code: number;
  data: SolicitudAval[];
}

export const getSolicitudes = async (token: string): Promise<SolicitudAval[]> => {
  try {
    const res = await fetch(`${URL_BACKEND}/api/oferta/avaluo/lista/pendientes`, {
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