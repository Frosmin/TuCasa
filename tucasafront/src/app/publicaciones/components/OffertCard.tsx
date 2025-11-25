"use client";

import Link from "next/link";
import {
  deleteOffertById,
  republishOffertById,
  updateOffertStatus,
} from "../services/offerts.service";
import {
  getStatusClasses,
  getStatusLabel,
} from "../types/offertStatus";
import {
  Home,
  Bed,
  Bath,
  Layout,
  CheckCircle,
  XCircle,
  RefreshCw,
  Pencil,
  Trash2,
} from "lucide-react";
import { useToast } from "@/components/Toast";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import type { EstadoPublicacion } from "@/models/Oferta";

interface Inmueble {
  url_imagen?: string;
  tipo: string;
  direccion: string;
  superficie: number;
  numDormitorios?: number;
  numBanos?: number;
  piso?: number | string;
  descripcion?: string;
}

export interface Oferta {
  id: number;
  estadoPublicacion: EstadoPublicacion;
  inmueble: Inmueble;
  moneda: string;
  precio: number;
  tipo: string;
  descripcion?: string;
  fechaPublicacionInicio: string;
  fechaPublicacionFin?: string;
}

interface OffertCardProps {
  offert: Oferta;
  onDeleteSuccess: (id: number) => void;
  onStatusChange: (id: number, newStatus: EstadoPublicacion) => void;
}

