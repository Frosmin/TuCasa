"use client";

import { SolicitudAval } from "@/app/mis_avaluos/services/getMisAvaluos";
import Link from "next/link";

interface Props {
  avaluo: SolicitudAval;
}

const AvaluoCard = ({ avaluo }: Props) => {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl p-5 mb-4 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h2 className="text-xl font-bold">{avaluo.tipoInmueble}</h2>
      <p>
        <span className="font-semibold">Propietario:</span> {avaluo.propietario.nombre} {avaluo.propietario.apellido}
      </p>
      <p>
        <span className="font-semibold">Celular:</span> {avaluo.celular}
      </p>
      <p>
        <span className="font-semibold">Dirección:</span> {avaluo.direccion}
      </p>
      <p>
        <span className="font-semibold">Estado:</span> {avaluo.estado}
      </p>
  

      {/* Botón “Ver a detalle” */}
      <Link
        href={`/mis_avaluos/${avaluo.id}`} 
        className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
      >
        Ver a detalle
      </Link>
    </div>
  );
};

export default AvaluoCard;
