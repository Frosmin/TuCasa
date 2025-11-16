import { URL_BACKEND } from "@/config/constants";

export const getOffertsByOwnerId = async (id: number) => {
  try {
    const response = await fetch(`${URL_BACKEND}/api/oferta/propietario/${id}`);
    if (!response.ok) {
      throw new Error(
        `Error al obtener ofertas: ${response.status} ${response.statusText}`
      );
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error(`Ocurrio un error al obtener las ofertas`, error);
    return [];
  }
};

export const deleteOffertById = async (id: number) => {
  try {
    const response = await fetch(`${URL_BACKEND}/api/oferta/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(
        `Error al eliminar oferta: ${response.status} ${response.statusText}`
      );
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();
      console.log("Respuesta de eliminación (con cuerpo):", result.data);
    }
    return true;
  } catch (error) {
    console.error(`Ocurrio un error al eliminar la oferta.`, error);
    return false;
  }
};
