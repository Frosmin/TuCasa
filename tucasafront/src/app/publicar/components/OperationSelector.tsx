// publicar/components/OperationSelector.tsx
import { OperationType } from '../types/property.types';
import { OPERATION_TYPES } from '../data/property.constants';

interface OperationSelectorProps {
  onSelect: (operation: OperationType) => void;
}

export default function OperationSelector({ onSelect }: OperationSelectorProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-3xl w-full mx-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center">
            ¿Qué tipo de operación deseas realizar?
          </h1>
          <p className="text-gray-600 mb-10 text-center">
            Selecciona una opción para continuar
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {OPERATION_TYPES.map(({ id, label, description, icon: Icon, colorClass }) => (
              <button
                key={id}
                onClick={() => onSelect(id as OperationType)}
                className="group p-8 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 text-center data-[color=green]:hover:border-green-500 data-[color=green]:hover:bg-green-50 data-[color=purple]:hover:border-purple-500 data-[color=purple]:hover:bg-purple-50"
                data-color={colorClass}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${
                  colorClass === 'blue' ? 'bg-blue-100 group-hover:bg-blue-500' :
                  colorClass === 'green' ? 'bg-green-100 group-hover:bg-green-500' :
                  'bg-purple-100 group-hover:bg-purple-500'
                }`}>
                  <Icon className={`w-8 h-8 transition-colors ${
                    colorClass === 'blue' ? 'text-blue-600 group-hover:text-white' :
                    colorClass === 'green' ? 'text-green-600 group-hover:text-white' :
                    'text-purple-600 group-hover:text-white'
                  }`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{label}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}