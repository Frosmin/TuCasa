import { URL_BACKEND } from "@/config/constants";
import type { EstadoPublicacion } from "@/models/Oferta";
import type { Oferta } from "../components/OffertCard";

interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}


// Helper para manejar errores de fetch
const handleFetchError = async (response: Response): Promise<never> => {
  let errorMessage = `Error ${response.status}: ${response.statusText}`;
  
  try {
    const errorData = await response.json();
    if (errorData.message) {
      errorMessage = errorData.message;
    }
  } catch {
    // Si no hay JSON de error, usar el mensaje por defecto
  }
  
  throw new Error(errorMessage);
};

export const getOffertsByOwnerId = async (id: number): Promise<Oferta[]> => {
  try {
    const response = await fetch(`${URL_BACKEND}/api/oferta/propietario/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      await handleFetchError(response);
    }
    
    const result: ApiResponse<Oferta[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error al obtener las ofertas:", error);
    throw error;
  }
};

export const deleteOffertById = async (id: number): Promise<boolean> => {
  if (!id || id <= 0) {
    throw new Error("ID de oferta inválido");
  }

  try {
    const response = await fetch(`${URL_BACKEND}/api/oferta/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      await handleFetchError(response);
    }
    
    // Intentar leer el JSON si existe
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();
      console.log("Respuesta de eliminación:", result.data);
    }
    
    return true;
  } catch (error) {
    console.error(`Error al eliminar la oferta ${id}:`, error);
    throw error;
  }
};

export const updateOffertStatus = async (
  offertId: number,
  newStatus: EstadoPublicacion
): Promise<Oferta> => {
  if (!offertId || offertId <= 0) {
    throw new Error("ID de oferta inválido");
  }

  try {
    const response = await fetch(
      `${URL_BACKEND}/api/oferta/${offertId}/estado?estadoPublicacion=${newStatus}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      await handleFetchError(response);
    }

    const result: ApiResponse<Oferta> = await response.json();
    
    if (!result.data) {
      throw new Error("No se recibieron datos del servidor");
    }
    
    return result.data;
  } catch (error) {
    console.error(`Error al cambiar el estado de la oferta ${offertId}:`, error);
    throw error;
  }
};
export const cancelOffertById = async (id: number): Promise<Oferta> => {
  return await updateOffertStatus(id, "cancelado");
};

export const finishOffertById = async (id: number): Promise<Oferta> => {
  return await updateOffertStatus(id, "terminado");
};

export const republishOffertById = async (id: number): Promise<Oferta> => {
  return await updateOffertStatus(id, "publicado");
};

export const submitOffertForReview = async (id: number): Promise<Oferta> => {
  return await updateOffertStatus(id, "pendiente");
};