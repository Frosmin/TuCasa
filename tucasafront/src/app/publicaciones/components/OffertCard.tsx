import Link from "next/link";
import { deleteOffertById } from "../services/offerts.service";
import { getStatusClasses } from "../types/offertStatus";
import { Home, Bed, Bath, Layout } from "lucide-react";
import { useToast } from "@/components/Toast";

export const OffertCard = ({ offert, onDeleteSuccess }) => {
  const statusClasses = getStatusClasses(offert.estadoPublicacion);
  const inmueble = offert.inmueble;
  const { showError, showInfo } = useToast();

  const handleDelete = async () => {
    if (
      !window.confirm("¿Estás seguro de que quieres eliminar esta publicación?")
    ) {
      return;
    }

    const deleted = await deleteOffertById(offert.id);

    if (deleted) {
      onDeleteSuccess(offert.id);
      showInfo("Oferta eliminada correctamente.");
    } else {
      showError("Ocurrio un error al eliminar la oferta.");
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100 flex flex-col md:flex-row md:space-x-6">
      <div className="md:w-56 md:h-48 flex-shrink-0">
        <div className="relative w-full h-full overflow-hidden rounded-xl">
          <img
            src={inmueble.url_imagen}
            alt={`Imagen de ${inmueble.tipo}`}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-2 left-2 px-3 py-1 text-xs font-semibold uppercase bg-blue-600 text-white rounded-full">
            {inmueble.tipo.replace("_", " ")}
          </span>
        </div>
      </div>

      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
            {inmueble.direccion}
          </h2>
        </div>

        <div className="flex items-center text-2xl font-extrabold text-indigo-600 mb-3">
          {offert.moneda} {offert.precio.toLocaleString()}
          <span className="text-sm font-medium text-gray-500 ml-2">
            ({offert.tipo})
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {offert.descripcion || inmueble.descripcion}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-700">
          <p className="flex items-center">
            <Layout className="w-4 h-4 mr-1 text-indigo-500" />
            {inmueble.superficie} m²
          </p>
          {inmueble.numDormitorios && (
            <p className="flex items-center">
              <Bed className="w-4 h-4 mr-1 text-indigo-500" />
              {inmueble.numDormitorios} Dorm.
            </p>
          )}
          {inmueble.numBanos && (
            <p className="flex items-center">
              <Bath className="w-4 h-4 mr-1 text-indigo-500" />
              {inmueble.numBanos} Baños
            </p>
          )}
          {inmueble.piso && (
            <p className="flex items-center">
              <Home className="w-4 h-4 mr-1 text-indigo-500" />
              Piso {inmueble.piso}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-start md:items-end justify-between mt-4 md:mt-0 md:pl-6 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0">
        <div className="flex flex-col items-start md:items-end space-y-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${statusClasses}`}
          >
            {offert.estadoPublicacion}
          </span>
        </div>

        <div className="text-xs text-gray-500 mt-4 md:mt-0">
          <p>Publicado:</p>
          <p className="font-medium">
            {new Date(offert.fechaPublicacionInicio).toLocaleDateString()}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full mt-4">
          <Link
            href={`/editar/${offert.id}`}
            className="w-full sm:flex-1 px-4 py-2 text-sm font-medium 
                    bg-indigo-600 rounded-lg 
                    hover:bg-indigo-700 transition duration-150 text-center
                    flex items-center justify-center"
          >
            <span className="text-white">Editar</span>
          </Link>

          <button
            className="w-full sm:flex-1 px-4 py-2 text-sm font-medium 
                    text-red-600 border border-red-600 rounded-lg 
                    hover:bg-red-50 transition duration-150
                    flex items-center justify-center"
            onClick={handleDelete}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
