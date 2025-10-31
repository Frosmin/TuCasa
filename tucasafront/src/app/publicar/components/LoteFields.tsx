import { PropertyFormData } from '../types/property.types';
import ToggleSwitch from './ToggleSwitch';
import ServiciosSelector from './ServiciosSelector';
interface LoteFieldsProps {
    formData: PropertyFormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onToggle: (field: keyof PropertyFormData) => void;
     onServiciosChange: (ids: number[]) => void;
}

export default function LoteFields({ formData,onToggle , onChange, onServiciosChange }: LoteFieldsProps) {
    return (
        <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3">Detalles del Lote</h3>
            <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                    <ToggleSwitch
                        label="¿tiene muro perimetral?"
                        checked={formData.muroPerimetral}
                        onChange={() => onToggle('muroPerimetral')}
                    />
                </div>
            </div>

<div className="mt-4">
        <ServiciosSelector
          selectedIds={formData.serviciosIds} // ✅ usa el array del formulario
          onChange={onServiciosChange} // ✅ actualiza el formulario
        />
      </div>

        </div>
    );
}