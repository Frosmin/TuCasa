// vender/components/TiendaFields.tsx

import { PropertyFormData } from '../types/property.types';
import ToggleSwitch from './ToggleSwitch';

interface TiendaFieldsProps {
  formData: PropertyFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggle: (field: keyof PropertyFormData) => void;
}

export default function TiendaFields({ formData, onChange, onToggle }: TiendaFieldsProps) {
  return (
    <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
      <h3 className="font-semibold text-gray-900 mb-3">Detalles de la tienda</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Número de ambientes *
        </label>
        <input
          type="number"
          name="numAmbientes"
          value={formData.numAmbientes}
          onChange={onChange}
          placeholder="Ej: 1"
          required
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ToggleSwitch
          label="¿Tiene depósito?"
          checked={formData.deposito}
          onChange={() => onToggle('deposito')}
          color="purple"
        />
        <ToggleSwitch
          label="¿Tiene baño privado?"
          checked={formData.banoPrivado}
          onChange={() => onToggle('banoPrivado')}
          color="purple"
        />
      </div>
    </div>
  );
}