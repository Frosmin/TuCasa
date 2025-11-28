    import { URL_BACKEND } from "@/config/constants";

    export const updateEstadoAvaluo = async (id: string, nuevoEstado: string) => {
    const res = await fetch(`${URL_BACKEND}/api/oferta/avaluo/${id}/estado`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nuevoEstado }),
    });

    return await res.json();
    };
