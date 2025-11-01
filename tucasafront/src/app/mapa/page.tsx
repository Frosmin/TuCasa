'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import {
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
  AlertCircle,
  X,
  MapPinHouse,
  Circle
} from 'lucide-react';
import ReactDOMServer from 'react-dom/server';
import type { Inmueble, TipoPropiedad } from '@/models/Inmueble';
import type { Oferta } from '@/models/Oferta';


type TipoOperacion = 'TODOS' | 'VENTA' | 'ALQUILER' | 'ANTICRETICO';
const TIPO_CONFIG = {
  CASA: {
    icon: Home,
    label: 'Casas'
  },
  TIENDA: {
    icon: Store,
    label: 'Tiendas'
  },
  DEPARTAMENTO: {
    icon: Building2,
    label: 'Deptos'
  },
  LOTE: {
    icon: Square,
    label: 'Lotes'
  }
} as const;

const OPERACION_CONFIG = {
  TODOS: { color: '#fff', label: 'Todos', bgLight: '#f3f4f6' },
  VENTA: { color: '#3b82f6', label: 'Venta', bgLight: '#ecfdf5' },
  ALQUILER: { color: '#10b981', label: 'Alquiler', bgLight: '#eff6ff' },
  ANTICRETICO: { color: '#9810fa', label: 'Anticrético', bgLight: '#fffbeb' },
} as const;
const COCHABAMBA_CENTER = { lat: -17.3895, lng: -66.1568 };


