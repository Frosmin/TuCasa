"use client";

import React from "react";

interface Props {
  solicitud: any;
  onAprobar: () => void;
  onRechazar: () => void;
}

export default function SolicitudCard({ solicitud, onAprobar, onRechazar }: Props) {
  return (
    <div className="border rounded-md p-4 shadow-md flex flex-col gap-2">
      <p><strong>Usuario:</strong> {solicitud.usuario.nombre} {solicitud.usuario.apellido}</p>
      <p><strong>Correo:</strong> {solicitud.usuario.correo}</p>
      <p><strong>Descripción:</strong> {solicitud.descripcion}</p>
      <p><strong>Experiencia:</strong> {solicitud.experiencia}</p>
      {solicitud.matricula && <p><strong>Matrícula:</strong> {solicitud.matricula}</p>}
      <p>
        <strong>CV:</strong>{" "}
        <a href={`${solicitud.cvPath}`} target="_blank" className="text-blue-600 underline">
          Ver PDF
        </a>
      </p>
      <div className="flex gap-2 mt-2">
        <button onClick={onAprobar} className="bg-green-600 text-white px-3 py-1 rounded-md">Aprobar</button>
        <button onClick={onRechazar} className="bg-red-600 text-white px-3 py-1 rounded-md">Rechazar</button>
      </div>
    </div>
  );
}
