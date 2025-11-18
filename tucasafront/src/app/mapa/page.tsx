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
  ChevronDown
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
  AVALUO: { color: '#9810fa', label: 'Avaluo', bgLight: '#fffbeb' },
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

  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('satellite');
  const [mapInitialized, setMapInitialized] = useState(false);
  const [domReady, setDomReady] = useState(false);

  // Estados de filtros
  const [tipoInmuebleSeleccionado, setTipoInmuebleSeleccionado] = useState<TipoPropiedad | ''>('DEPARTAMENTO');
  const [tipoOperacion, setTipoOperacion] = useState<TipoOperacion>('ALQUILER');
  const [zonaSeleccionada, setZonaSeleccionada] = useState<string>('');
  const [isZonaDropdownOpen, setIsZonaDropdownOpen] = useState(false);
  const [zonaSearchTerm, setZonaSearchTerm] = useState('');

  // Cargar inmuebles desde la API
  useEffect(() => {
    const fetchInmuebles = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/oferta`);
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

      if (zonaSeleccionada && oferta.inmueble.zona !== zonaSeleccionada) {
        return false;
      }
      // Filtro por tipo de operación
      if (tipoOperacion !== 'TODOS') {

        const tieneOperacion = oferta.tipo === tipoOperacion

        if (!tieneOperacion) return false;
      }

      return true;
    });
  }, [ofertas, tipoInmuebleSeleccionado, tipoOperacion, zonaSeleccionada]);

  const zonasUnicas = useMemo(() => {
    const zonas = new Set<string>();
    ofertas.forEach(oferta => {
      if (oferta.inmueble.zona && oferta.inmueble.zona.trim() !== '') {
        zonas.add(oferta.inmueble.zona.trim());
      }
    });
    return Array.from(zonas).sort();
  }, [ofertas]);

  const zonasFiltradas = useMemo(() => {
    if (!zonaSearchTerm) return zonasUnicas;
    return zonasUnicas.filter(zona =>
      zona.toLowerCase().includes(zonaSearchTerm.toLowerCase())
    );
  }, [zonasUnicas, zonaSearchTerm]);


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
    setZonaSeleccionada('');
  };

  const tienesFiltrosActivos = tipoInmuebleSeleccionado !== '' || tipoOperacion !== 'TODOS' || zonaSeleccionada !== '';
  const estadisticasPorZona = useMemo(() => {
    const stats: { [zona: string]: { count: number; totalUSD: number; totalBOB: number } } = {};

    ofertasFiltrados.forEach(oferta => {
      const zona = oferta.inmueble.zona || 'Sin zona';
      if (!stats[zona]) {
        stats[zona] = { count: 0, totalUSD: 0, totalBOB: 0 };
      }

      stats[zona].count += 1;

      if (oferta.moneda === '$' || oferta.moneda.toString() === 'USD') {
        stats[zona].totalUSD += oferta.precio;
        stats[zona].totalBOB += oferta.precio * 6.96;
      } else {
        stats[zona].totalBOB += oferta.precio;
        stats[zona].totalUSD += oferta.precio / 6.96;
      }
    });

    return Object.entries(stats)
      .map(([zona, data]) => ({
        zona,
        count: data.count,
        promedioUSD: data.totalUSD / data.count,
        promedioBOB: data.totalBOB / data.count
      }))
      .sort((a, b) => b.count - a.count);
  }, [ofertasFiltrados]);

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
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-lg px-6 py-3 flex items-center gap-6">
        <div className="text-center">
          <div className="text-xs text-gray-500 font-medium mb-1">Inmuebles</div>
          <div className="text-lg font-bold text-blue-600">{ofertasFiltrados.length}</div>
        </div>
        <div className="h-8 w-px bg-gray-300"></div>
        <div className="text-center">
          <div className="text-xs text-gray-500 font-medium mb-1">Promedio USD</div>
          <div className="text-lg font-bold text-green-600">
            ${(estadisticasPorZona.reduce((acc, stat) => acc + stat.promedioUSD, 0) / (estadisticasPorZona.length || 1)).toLocaleString('es-BO', { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="h-8 w-px bg-gray-300"></div>
        <div className="text-center">
          <div className="text-xs text-gray-500 font-medium mb-1">Promedio Bs.</div>
          <div className="text-lg font-bold text-purple-600">
            {(estadisticasPorZona.reduce((acc, stat) => acc + stat.promedioBOB, 0) / (estadisticasPorZona.length || 1)).toLocaleString('es-BO', { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>

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

        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Tipo de Operación
          </h3>
          <div className="flex flex-col gap-2">
            {(['TODOS', 'VENTA', 'ALQUILER', 'ANTICRETICO'] as TipoOperacion[]).map((tipo) => (
              <button
                key={tipo}
                onClick={() => setTipoOperacion(tipo)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${tipoOperacion === tipo ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                style={tipoOperacion === tipo && tipo !== 'TODOS' ? { backgroundColor: OPERACION_CONFIG[tipo].color } : {}}
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

        {zonasUnicas.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Zona
            </h3>
            <div className="relative">
              <div
                onClick={() => setIsZonaDropdownOpen(!isZonaDropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm cursor-pointer"
              >
                <span className={`truncate ${zonaSeleccionada ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {zonaSeleccionada || 'Todas las zonas'}
                </span>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {zonaSeleccionada && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setZonaSeleccionada('');
                        setZonaSearchTerm('');
                      }}
                      className="p-1 hover:bg-gray-300 rounded transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                  )}
                  <ChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform ${isZonaDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>

              {isZonaDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsZonaDropdownOpen(false)}
                  />

                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-80 overflow-hidden">
                    <div className="p-2 border-b border-gray-200">
                      <input
                        type="text"
                        placeholder="Buscar zona..."
                        value={zonaSearchTerm}
                        onChange={(e) => setZonaSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    <div className="overflow-y-auto max-h-64">
                      <button
                        onClick={() => {
                          setZonaSeleccionada('');
                          setIsZonaDropdownOpen(false);
                          setZonaSearchTerm('');
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${!zonaSeleccionada ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
                      >
                        Todas las zonas ({ofertas.length})
                      </button>

                      {zonasFiltradas.length > 0 ? (
                        zonasFiltradas.map((zona) => {
                          const count = ofertas.filter(o => o.inmueble.zona === zona).length;
                          return (
                            <button
                              key={zona}
                              onClick={() => {
                                setZonaSeleccionada(zona);
                                setIsZonaDropdownOpen(false);
                                setZonaSearchTerm('');
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${zonaSeleccionada === zona ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
                            >
                              {zona} ({count})
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-4 py-8 text-center text-sm text-gray-500">
                          No se encontraron zonas
                        </div>
                      )}
                    </div>

                    {zonaSearchTerm && zonasFiltradas.length > 0 && (
                      <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-200 bg-gray-50">
                        {zonasFiltradas.length} zona{zonasFiltradas.length !== 1 ? 's' : ''} encontrada{zonasFiltradas.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg px-4 py-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Inmueble
          </h3>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => setTipoInmuebleSeleccionado('')}
              className={`flex items-center gap-2 cursor-pointer p-2 rounded-xl ${tipoInmuebleSeleccionado === '' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center">
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
                <button
                  onClick={() => setTipoInmuebleSeleccionado(tipoInmuebleSeleccionado === tipo ? '' : tipo as TipoPropiedad)}
                  key={tipo}
                  className={`flex items-center gap-2 cursor-pointer p-2 rounded-xl ${tipoInmuebleSeleccionado === tipo ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium">
                    {config.label} ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

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