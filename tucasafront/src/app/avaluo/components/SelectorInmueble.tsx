import { TipoInmueble } from "../types/types";
import React from "react";

interface SelectorProps {
  setType: React.Dispatch<React.SetStateAction<TipoInmueble>>;
  value: TipoInmueble;
}

const SelectorInmueble = ({ setType, value }: SelectorProps) => {
  const tipos = ["CASA", "DEPARTAMENTO", "LOTE", "TIENDA"];
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value as TipoInmueble);
  };
  return (
    <select
      value={value}
      onChange={handleChange}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg 
               focus:ring-2 focus:ring-blue-500 focus:border-transparent 
               outline-none transition-all appearance-none"
    >
      {tipos.map((tipo) => (
        <option key={tipo} value={tipo}>
          {tipo}
        </option>
      ))}
    </select>
  );
};

export default SelectorInmueble;
