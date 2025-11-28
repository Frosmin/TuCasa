"use client";

import { useState } from "react";
import SelectorInmueble from "./components/SelectorInmueble";
import { TipoInmueble } from "./types/types";
import MiContacto from "./components/MiContacto";
import LocationPicker from "../publicar/components/LocationPicker";
import { useAuth } from "@/context/AuthContext";
import { URL_BACKEND } from "@/config/constants";
import { useToast } from "@/components/Toast";
import { useRouter } from "next/navigation";

const Avaluo = () => {
  const [type, setType] = useState<TipoInmueble>("CASA");
  const [contact, setContact] = useState<string>("");
  // Location
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [zona, setZona] = useState<string>("");
  const router = useRouter();
  const onLocationChange = (lat: number, lng: number) => {
    setLatitude(lat.toString());
    setLongitude(lng.toString());
  };
  //
  const { user, token } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!contact || !latitude || !longitude) {
      showError(
        "Por favor completa todos los campos y selecciona una ubicacion."
      );
      return;
    }
    setIsSubmitting(true);

    const payload = {
      tipoInmueble: type,
      celularContacto: contact,
      latitud: parseFloat(latitude),
      longitud: parseFloat(longitude),
      direccion: "av random",
    };

    try {
      const response = await fetch(`${URL_BACKEND}/api/oferta/avaluo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al enviar la solicitud");
      }

      showSuccess(
        "Solicitud envviada! Un agente se pondra en contacto contigo."
      );
      router.replace("/");

      setContact("");
    } catch (error: any) {
      console.error(error);
      showError(error.message || "Ocurrio un error al procesar tu solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col justify-center items-center h-full">
        <div className="grid grid-cols-2 grid-rows-[1fr_2fr_1fr] gap-4">
          <div className="col-span-2 flex justify-center items-center">
            <h1 className="font-extrabold text-4xl">Solicitar Avaluo</h1>
          </div>

          <div className="flex flex-col justify-center m-4 h-full">
            <h2 className="text-2xl font-bold mb-1">Tipo de inmueble</h2>
            <div className="m-3">
              <SelectorInmueble setType={setType} value={type} />
            </div>
            <h2 className="text-2xl font-bold">Contacto</h2>
            <div className="m-3">
              <MiContacto setValue={setContact} value={contact} />
            </div>
          </div>
          <div className="row-span-2 m-4">
            <LocationPicker
              latitude={latitude}
              longitude={longitude}
              onChange={onLocationChange}
              onAddressChange={setAddress}
              onZonaChange={setZona}
            />
          </div>
        </div>
        <div className="mt-8 w-full max-w-md px-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 text-white font-bold text-lg rounded-xl shadow-lg transform transition-all duration-200
              ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] hover:shadow-xl"
              }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Enviando...</span>
              </div>
            ) : (
              "Solicitar Avalúo"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Avaluo;
