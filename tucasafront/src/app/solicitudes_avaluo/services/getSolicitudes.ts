import { SolicitudAval } from "../page";


export const getSolicitudes = async (): Promise<SolicitudAval[]> => {
  const res = await fetch("asdjf.../solicitudes_avaluo");

  if (!res.ok) {
    throw new Error("Error al obtener las solicitudes");
  }

  return res.json();
};
