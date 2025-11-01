// publicar/components/ServiciosSelector.tsx
'use client';

import { useEffect, useState } from 'react';
import { Zap, Droplet, Flame, Wifi, Trash2, Shield, Check } from 'lucide-react';

interface Servicio {
  id: number;
  nombre: string;
}

interface ServiciosSelectorProps {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  color?: 'blue' | 'purple';
}

const servicioIcons: Record<number, any> = {
  1: Zap,        
  2: Droplet,    
  3: Flame,      
  4: Wifi,       
  5: Trash2,     
  6: Shield,     
};

export default function ServiciosSelector({ 
  selectedIds, 
  onChange, 
  color = 'blue' 
}: ServiciosSelectorProps) {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await fetch(`${URL_BACKEND}/api/servicio');
        const result = await response.json();
        if (result.error === false && result.data) {
          setServicios(result.data);
        }
      } catch (error) {
        console.error('Error al cargar servicios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();
  }, []);

  const toggleServicio = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(serviceId => serviceId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const colorClasses = color === 'purple' 
    ? {
        selected: 'border-purple-500 bg-purple-50 text-purple-700',
        hover: 'hover:border-purple-300 hover:bg-purple-50',
        icon: 'text-purple-600'
      }
    : {
        selected: 'border-blue-500 bg-blue-50 text-blue-700',
        hover: 'hover:border-blue-300 hover:bg-blue-50',
        icon: 'text-blue-600'
      };

  if (loading) {
    return (
      <div className="text-center py-4 text-gray-500">
        Cargando servicios...
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Servicios disponibles
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {servicios.map((servicio) => {
          const isSelected = selectedIds.includes(servicio.id);
          const Icon = servicioIcons[servicio.id] || Shield;
          
          return (
            <button
              key={servicio.id}
              type="button"
              onClick={() => toggleServicio(servicio.id)}
              className={`relative flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-300 ${
                isSelected
                  ? colorClasses.selected
                  : `border-gray-300 bg-white text-gray-700 ${colorClasses.hover}`
              }`}
            >
              <Icon className={`w-5 h-5 ${isSelected ? colorClasses.icon : 'text-gray-500'}`} />
              <span className="text-sm font-medium">{servicio.nombre}</span>
              {isSelected && (
                <div className={`absolute -top-1 -right-1 ${color === 'purple' ? 'bg-purple-500' : 'bg-blue-500'} text-white rounded-full p-0.5`}>
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}