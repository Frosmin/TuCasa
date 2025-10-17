import { PropertyFormData } from '../types/property.types';
import ServiciosSelector from './ServiciosSelector';
import ToggleSwitch from './ToggleSwitch';

interface DepartamentoFieldsProps {
  formData: PropertyFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggle: (field: keyof PropertyFormData) => void;
}

export default function DepartamentoFields({ formData, onChange, onToggle }: DepartamentoFieldsProps) {
  return (
    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h3 className="font-semibold text-gray-900 mb-3">Detalles del departamento</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Piso *</label>
          <input
            type="number"
            name="piso"
            value={formData.piso}
            onChange={onChange}
            placeholder="Ej: 8"
            required
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Superficie interna (m²) *</label>
          <input
            type="number"
            name="superficieInterna"
            value={formData.superficieInterna}
            onChange={onChange}
            placeholder="Ej: 105"
            required
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Expensas *</label>
          <input
            type="string"
            name="montoExpensas"
            value={formData.montoExpensas}
            onChange={onChange}
            placeholder="Ej: 450"
            required
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ToggleSwitch label="Ascensor" checked={formData.ascensor} onChange={() => onToggle('ascensor')} />
        <ToggleSwitch label="Balcón" checked={formData.balcon} onChange={() => onToggle('balcon')} />
        <ToggleSwitch label="Parqueo" checked={formData.parqueo} onChange={() => onToggle('parqueo')} />
        <ToggleSwitch label="Mascotas Permitidas" checked={formData.mascotasPermitidas} onChange={() => onToggle('mascotasPermitidas')} />
        <ToggleSwitch label="Amoblado" checked={formData.amoblado} onChange={() => onToggle('amoblado')} />
      </div>
    </div>
  );
}