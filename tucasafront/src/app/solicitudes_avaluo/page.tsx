"use client";
import SolicitudAvalCard from "./components/solicitudAvalCard";

export interface SolicitudAval {
  tipo: string;
  propietario: string;
  celular: number;
  lat: number;
  lng: number;
}

const Solicitudes = () => {
  const list: SolicitudAval[] = [
    {
      tipo: "CASA",
      propietario: "Ricardo Rojas Carvajal",
      celular: 123123,
      lat: -17.3922,
      lng: -66.1598,
    },
    {
      tipo: "DEPARTAMENTO",
      propietario: "Ricardo Rojas Carvajal",
      celular: 123123,
      lat: -17.3922,
      lng: -66.1598,
    },
    {
      tipo: "TIENDA",
      propietario: "Ricardo Rojas Carvajal",
      celular: 123123,
      lat: -17.3922,
      lng: -66.1598,
    },
    {
      tipo: "LOTE",
      propietario: "Ricardo Rojas Carvajal",
      celular: 123123,
      lat: -17.3922,
      lng: -66.1598,
    },
    {
      tipo: "CASA",
      propietario: "Ricardo Rojas Carvajal",
      celular: 123123,
      lat: -17.3922,
      lng: -66.1598,
    },
    {
      tipo: "CASA",
      propietario: "Ricardo Rojas Carvajal",
      celular: 123123,
      lat: -17.3922,
      lng: -66.1598,
    },
  ];
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl font-extrabold mt-5">Solicitudes de avaluo</h1>

      <p className="text-gray-500">
        Gestiona los avaluos de inmuebles que han publicado.
      </p>
      <div className="flex flex-col justify-center items-center w-[50%]">
        {list.length !== 0 ? (
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
