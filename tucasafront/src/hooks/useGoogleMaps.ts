// hooks/useGoogleMaps.ts
'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    google: typeof google;
    initGoogleMaps?: () => void;
  }
}

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // Si ya está cargado
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    // Si ya existe el script, esperar a que termine de cargar
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
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

    // Función de callback que se ejecutará cuando Maps esté listo
    window.initGoogleMaps = () => {
      setIsLoaded(true);
    };

    // Crear el script después de definir el callback
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geocoding,marker&callback=initGoogleMaps`;


    script.onerror = () => {
      setLoadError('Error al cargar Google Maps API');
      console.error('Error al cargar Google Maps');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup: remover la función global
      delete window.initGoogleMaps;
    };
  }, []);

  return { isLoaded, loadError };
}