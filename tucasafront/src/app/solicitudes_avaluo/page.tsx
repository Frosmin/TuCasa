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
      <h1 className="text-3xl font-bold">Solicitudes de avaluo</h1>
      <div className="flex flex-col justify-center items-center w-[50%]">
        {list.map((e, idx) => {
          return (
            <div className="">
              <SolicitudAvalCard key={idx} solicitud={e} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Solicitudes;
