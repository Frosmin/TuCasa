"use client";

import { useEffect, useState, useCallback } from "react";
import AvaluoCard from "./components/AvaluoCard";
import { getMisAvaluos, SolicitudAval } from "./services/getMisAvaluos";
import LoadingSpinner from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/Toast";

const MisAvaluosPage = () => {
  const { token, user } = useAuth();
  const { showError } = useToast();

  const [avaluos, setAvaluos] = useState<SolicitudAval[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    if (!token || !user) return;

    try {
      setLoading(true);
      const data = await getMisAvaluos(token, user.id);
      setAvaluos(data);
    } catch (error) {
      showError("No se pudieron cargar tus avaluos.");
    } finally {
      setLoading(false);
    }
  }, [token, user, showError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Cargando tus avaluos..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center py-5">
      <h1 className="text-3xl font-extrabold mt-5">Mis Avalúos</h1>
      <p className="text-gray-500 mb-5">
        Avaluos asignados a ti como agente inmobiliario.
      </p>

      <div className="flex flex-col justify-center items-center w-[50%]">
        {avaluos.length > 0 ? (
          avaluos.map((avaluo, index) => <AvaluoCard key={index} avaluo={avaluo} />)
        ) : (
          <div className="flex flex-col justify-center items-center rounded-2xl w-full p-10 bg-gray-100">
            <h1 className="text-lg font-semibold">
              No tienes avaluos asignados todavía.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default MisAvaluosPage;
