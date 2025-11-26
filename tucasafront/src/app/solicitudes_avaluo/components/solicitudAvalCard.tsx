import { Building2, Home, LucideIcon, Map, Store } from "lucide-react";
import { SolicitudAval } from "../page";

interface SolicitudAvalCardProps {
  solicitud: SolicitudAval;
}

const SolicitudAvalCard = ({ solicitud }: SolicitudAvalCardProps) => {
  const icons: Record<string, LucideIcon> = {
    CASA: Home,
    DEPARTAMENTO: Building2,
    TIENDA: Store,
    LOTE: Map,
  };
  const Icon: LucideIcon = icons[solicitud.tipo];
  const openMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };
  return (
    <div className="grid md:grid-cols-[1fr_3fr_1fr_1fr] w-full p-5 m-2 border-b rounded-2xl bg-gray-100">
      {/* Icon */}
      <div className="flex justify-center items-center m-5">
        <Icon className="w-16 h-16" />
      </div>
      {/* Info */}
      <div className="flex ">
        <div className="flex flex-col w-[75%]">
          <div className="m-1">
            <h1 className=" inline m-2 text-md font-semibold">Inmueble:</h1>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              {solicitud.tipo}
            </span>
          </div>
          <div className="m-1">
            <h2 className=" inline m-2 text-md font-semibold">Propietario:</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              {solicitud.propietario}
            </span>
          </div>
          <div className="m-1">
            <h2 className=" inline m-2 text-md font-semibold">Celular: </h2>
            <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold">
              {solicitud.celular}
            </span>
          </div>
        </div>
      </div>
      {/* Ubicacion */}
      <div className="flex justify-center items-center">
        <button
          onClick={() => openMaps(solicitud.lat, solicitud.lng)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Ver ubicación
        </button>
      </div>
      {/* Aqui */}
      <div className="flex justify-center items-center">Aceptar</div>
    </div>
  );
};

export default SolicitudAvalCard;