export default function MapaPage() {
  const { isLoaded, loadError } = useGoogleMaps();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const initAttemptedRef = useRef(false);

  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('satellite');
  const [mapInitialized, setMapInitialized] = useState(false);
  const [domReady, setDomReady] = useState(false);

  // Estados de filtros
  const [tipoInmuebleSeleccionado, setTipoInmuebleSeleccionado] = useState<TipoPropiedad | ''>('DEPARTAMENTO');
  const [tipoOperacion, setTipoOperacion] = useState<TipoOperacion>('ALQUILER');

  // Cargar inmuebles desde la API
  useEffect(() => {
    const fetchInmuebles = async () => {
      try {
        const response = await fetch(`${URL_BACKEND}/oferta`);
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

        setOfertas(validInmuebles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar inmuebles');
      } finally {
        setLoading(false);
      }
    };

    fetchInmuebles();
  }, []);

  const ofertasFiltrados = useMemo(() => {
    return ofertas.filter(oferta => {

      if (tipoInmuebleSeleccionado && oferta.inmueble.tipo !== tipoInmuebleSeleccionado) {
        return false;
      }

      // Filtro por tipo de operación
      if (tipoOperacion !== 'TODOS') {

        const tieneOperacion = oferta.tipo === tipoOperacion

        if (!tieneOperacion) return false;
      }

      return true;
    });
  }, [ofertas, tipoInmuebleSeleccionado, tipoOperacion]);

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

  // Crear marcadores
  useEffect(() => {
    if (!mapInitialized || !mapInstanceRef.current || ofertasFiltrados.length === 0) {
      return;
    }

    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => {
      marker.map = null;
    });
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();

    ofertasFiltrados.forEach((oferta) => {
      const position = { lat: oferta.inmueble.latitud, lng: oferta.inmueble.longitud };
      const config = TIPO_CONFIG[oferta.inmueble.tipo];
      const operacionColor = OPERACION_CONFIG[oferta.tipo].color;
      const markerElement = createMarkerElement(config.icon, operacionColor);


      const marker = new google.maps.marker.AdvancedMarkerElement({
        position,
        map: mapInstanceRef.current,
        title: oferta.inmueble.direccion,
        content: markerElement,
      });

      marker.addListener('click', () => {
        if (infoWindowRef.current && mapInstanceRef.current) {
          infoWindowRef.current.setContent(createInfoWindowContent(oferta));
          infoWindowRef.current.open({
            map: mapInstanceRef.current,
            anchor: marker,
          });
        }
      });

      markersRef.current.push(marker);
      bounds.extend(position);
    });

    if (ofertasFiltrados.length > 0) {
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [ofertasFiltrados, mapInitialized]);

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

  const createInfoWindowContent = (oferta: Oferta): string => {
    const inmueble = oferta.inmueble;
    const tipoConfig = TIPO_CONFIG[inmueble.tipo];
    const operacionConfig = OPERACION_CONFIG[oferta.tipo];

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
    <div style="padding: 16px; max-width: 320px; font-family: system-ui, -apple-system, sans-serif;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
        <div style="background: ${operacionConfig.color}; color: white; padding: 4px 8px; border-radius: 4px; 
                    font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
          ${tipoConfig.label}
        </div>
        <div style="background: ${operacionConfig.bgLight}; color: ${operacionConfig.color}; padding: 4px 8px; border-radius: 4px; 
                    font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
          ${operacionConfig.label}
        </div>
      </div>
      
      <h3 style="margin: 0 0 8px 0; font-size: 17px; font-weight: 600; color: #111827; line-height: 1.4;">
        ${inmueble.direccion}
      </h3>
      
      <p style="margin: 0 0 16px 0; font-size: 14px; color: #6b7280; line-height: 1.5;">
        ${inmueble.descripcion || 'Sin descripción'}
      </p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; 
                  font-size: 13px; color: #4b5563;">
        ${amenitiesHtml}
        <div style="display: flex; align-items: center; gap: 6px;">
          ${renderIcon(Maximize)}
          <span>${inmueble.superficie} m²</span>
        </div>
      </div>

      <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 12px; color: #6b7280; font-weight: 600;">PRECIO</span>
          <span style="font-size: 16px; font-weight: 700; color: ${operacionConfig.color};">
            ${oferta.precio.toLocaleString()} ${oferta.moneda}
          </span>
        </div>
        ${oferta.tipoPago ? `
          <p style="margin-top: 4px; font-size: 12px; color: #9ca3af;">
            Pago: ${oferta.tipoPago.charAt(0).toUpperCase() + oferta.tipoPago.slice(1)}
          </p>
        ` : ''}
      </div>
    </div>
  `;
  };

  const toggleMapType = () => {
    if (!mapInstanceRef.current) return;
    const newType = mapType === 'roadmap' ? 'satellite' : 'roadmap';
    setMapType(newType);
    mapInstanceRef.current.setMapTypeId(newType);
  };

  const limpiarFiltros = () => {
    setTipoInmuebleSeleccionado('');
    setTipoOperacion('TODOS');
  };

  const tienesFiltrosActivos = tipoInmuebleSeleccionado !== '' || tipoOperacion !== 'TODOS';

  if (loadError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-red-50">
        <div className="text-center text-red-600 p-8 max-w-md">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" />
          <p className="font-semibold text-xl mb-2">Error al cargar Google Maps</p>
          <p className="text-sm mt-2 text-red-500">{loadError}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded || loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold text-lg">Cargando mapa y propiedades...</p>
        </div>
      </div>
    );
  }

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

      {/* Controles laterales */}
      <div className="fixed top-20 left-4 z-50 flex flex-col gap-3">
        <div className="bg-white rounded-lg shadow-lg p-3 flex flex-col gap-2">
          <button
            onClick={toggleMapType}
            className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm font-medium"
          >
            <Layers className="w-4 h-4" />
            {mapType === 'roadmap' ? 'Satélite' : 'Mapa'}
          </button>

        </div>

        {/* Tipo de Operación */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Tipo de Operación
          </h3>
          <div className="flex flex-col gap-2">
            {(['TODOS', 'VENTA', 'ALQUILER', 'ANTICRETICO'] as TipoOperacion[]).map((tipo) => (
              <button
                key={tipo}
                onClick={() => setTipoOperacion(tipo)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${tipoOperacion === tipo
                  ? `bg-blue-500 text-white shadow-md`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                style={
                  tipoOperacion === tipo && tipo !== 'TODOS'
                    ? { backgroundColor: OPERACION_CONFIG[tipo].color }
                    : {}
                }
              >
                <div
                  className='w-3 h-3 rounded-full'
                  style={{
                    backgroundColor: OPERACION_CONFIG[tipo as keyof typeof OPERACION_CONFIG].color
                  }}
                />
                {tipo}
              </button>
            ))}
          </div>
        </div>



        {/* Leyenda de tipos */}
        <div className="bg-white rounded-lg shadow-lg px-4 py-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Inmueble
          </h3>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => setTipoInmuebleSeleccionado('')}
              className={`flex items-center gap-2 cursor-pointer  p-2 rounded-xl  ${tipoInmuebleSeleccionado === ''
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
              >
                <MapPinHouse className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">
                Todos ({ofertas.length})
              </span>
            </button>
            {Object.entries(TIPO_CONFIG).map(([tipo, config]) => {
              const Icon = config.icon;
              const count = ofertas.filter(i => i.inmueble.tipo === tipo).length;

              return (
                <button onClick={() => setTipoInmuebleSeleccionado(tipoInmuebleSeleccionado === tipo ? '' : tipo as TipoPropiedad)} key={tipo} className={`flex items-center gap-2 cursor-pointer  p-2 rounded-xl ${tipoInmuebleSeleccionado === tipo
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                  >
                    <Icon className="w-3.5 h-3.5 " />
                  </div>
                  <span className="text-sm font-medium ">
                    {config.label} ({count})
                  </span>

                </button>
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
        className="fixed pt-16 left-0 right-0 bottom-0 min-h-[calc(100vh-64px)]"
        style={{ background: '#e5e7eb' }}
      />
    </>
  );
}