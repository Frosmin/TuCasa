import { PropertyFormData } from '../types/property.types';
import ToggleSwitch from './ToggleSwitch';

interface LoteFieldsProps {
    formData: PropertyFormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onToggle: (field: keyof PropertyFormData) => void;
}

export default function LoteFields({ formData, onChange, onToggle }: LoteFieldsProps) {
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

        </div>
    );
}