export const OffertCard: React.FC<OffertCardProps> = ({
  offert,
  onDeleteSuccess,
  onStatusChange,
}) => {
  const statusClasses = getStatusClasses(offert.estadoPublicacion);
  const statusLabel = getStatusLabel(offert.estadoPublicacion);
  const inmueble = offert.inmueble;
  const { showError, showSuccess } = useToast();
  const { modalState, isLoading, openModal, closeModal, handleConfirm } =
    useConfirmModal();

  const handleDelete = (): void => {
    openModal({
      title: "Eliminar publicación",
      message:
        "¿Estás seguro de que quieres eliminar esta publicación permanentemente? Esta acción no se puede deshacer.",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      type: "danger",
      onConfirm: async () => {
        try {
          await deleteOffertById(offert.id);
          onDeleteSuccess(offert.id);
          showSuccess("Oferta eliminada correctamente.");
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Error al eliminar la oferta";
          showError(message);
          throw error;
        }
      },
    });
  };

  const handleStatusChange = (newStatus: EstadoPublicacion): void => {
    const statusMessages: Record<
      EstadoPublicacion,
      { title: string; message: string; confirmText: string }
    > = {
      terminado: {
        title: "Marcar como terminada",
        message:
          "¿Marcar esta oferta como terminada? Esto indica que ya vendiste/alquilaste la propiedad.",
        confirmText: "Marcar como terminada",
      },
      cancelado: {
        title: "Cancelar oferta",
        message:
          "¿Cancelar esta oferta? Ya no aparecerá como publicada, pero podrás republicarla más tarde.",
        confirmText: "Cancelar oferta",
      },
      borrador: {
        title: "Mover a borrador",
        message:
          "Esta oferta se moverá a estado borrador. Podrás editarla antes de enviarla a revisión nuevamente.",
        confirmText: "Mover a borrador",
      },
      pendiente: {
        title: "Enviar a revisión",
        message:
          "¿Enviar esta oferta a revisión? Un agente la revisará antes de publicarla.",
        confirmText: "Enviar a revisión",
      },
      publicado: {
        title: "Publicar oferta",
        message: "¿Publicar esta oferta? Será visible para todos los usuarios.",
        confirmText: "Publicar",
      },
      rechazado: {
        title: "Rechazar oferta",
        message: "Esta acción marcará la oferta como rechazada.",
        confirmText: "Rechazar",
      },
    };

    const config = statusMessages[newStatus];

    openModal({
      title: config.title,
      message: config.message,
      confirmText: config.confirmText,
      cancelText: "Cancelar",
      type: newStatus === "terminado" ? "success" : "warning",
      onConfirm: async () => {
        try {
          const result = await updateOffertStatus(offert.id, newStatus);
          if (result) {
            onStatusChange(offert.id, newStatus);
            showSuccess(`Oferta actualizada correctamente.`);
          }
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Error al actualizar el estado";
          showError(message);
          throw error;
        }
      },
    });
  };

  const handleRepublish = (): void => {
    openModal({
      title: "Republicar oferta",
      message:
        "¿Deseas republicar esta oferta? Volverá al estado publicado y será visible nuevamente.",
      confirmText: "Republicar",
      cancelText: "Cancelar",
      type: "success",
      onConfirm: async () => {
        try {
          const result = await republishOffertById(offert.id);
          if (result) {
            onStatusChange(offert.id, "publicado");
            showSuccess(
              "Oferta republicada correctamente. Ahora está visible nuevamente."
            );
          }
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Error al republicar la oferta";
          showError(message);
          throw error;
        }
      },
    });
  };

  const canEdit =
    offert.estadoPublicacion === "borrador" ||
    offert.estadoPublicacion === "rechazado" ||
    offert.estadoPublicacion === "publicado";

  const canMarkAsFinished = offert.estadoPublicacion === "publicado";

  const canCancel =
    offert.estadoPublicacion === "borrador" ||
    offert.estadoPublicacion === "rechazado" ||
    offert.estadoPublicacion === "publicado";

  const canRepublish =
    offert.estadoPublicacion === "terminado" ||
    offert.estadoPublicacion === "cancelado";

  return (
    <>
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col md:flex-row md:gap-6">
        {/* Imagen */}
        <div className="w-full md:w-56 h-48 flex-shrink-0 mb-4 md:mb-0">
          <div className="relative w-full h-full overflow-hidden rounded-xl">
            <img
              src={inmueble.url_imagen || "/placeholder-property.jpg"}
              alt={`Imagen de ${inmueble.tipo}`}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-2 left-2 px-3 py-1 text-xs font-semibold uppercase bg-blue-600 text-white rounded-full">
              {inmueble.tipo.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-grow min-w-0">
          <div className="mb-2">
            <h2 className="text-xl font-bold text-gray-900 line-clamp-2 mb-1">
              {inmueble.direccion}
            </h2>
          </div>

          <div className="flex items-center mb-3">
            <span className="text-2xl font-extrabold text-indigo-600">
              {offert.moneda} {offert.precio.toLocaleString()}
            </span>
            <span className="text-sm font-medium text-gray-500 ml-2">
              ({offert.tipo})
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {offert.descripcion || inmueble.descripcion}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-700">
            <div className="flex items-center">
              <Layout className="w-4 h-4 mr-1 text-indigo-500 flex-shrink-0" />
              <span>{inmueble.superficie} m²</span>
            </div>
            {inmueble.numDormitorios && (
              <div className="flex items-center">
                <Bed className="w-4 h-4 mr-1 text-indigo-500 flex-shrink-0" />
                <span>{inmueble.numDormitorios} Dorm.</span>
              </div>
            )}
            {inmueble.numBanos && (
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1 text-indigo-500 flex-shrink-0" />
                <span>{inmueble.numBanos} Baños</span>
              </div>
            )}
            {inmueble.piso && (
              <div className="flex items-center">
                <Home className="w-4 h-4 mr-1 text-indigo-500 flex-shrink-0" />
                <span>Piso {inmueble.piso}</span>
              </div>
            )}
          </div>
        </div>

        {/* Panel lateral de acciones */}
        <div className="flex flex-col justify-between mt-4 md:mt-0 md:min-w-48 md:max-w-52 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
          {/* Estado y fechas */}
          <div className="flex flex-col space-y-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide text-center ${statusClasses}`}>
              {statusLabel}
            </span>

            <div className="flex justify-between text-xs text-gray-500 space-y-2">
              <div>
                <p className="text-gray-400">Publicado:</p>
                <p className="font-medium text-gray-700">
                  {new Date(offert.fechaPublicacionInicio).toLocaleDateString()}
                </p>
              </div>
              {offert.fechaPublicacionFin && (
                <div>
                  <p className="text-gray-400">Finalizado:</p>
                  <p className="font-medium text-gray-700">
                    {new Date(offert.fechaPublicacionFin).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col gap-2 w-full">
            {canEdit && (
              <Link
                href={`/editar/${offert.id}`}
                className="w-full px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-150 flex items-center justify-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                Editar
              </Link>
            )}

            {canRepublish && (
              <button
                className="w-full px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-150 flex items-center justify-center gap-2"
                onClick={handleRepublish}
              >
                <RefreshCw className="w-4 h-4" />
                Republicar
              </button>
            )}

            {canMarkAsFinished && (
              <button
                className="w-full px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center justify-center gap-2"
                onClick={() => handleStatusChange("terminado")}
              >
                <CheckCircle className="w-4 h-4" />
                Terminar Oferta
              </button>
            )}

            {canCancel && (
              <button
                className="w-full px-4 py-2 text-sm font-medium bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-150 flex items-center justify-center gap-2"
                onClick={() => handleStatusChange("cancelado")}
              >
                <XCircle className="w-4 h-4" />
                Cancelar Oferta
              </button>
            )}

            <button
              className="w-full px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors duration-150 flex items-center justify-center gap-2"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        type={modalState.type}
        isLoading={isLoading}
      />
    </>
  );
};