// hooks/useGoogleMaps.ts
'use client';

import { useEffect, useState } from 'react';

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    // Si ya existe el script, esperar a que termine de cargar
    const existingScript = document.querySelector('#google-maps-script');
    if (existingScript) {
      const checkInterval = setInterval(() => {
        if (window.google?.maps) {
          setIsLoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.google?.maps) {
          setLoadError('Timeout al cargar Google Maps');
        }
      }, 10000);

      return () => clearInterval(checkInterval);
    }

    // Cargar el script por primera vez
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      setLoadError('API Key de Google Maps no configurada');
      console.error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY no está definida');
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geocoding`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setLoadError('Error al cargar Google Maps API');
      console.error('Error al cargar Google Maps');
    };

    document.head.appendChild(script);

    return () => {
    };
  }, []);

  return { isLoaded, loadError };
}