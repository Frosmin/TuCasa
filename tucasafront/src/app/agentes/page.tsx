"use client";

import { useEffect, useState } from "react";
import { obtenerAgentes, Agente } from "./services/agenteService";
import { useToast } from '@/components/Toast';
//import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";


export default function Agentes() {
  //const { user } = useAuth();
  const [agentes, setAgentes] = useState<Agente[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showError } = useToast();


  useEffect(() => {
    cargarAgentes();
  }, []);

  const cargarAgentes = async () => {
    try {
      const data = await obtenerAgentes();
      if (data.length === 0) {
        return (
          <div className="flex justify-center items-center h-screen">
            <p className="text-gray-600 text-lg">No existen agentes por el momento..!</p>
          </div>
        );
      }
      setAgentes(data);

    } catch (error: any) {
      showError("Error al cargar los agentes");
    } finally {
      setLoading(false);
    }
  };

  const profileSrc = "../profile.png";

  if (loading) return <Loading message="Cargando los agentes..." />;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 mt-3">
        <h2 className="text-xl font-bold mb-5">Contacte con Nuestros Agentes</h2>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-200 text-gray-800 uppercase text-base">
              <tr>
                <th className="px-6 py-5">Foto</th>
                <th className="px-6 py-5">Nombre</th>
                <th className="px-6 py-5">Descripcion</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {agentes.map((a) => (
                <tr key={a.id} className="border-b-3 border-gray-200 hover:bg-gray-100 text-gray-700">
                  <td className="px-6 py-4"><div
                    className={`w-15 h-15 rounded-full overflow-hidden shadow-lg border-4 border-white cursor-pointer`}
                  >
                    <img
                      src={profileSrc}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  </div></td>
                  <td className="px-6 py-4">{a.usuario.nombre} {a.usuario.apellido}</td>
                  <td className="px-6 py-4">{a.descripcion}</td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => { router.push(`/agentes/agente/${a.id}`) }}
                      className="text-blue-600 hover:underline"
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div >
  );
}
