"use client";

import { useEffect, useState } from "react";
import { Users, Newspaper } from "lucide-react";
import { obtenerSolicitudesPendientes, aprobarSolicitud, rechazarSolicitud, SolicitudAgente } from "../services/adminService";
import { SearchBar } from "@/app/admin/components/SearchBar";
import FilterSelect from "@/app/admin/components/FilterSelect";
import type { Oferta, EstadoPublicacion } from "@/models/Oferta";

export default function DashboardAdmin() {
  const [solicitudes, setSolicitudes] = useState<SolicitudAgente[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudAgente | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState('');

  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loadingOfertas, setLoadingOfertas] = useState(false);

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
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarOfertas = async () => {
    try {
      setLoadingOfertas(true);
      const res = await fetch("http://localhost:8000/tucasabackend/api/oferta/all");
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setOfertas(data.data);
    } catch (err: any) {
      alert("Error cargando ofertas: " + err.message);
    } finally {
      setLoadingOfertas(false);
    }
  };

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
      alert("Solicitud aprobada");
      cerrarModal();
      cargarSolicitudes();
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  const handleRechazar = async () => {
    if (!solicitudSeleccionada) return;
    try {
      await rechazarSolicitud(solicitudSeleccionada.id);
      alert("Solicitud rechazada");
      cerrarModal();
      cargarSolicitudes();
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  const actualizarEstado = (id: number, nuevoEstado: EstadoPublicacion) => {
    setOfertas(prev =>
      prev.map(o => (o.id === id ? { ...o, estadoPublicacion: nuevoEstado } : o))
    );
  };

  if (loading) return <p>Cargando solicitudes...</p>;

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
                  if (id === "PUBLICACIONES") cargarOfertas();
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all duration-300 font-medium whitespace-nowrap ${
                  panelSeleccionado === id
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
            <div className="flex w-full gap-4">
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
                {solicitudes.map((s) => (
                  <tr key={s.id} className="border-b-2 border-gray-200 hover:bg-gray-100 text-gray-700">
                    <td className="px-6 py-4">{s.usuario.nombre}</td>
                    <td className="px-6 py-4">{s.usuario.apellido}</td>
                    <td className="px-6 py-4">{s.usuario.correo}</td>
                    <td className="px-6 py-4">{s.usuario.telefono}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          s.estado === "APROBADA"
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
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

     {/* TABLA DE PUBLICACIONES */}
{panelSeleccionado === "PUBLICACIONES" && (
  <div className="max-w-7xl mx-auto px-4 mt-3">
    <h2 className="text-xl font-bold">Gestión de Publicaciones</h2>
    {loadingOfertas ? (
      <p>Cargando ofertas...</p>
    ) : ofertas.length === 0 ? (
      <p>No hay ofertas disponibles</p>
    ) : (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-200 text-gray-800 uppercase text-base">
            <tr>
              <th className="px-6 py-5">ID</th>
              <th className="px-6 py-5">Tipo</th>
              <th className="px-6 py-5">Dirección</th>
              <th className="px-6 py-5">Precio</th>
              <th className="px-6 py-5">Estado</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ofertas.map((o) => (
              <tr key={o.id} className="border-b-2 border-gray-200 hover:bg-gray-100 text-gray-700">
                <td className="px-6 py-4">{o.id}</td>
                <td className="px-6 py-4">{o.tipo} - {o.inmueble.tipo}</td>
                <td className="px-6 py-4">{o.inmueble.direccion}</td>
                <td className="px-6 py-4">{o.moneda} {o.precio}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    o.estadoPublicacion === "publicado"
                      ? "bg-green-100 text-green-700"
                      : o.estadoPublicacion === "borrador"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {o.estadoPublicacion}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <a
                    href={`/oferta/${o.id}`}
                    className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Ver detalles
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}

      {/* MODAL DE AGENTES */}
      {modalOpen && solicitudSeleccionada && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-xl font-semibold">Detalles de Solicitud</h3>
              <button onClick={cerrarModal} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="px-6 py-4 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-gray-700">Nombre Completo</p>
                  <p>{solicitudSeleccionada.usuario.nombre} {solicitudSeleccionada.usuario.apellido}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Email</p>
                  <p>{solicitudSeleccionada.usuario.correo}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-gray-700">Teléfono</p>
                  <p>{solicitudSeleccionada.usuario.telefono}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Dirección</p>
                  <p>{solicitudSeleccionada.usuario.direccion}</p>
                </div>
              </div>
              <hr />
              <div>
                <p className="font-semibold text-gray-700">Descripción de solicitud</p>
                <p>{solicitudSeleccionada.descripcion}</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-gray-700">Experiencia</p>
                  <p>{solicitudSeleccionada.experiencia}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Licencia</p>
                  <p>{solicitudSeleccionada.matricula}</p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-700">CV (PDF)</p>
                <button className="text-blue-600 hover:underline">Ver CV</button>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-4">
              <button onClick={cerrarModal} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cerrar</button>
              <button onClick={handleRechazar} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Rechazar</button>
              <button onClick={handleAprobar} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Aprobar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
