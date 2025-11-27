import { URL_BACKEND } from "@/config/constants";


export interface Agente {
  id: number;
  usuario: {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    telefono: number;
    direccion: string

  };
  descripcion: string;
  experiencia: string;
  matricula?: string;
  cv: string;
}



export async function obtenerAgentes(): Promise<Agente[]> {
  const res = await fetch(`${URL_BACKEND}/api/agentes`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Error al obtener los agentes");
  const json = await res.json();
  return json.data;
}

export async function obtenerAgente(id: number): Promise<Agente> {
  const res = await fetch(`${URL_BACKEND}/api/agentes/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Error al obtener los agentes");
  const json = await res.json();
  return json.data;
}




