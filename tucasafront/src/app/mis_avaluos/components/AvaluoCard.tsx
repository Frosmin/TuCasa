import { Badge } from "@/components/badge";
import Link from "next/link";
import { SolicitudAval } from "@/app/mis_avaluos/services/getMisAvaluos";

const EstadoBadge = ({ estado }: { estado: string }) => {
  const colors: any = {
    PENDIENTE: "bg-yellow-100 text-yellow-800",
    EN_PROCESO: "bg-blue-100 text-blue-800",
    COMPLETADO: "bg-green-100 text-green-800",
  };

  return (
    <Badge className={`${colors[estado]} px-3 py-1 rounded-md`}>
      {estado.replace("_", " ")}
    </Badge>
  );
};

const AvaluoCard = ({ avaluo }: { avaluo: SolicitudAval }) => {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">{avaluo.tipoInmueble}</h2>
        <EstadoBadge estado={avaluo.estado} />
      </div>

      <p><span className="font-semibold">Propietario:</span> {avaluo.propietario.nombre} {avaluo.propietario.apellido}</p>
      <p><span className="font-semibold">Celular:</span> {avaluo.celular}</p>
      <p><span className="font-semibold">Dirección:</span> {avaluo.direccion}</p>

      <Link
        href={`/mis_avaluos/${avaluo.id}`}
        className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Ver detalles
      </Link>
    </div>
  );
};

export default AvaluoCard;
