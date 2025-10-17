// publicar/components/CasaFields.tsx

import { PropertyFormData } from '../types/property.types';
import ToggleSwitch from './ToggleSwitch';
import ServiciosSelector from './ServiciosSelector';

interface CasaFieldsProps {
  formData: PropertyFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggle: (field: keyof PropertyFormData) => void;
  onServiciosChange: (ids: number[]) => void;
}

export default function CasaFields({ formData, onChange, onToggle, onServiciosChange }: CasaFieldsProps) {
  return (
    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h3 className="font-semibold text-gray-900 mb-3">Detalles de la casa</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de dormitorios *
          </label>
          <input
            type="number"
            name="dormitorios"
            value={formData.dormitorios}
            onChange={onChange}
            placeholder="Ej: 3"
            required
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de baños *
          </label>
          <input
            type="number"
            name="banos"
            value={formData.banos}
            onChange={onChange}
            placeholder="Ej: 2"
            required
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Número de pisos *
        </label>
        <input
          type="number"
          name="numPisos"
          value={formData.numPisos}
          onChange={onChange}
          placeholder="Ej: 2"
          required
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ToggleSwitch
          label="¿Tiene garaje?"
          checked={formData.garaje}
          onChange={() => onToggle('garaje')}
        />
        <ToggleSwitch
          label="¿Tiene patio?"
          checked={formData.patio}
          onChange={() => onToggle('patio')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ToggleSwitch
          label="¿Está amoblado?"
          checked={formData.amoblado}
          onChange={() => onToggle('amoblado')}
        />
        <ToggleSwitch
          label="¿Tiene sótano?"
          checked={formData.sotano}
          onChange={() => onToggle('sotano')}
        />
      </div>
      {/* Selector de Servicios */}
      <div className="pt-4 border-t border-blue-300">
        <ServiciosSelector
          selectedIds={formData.serviciosIds}
          onChange={onServiciosChange}
          color="blue"
        />
      </div>
    </div>
  );
}