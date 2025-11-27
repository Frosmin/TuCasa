import { SolicitudAgente } from "../services/adminService";
import { X } from "lucide-react";
import Image from "next/image";

type ModalProps = {
    solicitudSeleccionada: SolicitudAgente
    handleAprobar: () => void
    handleRechazar: () => void
    cerrarModal: () => void
}
export default function ModalDetails({solicitudSeleccionada, handleAprobar, handleRechazar, cerrarModal}: ModalProps) {
    return (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50  ">
            <div className="bg-white w-full max-w-2xl border border-gray-300 rounded-lg shadow-md  ">
                <div className="bg-gray-200 flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="text-xl text-gray-800 font-bold">Detalles de Solicitud</h3>
                    <button onClick={cerrarModal} className="text-gray-500 hover:text-gray-700">
                        <X />
                    </button>
                </div>
                <div className="px-6 py-4 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="font-semibold text-gray-800">Nombre Completo</p>
                            <p className="text-gray-700">{solicitudSeleccionada.usuario.nombre} {solicitudSeleccionada.usuario.apellido}</p>
                        </div>

                        <div>
                            <p className="font-semibold text-gray-800">Email</p>
                            <p className="text-gray-700">{solicitudSeleccionada.usuario.correo}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="font-semibold text-gray-800">Teléfono</p>
                            <p className="text-gray-700">{solicitudSeleccionada.usuario.telefono}</p>
                        </div>

                        <div>
                            <p className="font-semibold text-gray-800">Dirección</p>
                            <p className="text-gray-700">{solicitudSeleccionada.usuario.direccion}</p>
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">Descripción de solicitud</p>
                        <p className="text-gray-700">{solicitudSeleccionada.descripcion}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">Experiencia</p>
                        <p className="text-gray-700">{solicitudSeleccionada.experiencia}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="font-semibold text-gray-800">Licencia</p>
                            <p className="text-gray-700">{solicitudSeleccionada.matricula}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">Curriculum Vitae(PDF)</p>
                            <a
                                href={solicitudSeleccionada.cvPath}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:underline"

                            >

                                <Image
                                    src="/pdf.png"
                                    alt="PDF Icon"
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                />

                                {solicitudSeleccionada.cvPath.split(/[/\\]/).pop()}
                            </a>
                        </div>

                    </div>

                    <div className="px-6 py-4 bg-gray-50 flex justify-end gap-4">
                        <button
                            onClick={cerrarModal}
                            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                        >
                            Cerrar
                        </button>

                        <button
                            onClick={handleRechazar}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Rechazar
                        </button>

                        <button
                            onClick={handleAprobar}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                            Aprobar
                        </button>
                    </div>

                </div>
            </div>
        </div>

    )
}