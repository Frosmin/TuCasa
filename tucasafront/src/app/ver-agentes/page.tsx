"use client"
import { useMemo, useState, useEffect } from "react";
import { User as UserIcon, Mail, Phone, MapPin, X, FileText } from "lucide-react";
import { URL_BACKEND } from "@/config/constants";
import LoadingSpinner from "@/components/Loading";
interface UserType {
    id: number;
    nombre: string;
    apellido: string;
    telefono: string;
    direccion: string;
    correo: string;
    rol: string;
    descripcion?: string;
    experiencia?: string;
    matricula?: string;
    cvPath?: string;
}

type Props = {
    users?: UserType[];
};

export default function AgentsListAndCards() {
    const [view, setView] = useState<"cards" | "list">("cards");
    const [query, setQuery] = useState<string>("");
    const [selected, setSelected] = useState<UserType | null>(null);
    const [closing, setClosing] = useState(false);
    const [opening, setOpening] = useState(false);
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const agents = useMemo(() => users.filter((u) => u.rol === "AGENTE_INMOBILIARIO"), [users]);
    const profileSrc = "../profile.png";
    const filtered = useMemo(() => {
        if (!query) return agents;
        const q = query.toLowerCase();
        return agents.filter(
            (a) =>
                a.nombre.toLowerCase().includes(q) ||
                a.apellido.toLowerCase().includes(q) ||
                a.correo.toLowerCase().includes(q)
        );
    }, [agents, query]);

    const closeModal = () => {
        setClosing(true);
        setOpening(false);
        setTimeout(() => {
            setSelected(null);
            setClosing(false);
        }, 250);
    };

    const openModal = async (u: UserType) => {
        setSelected(u);
        setOpening(true);
        try {
            const res = await fetch(`${URL_BACKEND}/api/agentes/info/${u.id}`);
            if (!res.ok) throw new Error("Error al obtener detalles del agente");
            const data = await res.json();
            setSelected((prev) => prev ? { ...prev, ...data.data[0] } : prev);
        } catch (err: any) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(URL_BACKEND + "/api/usuarios");
                if (!res.ok) throw new Error("Error al obtener usuarios");
                const json = await res.json();
                setUsers(json.data);
            } catch (err: any) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <LoadingSpinner fullScreen={true} />;
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold">Agentes inmobiliarios</h2>
                    <p className="text-sm text-gray-500">Mostrando {filtered.length} agentes</p>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        value={query}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                        placeholder="Buscar por nombre, apellido o correo"
                        className="px-3 py-2 rounded-lg border border-gray-200 shadow-sm w-72"
                    />
                    <div className="inline-flex rounded-md shadow-sm" role="group">
                        <button
                            onClick={() => setView("cards")}
                            className={`px-3 py-2 rounded-l-lg border ${view === "cards" ? "bg-gray-800 text-white" : "bg-white text-gray-700"}`}
                        >
                            Cards
                        </button>
                        <button
                            onClick={() => setView("list")}
                            className={`px-3 py-2 rounded-r-lg border ${view === "list" ? "bg-gray-800 text-white" : "bg-white text-gray-700"}`}
                        >
                            Lista
                        </button>
                    </div>
                </div>
            </div>
            {view === "cards" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((u) => (
                        <article key={u.id} className="bg-white rounded-2xl shadow p-4 hover:shadow-lg transition">
                            <div className="flex items-center gap-4">
                                <img src={profileSrc} alt="avatar" className="w-16 h-16 rounded-full object-cover" />
                                <div className="flex-1">
                                    <h3 className="font-medium text-lg">{u.nombre} {u.apellido}</h3>
                                    <p className="text-sm text-gray-500">{u.rol}</p>
                                    <p className="text-sm text-gray-600 mt-1">{u.direccion}</p>
                                    {u.descripcion && <p className="text-sm text-gray-700 mt-1">{u.descripcion}</p>}
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between gap-2">
                                <div className="text-sm text-gray-600 truncate">
                                    <div className="flex items-center gap-2 truncate"><Phone className="w-4 h-4" />{u.telefono}</div>
                                    <div className="flex items-center gap-2 mt-1"><Mail className="w-4 h-4" />{u.correo}</div>
                                    {u.matricula && <div className="mt-1 text-gray-500 text-xs">Matrícula: {u.matricula}</div>}
                                    {u.experiencia && <div className="mt-1 text-gray-500 text-xs">Experiencia: {u.experiencia}</div>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => openModal(u)}
                                        className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm shadow-sm"
                                    >
                                        Ver
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
            {view === "list" && (
                <div className="bg-white rounded-2xl shadow overflow-hidden">
                    <table className="w-full table-fixed">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left w-48">Nombre</th>
                                <th className="p-3 text-left">Contacto</th>
                                <th className="p-3 text-left">Dirección</th>
                                <th className="p-3 text-left w-36">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u) => (
                                <tr key={u.id} className="border-t hover:bg-gray-50">
                                    <td className="p-3 flex items-center gap-3">
                                        <img src={profileSrc} alt="avatar" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <div className="font-medium">{u.nombre} {u.apellido}</div>
                                            <div className="text-xs text-gray-500">{u.rol}</div>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="text-sm truncate">{u.telefono}</div>
                                        <div className="text-sm text-gray-500">{u.correo}</div>
                                    </td>
                                    <td className="p-3 text-sm text-gray-600">{u.direccion}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => openModal(u)}
                                            className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm">Ver</button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-6 text-center text-gray-500">No hay agentes que coincidan</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {selected && (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${closing ? "bg-black/0" : "bg-black/40"
                        }`}
                    onClick={closeModal}
                >
                    <div
                        className={`bg-white rounded-2xl max-w-2xl w-full p-6 relative transform transition-all duration-300 ${closing ? "scale-95 opacity-0" : opening ? "scale-100 opacity-100" : "scale-95 opacity-0"
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">
                            Detalles del Agente
                        </h1>
                        <button
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
                            onClick={closeModal}
                        >
                            <X />
                        </button>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="w-full sm:w-40 flex-shrink-0 flex flex-col items-center sm:items-start gap-3">
                                <img src={profileSrc} alt="avatar" className="w-40 h-40 rounded-xl object-cover" />

                                <div className="p-3  rounded-lg w-full text-center sm:text-left">

                                    <h3 className="text-2xl font-semibold">{selected.nombre} {selected.apellido}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{selected.rol}</p>

                                </div>

                                <div className="p-3  rounded-lg w-full ">
                                    <div className="text-xs text-gray-400">Teléfono</div>
                                    <div className="font-medium truncate">{selected.telefono}</div>
                                </div>

                                {selected.cvPath && (
                                    <div className="p-3  rounded-lg w-full text-center sm:text-left flex items-center justify-center sm:justify-start gap-2">
                                        <FileText className="w-5 h-5" />
                                        <a
                                            href={selected.cvPath}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            Ver CV PDF
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="p-3 bg-gray-50 rounded-lg my-2 sm:col-span-2">
                                        <div className="text-xs text-gray-400">Correo</div>
                                        <div className="font-medium truncate">{selected.correo}</div>
                                    </div>

                                    <div className="p-3 bg-gray-50 rounded-lg my-2 sm:col-span-2">
                                        <div className="text-xs text-gray-400">Dirección</div>
                                        <div className="font-medium">{selected.direccion}</div>
                                    </div>

                                    {selected.descripcion && (
                                        <div className="p-3 bg-gray-50 rounded-lg my-2 sm:col-span-2">
                                            <div className="text-xs text-gray-400">Descripción</div>
                                            <div className="font-medium">{selected.descripcion}</div>
                                        </div>
                                    )}

                                    {selected.experiencia && (
                                        <div className="p-3 bg-gray-50 rounded-lg my-2 sm:col-span-2">
                                            <div className="text-xs text-gray-400">Experiencia</div>
                                            <div className="font-medium">{selected.experiencia}</div>
                                        </div>
                                    )}

                                    {selected.matricula && (
                                        <div className="p-3 bg-gray-50 rounded-lg my-2">
                                            <div className="text-xs text-gray-400">Matrícula</div>
                                            <div className="font-medium">{selected.matricula}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}