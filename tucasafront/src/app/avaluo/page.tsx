"use client";

import { useState } from "react";
import SelectorInmueble from "./components/SelectorInmueble";
import { TipoInmueble } from "./types/types";
import MiContacto from "./components/MiContacto";
import LocationPicker from "../publicar/components/LocationPicker";

const Avaluo = () => {
  const [type, setType] = useState<TipoInmueble>("CASA");
  const [contact, setContact] = useState<string>("");
  // Location
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [zona, setZona] = useState<string>("");
  const onLocationChange = (lat: number, lng: number) => {
    console.log("CAMBIÓ LA UBICACIÓN", lat, lng);
    setLatitude(lat.toString());
    setLongitude(lng.toString());
  };
  //

  const jaja = () => {
    console.log("jaja");
  };

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="grid grid-cols-2 grid-rows-[1fr_2fr_1fr] gap-4">
        <div className="col-span-2 flex justify-center items-center">
          <h1 className="font-bold text-4xl">Solicitar Avaluo</h1>
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
      <div className="m-2">
        <button
          className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md"
          onClick={jaja}
        >
          Solicitar Avaluo
        </button>
      </div>
    </div>
  );
};

export default Avaluo;
