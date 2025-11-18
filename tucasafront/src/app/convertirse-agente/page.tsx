"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { URL_BACKEND } from "@/config/constants";
import { useToast } from "@/components/Toast";

export default function ConvertirseAgentePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [descripcion, setDescripcion] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [matricula, setMatricula] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError, showInfo } = useToast();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cv) return showInfo("Debes adjuntar tu CV en PDF");
    if (!user)return router.push("/login");

    const formData = new FormData();
    formData.append("usuarioId", String(user.id));
    formData.append("descripcion", descripcion);
    formData.append("experiencia", experiencia);
    formData.append("matricula", matricula);
    formData.append("cv", cv);

    try {
      setLoading(true);

      const res = await fetch(`${URL_BACKEND}/api/agentes/solicitar`, {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      console.log("Respuesta del servidor:", text);

      if (!res.ok) throw new Error(text || "Error desconocido al enviar la solicitud");

      showSuccess("Solicitud enviada correctamente. Un administrador la revisará.");

      setDescripcion("");
      setExperiencia("");
      setMatricula("");
      setCv(null);

      setTimeout(() => router.push("/ventas"), 1000);

    } catch (error: any) {
      console.error("Error al enviar solicitud:", error);
      showError("Error al enviar solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 mt-10 relative">

      <h2 className="text-xl font-bold text-center text-blue-600 mb-4">
        Solicitud para Convertirse en Agente
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="font-medium">Descripción personal</label>
        <textarea
          className="border rounded-md p-2"
          rows={3}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />

        <label className="font-medium">Experiencia</label>
        <textarea
          className="border rounded-md p-2"
          rows={2}
          value={experiencia}
          onChange={(e) => setExperiencia(e.target.value)}
          required
        />

        <label className="font-medium">Matrícula o licencia (opcional)</label>
        <input
          type="text"
          className="border rounded-md p-2"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
        />

        <label className="font-medium">Sube tu CV en formato PDF</label>
        <input
          type="file"
          accept="application/pdf"
          className="border rounded-md p-2"
          onChange={(e) => setCv(e.target.files?.[0] || null)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Enviar solicitud"}
        </button>
      </form>
    </div>
  );
}
