import { URL_BACKEND } from "@/config/constants";

export const getAvaluoById = async (id: string | undefined) => {
  if (!id) throw new Error("ID de avalúo no proporcionado");

  const res = await fetch(`${URL_BACKEND}/api/oferta/avaluo/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error(`Error ${res.status}: No se pudo obtener el avalúo`);

  const json = await res.json();

  return json.data;
};
