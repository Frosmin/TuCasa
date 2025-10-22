// app/mapa/page.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { 
  MapPin, 
  Home, 
  Store, 
  Square, 
  Building2, 
  Bed, 
  Bath, 
  Car, 
  Trees, 
  Sofa, 
  Package,
  Maximize,
  Layers,
  AlertCircle
} from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

interface Servicio {
  id: number;
  nombre: string;
}

interface Inmueble {
  id: number;
  direccion: string;
  latitud: number;
  longitud: number;
  superficie: number;
  idPropietario: number;
  tipo: 'CASA' | 'TIENDA' | 'LOTE' | 'DEPARTAMENTO';
  descripcion: string;
  servicios: Servicio[];
  activo: boolean;
  numDormitorios?: number;
  numBanos?: number;
  numPisos?: number;
  garaje?: boolean;
  patio?: boolean;
  amoblado?: boolean;
  sotano?: boolean;
  numAmbientes?: number;
  banoPrivado?: boolean;
  deposito?: boolean;
}

type TipoInmueble = 'CASA' | 'TIENDA' | 'LOTE' | 'DEPARTAMENTO';

const TIPO_CONFIG = {
  CASA: {
    icon: Home,
    color: '#3b82f6',
    label: 'Casas'
  },
  TIENDA: {
    icon: Store,
    color: '#f59e0b',
    label: 'Tiendas'
  },
  DEPARTAMENTO: {
    icon: Building2,
    color: '#8b5cf6',
    label: 'Deptos'
  },
  LOTE: {
    icon: Square,
    color: '#10b981',
    label: 'Lotes'
  }
} as const;

const COCHABAMBA_CENTER = { lat: -17.3895, lng: -66.1568 };
const API_BASE_URL = 'http://localhost:8000/tucasabackend/api';

