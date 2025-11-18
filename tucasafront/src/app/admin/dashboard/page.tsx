"use client";

import { useEffect, useState } from "react";
import { Users, Newspaper, X } from "lucide-react";
import Image from "next/image";
import { obtenerSolicitudesPendientes, aprobarSolicitud, rechazarSolicitud, SolicitudAgente } from "../services/adminService";
import { SearchBar } from "@/app/admin/components/SearchBar";
import FilterSelect from "@/app/admin/components/FilterSelect";
import { useToast } from '@/components/Toast';
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";

export default function DashboardAdmin() {
  const { user } = useAuth();
  const [solicitudes, setSolicitudes] = useState<SolicitudAgente[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudAgente | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState('');
  const [filteredData, setFilteredData] = useState<SolicitudAgente[]>([]);
  const { showSuccess, showError } = useToast();


  const solicitudesPanel = [
    { id: "AGENTES", label: "Agentes", icon: Users },
    { id: "PUBLICACIONES", label: "Publicaciones", icon: Newspaper },
  ] as const;

  const [panelSeleccionado, setPanelSeleccionado] = useState("AGENTES");

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      const data = await obtenerSolicitudesPendientes();
      setSolicitudes(data);
      setFilteredData(data);
    } catch (error: any) {
      showError("Error al cargar las solicitudes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let temp = solicitudes;
    if (searchTerm.trim() !== "") {
      temp = temp.filter(s =>
        s.usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.usuario.correo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selected !== "" && selected !== "all") {
      temp = temp.filter(s => s.estado === selected);
    }

    setFilteredData(temp);
  }, [searchTerm, selected, solicitudes]);

  if (!user || user.rol !== "ADMIN") {
    return (
      <div className="text-center py-20">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-xl">Página no encontrada</p>
      </div>
    );
  }

  const abrirModal = (solicitud: SolicitudAgente) => {
    setSolicitudSeleccionada(solicitud);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setSolicitudSeleccionada(null);
  };


  const handleAprobar = async () => {
    if (!solicitudSeleccionada) return;
    try {
      await aprobarSolicitud(solicitudSeleccionada.id);
      showSuccess("La solicitud fue Aprobada");
      cerrarModal();
      cargarSolicitudes();
    } catch (error: any) {
      showError("Error al aprobar la solicitud");
      console.error(error);
    }
  };

  const handleRechazar = async () => {
    if (!solicitudSeleccionada) return;
    try {
      await rechazarSolicitud(solicitudSeleccionada.id);
      showSuccess("La solicitud fue Rechazada");
      cerrarModal();
      cargarSolicitudes();
    } catch (error: any) {
      showError("Error al rechazar la solicitud");
      console.error(error);
    }
  };

  if (loading) return <Loading message="Cargando las solicitudes..." /> ;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-start gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {solicitudesPanel.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setPanelSeleccionado(id);
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all duration-300 font-medium whitespace-nowrap ${panelSeleccionado === id
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                  : "border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-gray-50"
                  }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* TABLA DE AGENTES */}
      {panelSeleccionado === "AGENTES" && (
        <div className="max-w-7xl mx-auto px-4 mt-3">
          <h2 className="text-xl font-bold">Gestión de Solicitud de Agentes</h2>
          <div className="w-full mx-auto px-1 py-6">
            <div className="flex w-full  gap-4">
              <div className="flex-6">
                <SearchBar value={searchTerm} onChange={setSearchTerm} />
              </div>

              <div className="flex-1">
                <FilterSelect value={selected} onChange={setSelected} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-200 text-gray-800 uppercase text-base">
                <tr>
                  <th className="px-6 py-5">Nombre</th>
                  <th className="px-6 py-5">Apellido</th>
                  <th className="px-6 py-5">Email</th>
                  <th className="px-6 py-5">Teléfono</th>
                  <th className="px-6 py-5">Estado</th>
                  <th className="px-6 py-3">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((s) => (
                  <tr key={s.id} className="border-b-2 border-gray-200 hover:bg-gray-100 text-gray-700">
                    <td className="px-6 py-4">{s.usuario.nombre}</td>
                    <td className="px-6 py-4">{s.usuario.apellido}</td>
                    <td className="px-6 py-4">{s.usuario.correo}</td>
                    <td className="px-6 py-4">{s.usuario.telefono}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${s.estado === "APROBADA"
                          ? "bg-green-100 text-green-700"
                          : s.estado === "PENDIENTE"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {s.estado}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => abrirModal(s)}
                        className="text-blue-600 hover:underline"
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL */}
      {modalOpen && solicitudSeleccionada && (
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

    </div >
  );
}
