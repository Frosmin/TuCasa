'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, AlertCircle, Navigation } from 'lucide-react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';

interface PropertyLocationMapProps {
  latitude: number;
  longitude: number;
  address: string;
  propertyName: string;
  zone?: string;
}

export default function PropertyLocationMap({
  latitude,
  longitude,
  address,
  propertyName,
  zone,
}: PropertyLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { isLoaded, loadError } = useGoogleMaps();

  // Función para calcular distancia (Haversine)
  const calcularDistancia = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Validar coordenadas
  const validarCoordenadas = (lat: number, lng: number) => {
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      return { lat: lng, lng: lat };
    }
    if (Math.abs(lat) > Math.abs(lng)) {
      return { lat: lng, lng: lat };
    }
    return { lat, lng };
  };

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google?.maps) return;

    const { lat, lng } = validarCoordenadas(latitude, longitude);

    if (lat === 0 && lng === 0) {
      console.warn('Coordenadas inválidas: 0, 0');
      return;
    }

    const position = { lat, lng };

    // Crear mapa
    const map = new google.maps.Map(mapRef.current, {
      center: position,
      zoom: 16,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
    });

    mapInstanceRef.current = map;

    // Crear marcador con información
    const marker = new google.maps.Marker({
      position,
      map,
      draggable: false,
      animation: google.maps.Animation.DROP,
      title: propertyName,
    });

    markerRef.current = marker;

    // Info Window


  }, [isLoaded, latitude, longitude, address, propertyName]);

  
  if (loadError) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-center gap-3 text-red-700">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <div>
            <p className="font-semibold">Error al cargar Google Maps</p>
            <p className="text-sm mt-1">{loadError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          Ubicación de la propiedad
        </h2>

        {/* Mapa */}
        <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200 h-96 md:h-96">
          <div ref={mapRef} className="w-full h-full" />
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm">Cargando mapa...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Información de Ubicación */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-3">
        <div className='grid grid-cols-2 gap-4 '>
          <div>

            <p className="text-sm font-medium text-gray-600">Dirección</p>
            <p className="text-lg text-gray-900 font-semibold">{address}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Zona</p>
            <p className="text-lg text-gray-900 font-semibold">{zone}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-600">Latitud</p>
            <p className="text-gray-900 font-mono">{validarCoordenadas(latitude, longitude).lat.toFixed(4)}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Longitud</p>
            <p className="text-gray-900 font-mono">{validarCoordenadas(latitude, longitude).lng.toFixed(4)}</p>
          </div>
        </div>

        {distance && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-900">
              📍 Distancia desde tu ubicación: <span className="font-bold">{distance} km</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}