"use client";
import { useEffect, useState } from "react";
import SolicitudAvalCard from "./components/solicitudAvalCard";
import { getSolicitudes } from "./services/getSolicitudes";

export interface SolicitudAval {
  tipo: string;
  propietario: string;
  celular: number;
  lat: number;
  lng: number;
  estado: string;
}

const Solicitudes = () => {
  const list: SolicitudAval[] = [
    {
      tipo: "CASA",
      propietario: "Ricardo Rojas Carvajal",
      celular: 123123,
      lat: -17.3922,
      lng: -66.1598,
      estado: "ACTIVE",
    },
    {
      tipo: "DEPARTAMENTO",
      propietario: "Ricardo Rojas Carvajal",
      celular: 123123,
      lat: -17.3922,
      lng: -66.1598,
      estado: "ACTIVE",
    },
    {
      tipo: "TIENDA",
      propietario: "Ricardo Rojas Carvajal",
      celular: 123123,
      lat: -17.3922,
      lng: -66.1598,
      estado: "ACTIVE",
    },
    {
      tipo: "LOTE",
      propietario: "Ricardo Rojas Carvajal",
      celular: 123123,
      lat: -17.3922,
      lng: -66.1598,
      estado: "ACTIVE",
    },
    {
      tipo: "CASA",
      propietario: "Ricardo Rojas Carvajal",
      celular: 123123,
      lat: -17.3922,
      lng: -66.1598,
      estado: "ACTIVE",
    },
    {
      tipo: "CASA",
      propietario: "Ricardo Rojas Carvajal",
      celular: 123123,
      lat: -17.3922,
      lng: -66.1598,
      estado: "ACTIVE",
    },
  ];
  // cambiar la lista hardcodeada con la recuperacion desde el back
  const [solicitudes, setSolicitudes] = useState<SolicitudAval[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSolicitudes();
        setSolicitudes(data);
      } catch (error) {
        console.log("Error: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // al aceptar cambiar el estado de active a EN_CURSO o algo similar

  if (loading) {
    return <div>Carganding..</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl font-extrabold mt-5">Solicitudes de avaluo</h1>

      <p className="text-gray-500">
        Gestiona los avaluos de inmuebles que han publicado.
      </p>
      <div className="flex flex-col justify-center items-center w-[50%]">
        {list.length !== 0 ? ( // cambiar el list por state de solicitudes 
          list.map((e, index) => {
            return <SolicitudAvalCard key={index} solicitud={e} />;
          })
        ) : (
          <div className="flex flex-col justify-center items-center rounded-2xl w-full mt-5 mb-5 p-10 bg-gray-100">
            <h1 className="text-lg font-semibold">
              Aún no existen solicitudes de avaluo.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Solicitudes;
