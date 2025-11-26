"use client"
import React, { useState, useMemo } from "react";
import { User as UserIcon, Mail, Phone, MapPin, X, FileText } from "lucide-react";


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
    cvPdf?: string;
}

type Props = {
    users?: UserType[];
};

export default function AgentsListAndCards({ users = [] }: Props) {
    const [view, setView] = useState<"cards" | "list">("cards");
    const [query, setQuery] = useState<string>("");
    const [selected, setSelected] = useState<UserType | null>(null);

    const agents = useMemo(() => sampleUsers.filter((u) => u.rol === "AGENTE_INMOBILIARIO"), [users]);

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

    // const avatarFor = (email: string): string => {
    //     const initials = (email || "?").slice(0, 2).toUpperCase();
    //     const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><rect width='100%' height='100%' fill='%23E5E7EB'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='56' fill='%234B5563'>${initials}</text></svg>`;
    //     return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    // };

    
  const profileSrc = "../profile.png";

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
                                {/* <img src={avatarFor(u.correo)} alt="avatar" className="w-16 h-16 rounded-full object-cover" /> */}
                                <img src={profileSrc} alt="avatar" className="w-16 h-16 rounded-full object-cover" />
                                <div className="flex-1">
                                    <h3 className="font-medium text-lg">{u.nombre} {u.apellido}</h3>
                                    <p className="text-sm text-gray-500">{u.rol}</p>
                                    <p className="text-sm text-gray-600 mt-1">{u.direccion}</p>
                                    {u.descripcion && <p className="text-sm text-gray-700 mt-1">{u.descripcion}</p>}
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-2">
                                <div className="text-sm text-gray-600">
                                    <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{u.telefono}</div>
                                    <div className="flex items-center gap-2 mt-1"><Mail className="w-4 h-4" />{u.correo}</div>
                                    {u.matricula && <div className="mt-1 text-gray-500 text-xs">Matrícula: {u.matricula}</div>}
                                    {u.experiencia && <div className="mt-1 text-gray-500 text-xs">Experiencia: {u.experiencia}</div>}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => setSelected(u)}
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
                                        {/* <img src={avatarFor(u.correo)} alt="avatar" className="w-10 h-10 rounded-full" /> */}
                                        <img src={profileSrc} alt="avatar" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <div className="font-medium">{u.nombre} {u.apellido}</div>
                                            <div className="text-xs text-gray-500">{u.rol}</div>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="text-sm">{u.telefono}</div>
                                        <div className="text-sm text-gray-500">{u.correo}</div>
                                    </td>
                                    <td className="p-3 text-sm text-gray-600">{u.direccion}</td>
                                    <td className="p-3">
                                        <button onClick={() => setSelected(u)} className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm">Ver</button>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 relative">
                        <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setSelected(null)}>
                            <X />
                        </button>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="w-full sm:w-40 flex-shrink-0">
                                {/* <img src={avatarFor(selected.correo)} alt="avatar" className="w-40 h-40 rounded-xl object-cover" /> */}
                                <img src={profileSrc} alt="avatar" className="w-40 h-40 rounded-xl object-cover" />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-2xl font-semibold">{selected.nombre} {selected.apellido}</h3>
                                <p className="text-sm text-gray-500 mb-4">{selected.rol}</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <div className="text-xs text-gray-400">Teléfono</div>
                                        <div className="font-medium">{selected.telefono}</div>
                                    </div>

                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <div className="text-xs text-gray-400">Correo</div>
                                        <div className="font-medium">{selected.correo}</div>
                                    </div>

                                    <div className="p-3 bg-gray-50 rounded-lg sm:col-span-2">
                                        <div className="text-xs text-gray-400">Dirección</div>
                                        <div className="font-medium">{selected.direccion}</div>
                                    </div>

                                    {selected.descripcion && (
                                        <div className="p-3 bg-gray-50 rounded-lg sm:col-span-2">
                                            <div className="text-xs text-gray-400">Descripción</div>
                                            <div className="font-medium">{selected.descripcion}</div>
                                        </div>
                                    )}

                                    {selected.experiencia && (
                                        <div className="p-3 bg-gray-50 rounded-lg sm:col-span-2">
                                            <div className="text-xs text-gray-400">Experiencia</div>
                                            <div className="font-medium">{selected.experiencia}</div>
                                        </div>
                                    )}

                                    {selected.matricula && (
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="text-xs text-gray-400">Matrícula</div>
                                            <div className="font-medium">{selected.matricula}</div>
                                        </div>
                                    )}

                                    {selected.cvPdf && (
                                        <div className="p-3 bg-gray-50 rounded-lg sm:col-span-2 flex items-center gap-2">
                                            <FileText className="w-5 h-5" />
                                            <a href={selected.cvPdf} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver CV PDF</a>
                                        </div>
                                    )}

                                    <div className="p-3 bg-gray-50 rounded-lg sm:col-span-2">
                                        <div className="text-xs text-gray-400">ID</div>
                                        <div className="font-medium">{selected.id}</div>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button className="px-4 py-2 rounded-lg bg-green-600 text-white">Contactar</button>
                                    <button className="px-4 py-2 rounded-lg bg-gray-200" onClick={() => setSelected(null)}>Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export const sampleUsers: UserType[] =[
  { id: 1, nombre: "Juan", apellido: "Martinez", telefono: "+591 62335978", direccion: "Calle 50", correo: "user1@gmail.com", rol: "AGENTE_INMOBILIARIO" },
  { id: 2, nombre: "Laura", apellido: "Diaz", telefono: "+591 67570038", direccion: "Calle 50", correo: "user2@gmail.com", rol: "AGENTE_INMOBILIARIO", descripcion: "Especialista en ventas residenciales", experiencia: "5 años de experiencia en bienes raíces", matricula: "MAT-15872", cvPdf: "/cvs/user2.pdf" },
  { id: 3, nombre: "Mago", apellido: "Diaz", telefono: "+591 60247933", direccion: "Calle 25", correo: "user3@gmail.com", rol: "AGENTE_INMOBILIARIO", descripcion: "Consultor inmobiliario senior", experiencia: "3 años de experiencia en ventas", matricula: "MAT-64192", cvPdf: "/cvs/user3.pdf" },
  { id: 4, nombre: "Luis", apellido: "Perez", telefono: "+591 76675692", direccion: "Calle 52", correo: "user4@gmail.com", rol: "AGENTE_INMOBILIARIO" },
  { id: 5, nombre: "El", apellido: "Lopez", telefono: "+591 73522888", direccion: "Calle 16", correo: "user5@gmail.com", rol: "AGENTE_INMOBILIARIO" },
  { id: 6, nombre: "Maria", apellido: "Martinez", telefono: "+591 74563812", direccion: "Calle 58", correo: "user6@gmail.com", rol: "AGENTE_INMOBILIARIO" },
  { id: 7, nombre: "Sofia", apellido: "Fernandez", telefono: "+591 69529412", direccion: "Calle 77", correo: "user7@gmail.com", rol: "AGENTE_INMOBILIARIO", descripcion: "Experto en propiedades comerciales", experiencia: "5 años de experiencia en bienes raíces", matricula: "MAT-98915", cvPdf: "/cvs/user7.pdf" },
  { id: 8, nombre: "Juan", apellido: "789", telefono: "+591 78233703", direccion: "Calle 95", correo: "user8@gmail.com", rol: "AGENTE_INMOBILIARIO", descripcion: "Especialista en ventas residenciales", experiencia: "10 años en el sector inmobiliario", matricula: "MAT-60170", cvPdf: "/cvs/user8.pdf" },
  { id: 9, nombre: "Carlos", apellido: "Gomez", telefono: "+591 66484625", direccion: "Calle 50", correo: "user9@gmail.com", rol: "AGENTE_INMOBILIARIO" },
  { id: 10, nombre: "Luis", apellido: "Diaz", telefono: "+591 69058589", direccion: "Calle 18", correo: "user10@gmail.com", rol: "AGENTE_INMOBILIARIO" },
  { id: 11, nombre: "Pedro", apellido: "789", telefono: "+591 67235834", direccion: "Calle 38", correo: "user11@gmail.com", rol: "AGENTE_INMOBILIARIO", descripcion: "Especialista en ventas residenciales", experiencia: "7 años asesorando AGENTE_INMOBILIARIOs", matricula: "MAT-67502", cvPdf: "/cvs/user11.pdf" },
  { id: 12, nombre: "Luis", apellido: "Carpio", telefono: "+591 72484900", direccion: "Calle 1", correo: "user12@gmail.com", rol: "AGENTE_INMOBILIARIO" },
  { id: 13, nombre: "Carlos", apellido: "789", telefono: "+591 69448900", direccion: "Calle 41", correo: "user13@gmail.com", rol: "AGENTE_INMOBILIARIO" },
  { id: 14, nombre: "Luis", apellido: "Gomez", telefono: "+591 63515527", direccion: "Calle 14", correo: "user14@gmail.com", rol: "AGENTE_INMOBILIARIO" },
  { id: 15, nombre: "Sofia", apellido: "Lopez", telefono: "+591 64154606", direccion: "Calle 85", correo: "user15@gmail.com", rol: "AGENTE_INMOBILIARIO", descripcion: "Experto en propiedades comerciales", experiencia: "7 años asesorando AGENTE_INMOBILIARIs", matricula: "MAT-78341", cvPdf: "/cvs/user15.pdf" },
  { id: 16, nombre: "Carlos", apellido: "Gomez", telefono: "+591 79162021", direccion: "Calle 90", correo: "user16@gmail.com", rol: "AGENTE_INMOBILIARIO" },
  { id: 17, nombre: "Sofia", apellido: "789", telefono: "+591 60424688", direccion: "Calle 81", correo: "user17@gmail.com", rol: "AGENTE_INMOBILIARIO", descripcion: "Experto en propiedades comerciales", experiencia: "5 años de experiencia en bienes raíces", matricula: "MAT-80115", cvPdf: "/cvs/user17.pdf" },
  { id: 18, nombre: "Sofia", apellido: "Fernandez", telefono: "+591 73585950", direccion: "Calle 25", correo: "user18@gmail.com", rol: "AGENTE_INMOBILIARIO" },
  { id: 19, nombre: "Mago", apellido: "Fernandez", telefono: "+591 68645269", direccion: "Calle 97", correo: "user19@gmail.com", rol: "AGENTE_INMOBILIARIO", descripcion: "Agente confiable con experiencia", experiencia: "10 años en el sector inmobiliario", matricula: "MAT-99239", cvPdf: "/cvs/user19.pdf" },
  { id: 20, nombre: "Maria", apellido: "Fernandez", telefono: "+591 61376266", direccion: "Calle 97", correo: "user20@gmail.com", rol: "AGENTE_INMOBILIARIO" }
];


