"use client";

import { useEffect, useState } from "react";
import { Users, Newspaper } from "lucide-react";
import { obtenerSolicitudesPendientes, aprobarSolicitud, rechazarSolicitud, SolicitudAgente } from "../services/adminService";
import { SearchBar } from "@/app/admin/components/SearchBar";
import FilterSelect from "@/app/admin/components/FilterSelect";
import { useToast } from '@/components/Toast';
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import ModalDetails from "../components/ModalDetails";

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
  const router = useRouter();


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
    return router.push("/");
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

  if (loading) return <Loading message="Cargando las solicitudes..." />;

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
      {modalOpen && solicitudSeleccionada && (
        <ModalDetails
          solicitudSeleccionada={solicitudSeleccionada}
          handleAprobar={handleAprobar}
          handleRechazar={handleRechazar}
          cerrarModal={cerrarModal}
        />
      )}
    </div >
  );
}
