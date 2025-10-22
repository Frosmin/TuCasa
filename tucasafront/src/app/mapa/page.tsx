// app/mapa/page.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { MapPin } from 'lucide-react';

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

export default function MapaPage() {
  const { isLoaded, loadError } = useGoogleMaps();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('satellite');

  // Cargar inmuebles desde la API
  useEffect(() => {
    const fetchInmuebles = async () => {
      try {
        const response = await fetch('http://localhost:8000/tucasabackend/api/inmueble');
        const result = await response.json();
        
        if (result.error) {
          throw new Error(result.message);
        }
        
        console.log('✅ Inmuebles cargados:', result.data.length);
        
        // Filtrar inmuebles con coordenadas válidas
        const validInmuebles = result.data.filter(
          (inmueble: Inmueble) => inmueble.latitud !== 0 && inmueble.longitud !== 0
        );
        
        console.log('✅ Inmuebles con coordenadas válidas:', validInmuebles.length);
        setInmuebles(validInmuebles);
        setLoading(false);
      } catch (err) {
        console.error('❌ Error al cargar inmuebles:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar inmuebles');
        setLoading(false);
      }
    };

    fetchInmuebles();
  }, []);

  // Inicializar el mapa cuando Google Maps esté listo Y el ref esté disponible
  useEffect(() => {
    // Esperar un frame para asegurar que el DOM esté listo
    const timeoutId = setTimeout(() => {
      if (!isLoaded) {
        return;
      }

      if (!mapRef.current) {
        return;
      }

      if (mapInstanceRef.current) {
        return;
      }
      try {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: -17.3895, lng: -66.1568 },
          zoom: 13,
          mapTypeId: mapType,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        });

        mapInstanceRef.current = map;
        infoWindowRef.current = new google.maps.InfoWindow();
      } catch (err) {
        console.error('❌ Error al inicializar mapa:', err);
        setError('Error al inicializar el mapa');
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [isLoaded, mapType]);

  // Crear marcadores para cada inmueble
  useEffect(() => {
    if (!mapInstanceRef.current) {
      console.log('⏳ Esperando inicialización del mapa...');
      return;
    }

    if (inmuebles.length === 0) {
      console.log('⏳ No hay inmuebles para mostrar');
      return;
    }

    console.log('📍 Creando', inmuebles.length, 'marcadores...');

    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();

    inmuebles.forEach((inmueble, index) => {
      const position = { lat: inmueble.latitud, lng: inmueble.longitud };
      
      const marker = new google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        title: inmueble.direccion,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: inmueble.tipo === 'CASA' ? '#3b82f6' : '#f59e0b',
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      const contentString = `
        <div style="padding: 12px; max-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="background: ${inmueble.tipo === 'CASA' ? '#3b82f6' : '#f59e0b'}; 
                        color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
              ${inmueble.tipo}
            </div>
          </div>
          
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937;">
            ${inmueble.direccion}
          </h3>
          
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">
            ${inmueble.descripcion}
          </p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; font-size: 13px;">
            ${inmueble.tipo === 'CASA' ? `
              <div>🛏️ ${inmueble.numDormitorios} dorm.</div>
              <div>🚿 ${inmueble.numBanos} baños</div>
              ${inmueble.garaje ? '<div>🚗 Garaje</div>' : ''}
              ${inmueble.patio ? '<div>🌳 Patio</div>' : ''}
            ` : `
              <div>📐 ${inmueble.numAmbientes} ambientes</div>
              ${inmueble.deposito ? '<div>📦 Depósito</div>' : ''}
            `}
            <div>📏 ${inmueble.superficie} m²</div>
          </div>
          
          <a href="http://localhost:3000/oferta/${inmueble.id}" 
             style="display: block; text-align: center; background: #3b82f6; color: white; 
                    padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: 500;">
            Ver detalles
          </a>
        </div>
      `;

      marker.addListener('click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(contentString);
          infoWindowRef.current.open(mapInstanceRef.current, marker);
        }
      });

      markersRef.current.push(marker);
      bounds.extend(position);
    });

    if (inmuebles.length > 0) {
      mapInstanceRef.current.fitBounds(bounds);
      console.log('✅ Marcadores creados y mapa ajustado');
    }
  }, [inmuebles, mapInstanceRef.current]);

  const toggleMapType = () => {
    const newType = mapType === 'roadmap' ? 'satellite' : 'roadmap';
    setMapType(newType);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setMapTypeId(newType);
    }
  };

  // Pantallas de estado
  if (loadError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-red-50">
        <div className="text-center text-red-600 p-8">
          <MapPin className="w-12 h-12 mx-auto mb-4" />
          <p className="font-semibold text-lg">Error al cargar Google Maps</p>
          <p className="text-sm mt-2">{loadError}</p>
          <p className="text-xs mt-4 text-gray-600">
            Verifica que NEXT_PUBLIC_GOOGLE_MAPS_API_KEY esté configurada
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded || loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando mapa y propiedades...</p>
          <p className="text-sm text-gray-500 mt-2">
            {!isLoaded ? 'Cargando Google Maps...' : 'Cargando propiedades...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-red-50">
        <div className="text-center text-red-600 p-8">
          <MapPin className="w-12 h-12 mx-auto mb-4" />
          <p className="font-semibold text-lg">Error al cargar propiedades</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Controles del mapa */}
      <div className="fixed top-44 left-4 z-50 flex flex-col gap-2">
        <button
          onClick={toggleMapType}
          className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-lg 
                     flex items-center gap-2 transition-colors"
        >
          <MapPin className="w-4 h-4" />
          {mapType === 'roadmap' ? 'Vista Satélite' : 'Vista Mapa'}
        </button>
        
        <div className="bg-white rounded-lg shadow-lg px-4 py-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium">
                Casas ({inmuebles.filter(i => i.tipo === 'CASA').length})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm font-medium">
                Tiendas ({inmuebles.filter(i => i.tipo === 'TIENDA').length})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor del mapa */}
      <div 
        ref={mapRef} 
        className="fixed inset-0 w-screen h-screen"
      />
    </>
  );
}