export default function MapaPage() {
  const { isLoaded, loadError } = useGoogleMaps();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const initAttemptedRef = useRef(false);

  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('satellite');
  const [mapInitialized, setMapInitialized] = useState(false);
  const [domReady, setDomReady] = useState(false);

  // Cargar inmuebles desde la API
  useEffect(() => {
    const fetchInmuebles = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/inmueble`);
        const result = await response.json();

        if (result.error) {
          throw new Error(result.message);
        }

        const validInmuebles = result.data.filter(
          (inmueble: Inmueble) => 
            inmueble.latitud !== 0 && 
            inmueble.longitud !== 0 &&
            inmueble.activo
        );

        setInmuebles(validInmuebles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar inmuebles');
      } finally {
        setLoading(false);
      }
    };

    fetchInmuebles();
  }, []);

  // Asegurar que el DOM esté listo
  useEffect(() => {
    if (mapRef.current) {
      setDomReady(true);
    }
  }, []);

  // Inicializar el mapa
  useEffect(() => {
    if (!isLoaded || !domReady || !mapRef.current || mapInstanceRef.current || initAttemptedRef.current) {
      return;
    }

    initAttemptedRef.current = true;

    const timeoutId = setTimeout(() => {
      try {
        if (!mapRef.current) return;

        const map = new google.maps.Map(mapRef.current, {
          center: COCHABAMBA_CENTER,
          zoom: 13,
          mapTypeId: 'satellite',
          mapId: 'DEMO_MAP_ID',
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        });

        mapInstanceRef.current = map;
        infoWindowRef.current = new google.maps.InfoWindow();
        setMapInitialized(true);
      } catch (err) {
        console.error('Error al inicializar el mapa:', err);
        setError('Error al inicializar el mapa');
        initAttemptedRef.current = false;
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [isLoaded, domReady]);

  // Crear marcadores para cada inmueble
  useEffect(() => {
    if (!mapInitialized || !mapInstanceRef.current || inmuebles.length === 0) {
      return;
    }

    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => {
      marker.map = null;
    });
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();

    inmuebles.forEach((inmueble) => {
      const position = { lat: inmueble.latitud, lng: inmueble.longitud };
      const config = TIPO_CONFIG[inmueble.tipo];
      
      // Crear elemento del marcador usando Lucide icons
      const markerElement = createMarkerElement(config.icon, config.color);

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position,
        map: mapInstanceRef.current,
        title: inmueble.direccion,
        content: markerElement,
      });

      marker.addListener('click', () => {
        if (infoWindowRef.current && mapInstanceRef.current) {
          infoWindowRef.current.setContent(createInfoWindowContent(inmueble));
          infoWindowRef.current.open({
            map: mapInstanceRef.current,
            anchor: marker,
          });
        }
      });

      markersRef.current.push(marker);
      bounds.extend(position);
    });

    if (inmuebles.length > 0) {
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [inmuebles, mapInitialized]);

  // Crear elemento del marcador con Lucide icon
  const createMarkerElement = (Icon: typeof Home, color: string): HTMLDivElement => {
    const markerDiv = document.createElement('div');
    markerDiv.style.cssText = `
      width: 48px;
      height: 48px;
      background: ${color};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.2s;
    `;

    const iconContainer = document.createElement('div');
    iconContainer.style.cssText = `
      transform: rotate(45deg);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const iconSvg = ReactDOMServer.renderToString(<Icon size={20} />);
    iconContainer.innerHTML = iconSvg;
    markerDiv.appendChild(iconContainer);

    markerDiv.addEventListener('mouseenter', () => {
      markerDiv.style.transform = 'rotate(-45deg) scale(1.1)';
    });

    markerDiv.addEventListener('mouseleave', () => {
      markerDiv.style.transform = 'rotate(-45deg) scale(1)';
    });

    return markerDiv;
  };

  // Crear contenido del InfoWindow con Lucide icons
  const createInfoWindowContent = (inmueble: Inmueble): string => {
    const config = TIPO_CONFIG[inmueble.tipo];
    
    const renderIcon = (Icon: typeof Bed) => 
      ReactDOMServer.renderToString(<Icon size={14} color="#6b7280" />);

    let amenitiesHtml = '';

    if (inmueble.tipo === 'CASA') {
      amenitiesHtml = `
        ${inmueble.numDormitorios ? `
          <div style="display: flex; align-items: center; gap: 6px;">
            ${renderIcon(Bed)}
            <span>${inmueble.numDormitorios} dorm.</span>
          </div>
        ` : ''}
        ${inmueble.numBanos ? `
          <div style="display: flex; align-items: center; gap: 6px;">
            ${renderIcon(Bath)}
            <span>${inmueble.numBanos} baños</span>
          </div>
        ` : ''}
        ${inmueble.garaje ? `
          <div style="display: flex; align-items: center; gap: 6px;">
            ${renderIcon(Car)}
            <span>Garaje</span>
          </div>
        ` : ''}
        ${inmueble.patio ? `
          <div style="display: flex; align-items: center; gap: 6px;">
            ${renderIcon(Trees)}
            <span>Patio</span>
          </div>
        ` : ''}
      `;
    } else if (inmueble.tipo === 'DEPARTAMENTO') {
      amenitiesHtml = `
        ${inmueble.numDormitorios ? `
          <div style="display: flex; align-items: center; gap: 6px;">
            ${renderIcon(Bed)}
            <span>${inmueble.numDormitorios} dorm.</span>
          </div>
        ` : ''}
        ${inmueble.numBanos ? `
          <div style="display: flex; align-items: center; gap: 6px;">
            ${renderIcon(Bath)}
            <span>${inmueble.numBanos} baños</span>
          </div>
        ` : ''}
        ${inmueble.amoblado ? `
          <div style="display: flex; align-items: center; gap: 6px;">
            ${renderIcon(Sofa)}
            <span>Amoblado</span>
          </div>
        ` : ''}
        ${inmueble.banoPrivado ? `
          <div style="display: flex; align-items: center; gap: 6px;">
            ${renderIcon(Bath)}
            <span>Baño privado</span>
          </div>
        ` : ''}
      `;
    } else if (inmueble.tipo === 'TIENDA') {
      amenitiesHtml = `
        ${inmueble.numAmbientes ? `
          <div style="display: flex; align-items: center; gap: 6px;">
            ${renderIcon(Square)}
            <span>${inmueble.numAmbientes} ambientes</span>
          </div>
        ` : ''}
        ${inmueble.deposito ? `
          <div style="display: flex; align-items: center; gap: 6px;">
            ${renderIcon(Package)}
            <span>Depósito</span>
          </div>
        ` : ''}
      `;
    }

    return `
      <div style="padding: 16px; max-width: 300px; font-family: system-ui, -apple-system, sans-serif;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
          <div style="background: ${config.color}; color: white; padding: 6px 12px; border-radius: 6px; 
                      font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
            ${inmueble.tipo}
          </div>
        </div>
        
        <h3 style="margin: 0 0 8px 0; font-size: 17px; font-weight: 600; color: #111827; line-height: 1.4;">
          ${inmueble.direccion}
        </h3>
        
        <p style="margin: 0 0 16px 0; font-size: 14px; color: #6b7280; line-height: 1.5;">
          ${inmueble.descripcion || 'Sin descripción'}
        </p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; 
                    font-size: 13px; color: #4b5563;">
          ${amenitiesHtml}
          <div style="display: flex; align-items: center; gap: 6px;">
            ${renderIcon(Maximize)}
            <span>${inmueble.superficie} m²</span>
          </div>
        </div>
        
        <a href="/oferta/${inmueble.id}" 
           style="display: block; text-align: center; background: ${config.color}; color: white; 
                  padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 500;
                  font-size: 14px; transition: opacity 0.2s;"
           onmouseover="this.style.opacity='0.9'"
           onmouseout="this.style.opacity='1'">
          Ver detalles
        </a>
      </div>
    `;
  };

  const toggleMapType = () => {
    if (!mapInstanceRef.current) return;

    const newType = mapType === 'roadmap' ? 'satellite' : 'roadmap';
    setMapType(newType);
    mapInstanceRef.current.setMapTypeId(newType);
  };

  // Pantalla de error de carga de Google Maps
  if (loadError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-red-50">
        <div className="text-center text-red-600 p-8 max-w-md">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" />
          <p className="font-semibold text-xl mb-2">Error al cargar Google Maps</p>
          <p className="text-sm mt-2 text-red-500">{loadError}</p>
          <p className="text-xs mt-4 text-gray-600">
            Verifica que NEXT_PUBLIC_GOOGLE_MAPS_API_KEY esté configurada correctamente
          </p>
        </div>
      </div>
    );
  }

  // Pantalla de carga
  if (!isLoaded || loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold text-lg">Cargando mapa y propiedades...</p>
          <p className="text-sm text-gray-500 mt-2">
            {!isLoaded ? 'Inicializando Google Maps...' : 'Obteniendo propiedades...'}
          </p>
        </div>
      </div>
    );
  }

  // Pantalla de error
  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-red-50">
        <div className="text-center text-red-600 p-8 max-w-md">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" />
          <p className="font-semibold text-xl mb-2">Error al cargar propiedades</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Controles del mapa */}
      <div className="fixed top-44 left-4 z-50 flex flex-col gap-3">
        {/* Botón de cambio de vista */}
        <button
          onClick={toggleMapType}
          className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-4 rounded-lg shadow-lg 
                     flex items-center gap-2 transition-all duration-200 hover:shadow-xl"
          aria-label={mapType === 'roadmap' ? 'Cambiar a vista satélite' : 'Cambiar a vista de mapa'}
        >
          <Layers className="w-5 h-5" />
          {mapType === 'roadmap' ? 'Vista Satélite' : 'Vista Mapa'}
        </button>

        {/* Leyenda de tipos de inmuebles */}
        <div className="bg-white rounded-lg shadow-lg px-4 py-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Tipos de Propiedades
          </h3>
          <div className="flex flex-col gap-2.5">
            {Object.entries(TIPO_CONFIG).map(([tipo, config]) => {
              const count = inmuebles.filter(i => i.tipo === tipo).length;
              const Icon = config.icon;
              
              return (
                <div key={tipo} className="flex items-center gap-2.5">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: config.color }}
                  >
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {config.label} ({count})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenedor del mapa */}
      <div
        ref={(el) => {
          mapRef.current = el;
          if (el && !domReady) {
            setDomReady(true);
          }
        }}
        className="fixed inset-0 w-screen h-screen"
        style={{ background: '#e5e7eb' }}
      />
    </>
  );
}