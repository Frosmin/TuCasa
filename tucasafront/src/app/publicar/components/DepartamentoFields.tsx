import { PropertyFormData } from '../types/property.types';
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
            type="text"
            name="piso"
            value={formData.piso}
            onChange={onChange}
            placeholder="Ej: 5"
            required
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Expensas *</label>
          <input
            type="text"
            name="expensas"
            value={formData.expensas}
            onChange={onChange}
            placeholder="Ej: 200"
            required
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ToggleSwitch label="Tiene Ascensor?" checked={formData.ascensor} onChange={() => onToggle('ascensor')} />
        <ToggleSwitch label="Tiene Balcón?" checked={formData.balcon} onChange={() => onToggle('balcon')} />
        <ToggleSwitch label="Tiene Área común?" checked={formData.areaComun} onChange={() => onToggle('areaComun')} />
        <ToggleSwitch label="Tiene Seguridad?" checked={formData.seguridad} onChange={() => onToggle('seguridad')} />
        <ToggleSwitch label="Tiene Parqueo?" checked={formData.parqueo} onChange={() => onToggle('parqueo')} />
        <ToggleSwitch label="Mascotas permitidas?" checked={formData.mascotasPermitidas} onChange={() => onToggle('mascotasPermitidas')} />
        <ToggleSwitch label="Vista panorámica?" checked={formData.vistaPanoramica} onChange={() => onToggle('vistaPanoramica')} />
        <ToggleSwitch label="Portero automático?" checked={formData.porteroAutomatico} onChange={() => onToggle('porteroAutomatico')} />
        <ToggleSwitch label="Terraza compartida?" checked={formData.terrazaCompartida} onChange={() => onToggle('terrazaCompartida')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Antigüedad del edificio *</label>
          <input
            type="text"
            name="antiguedadEdificio"
            value={formData.antiguedadEdificio}
            onChange={onChange}
            placeholder="Ej: 10 años"
            required
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">N° departamentos por piso *</label>
          <input
            type="text"
            name="numDepartamentosPorPiso"
            value={formData.numDepartamentosPorPiso}
            onChange={onChange}
            placeholder="Ej: 4"
            required
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
}