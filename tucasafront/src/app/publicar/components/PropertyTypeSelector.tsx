// publicar/components/PropertyTypeSelector.tsx

import { PropertyType } from '../types/property.types';
import { PROPERTY_TYPES } from '../data/property.constants';

interface PropertyTypeSelectorProps {
  selectedType: PropertyType;
  onChange: (type: PropertyType) => void;
}

export default function PropertyTypeSelector({ selectedType, onChange }: PropertyTypeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {PROPERTY_TYPES.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all duration-300 font-medium ${
            selectedType === id
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
          }`}
        >
          <Icon className="w-5 h-5" />
          {label}
        </button>
      ))}
    </div>
  );
}