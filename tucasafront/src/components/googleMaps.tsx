    //components/googleMaps.tsx
    'use client';
    import { useEffect, useRef } from 'react';

    export default function GoogleMaps() {
      const mapRef = useRef<HTMLDivElement>(null);
      console.log('API KEY:', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
      useEffect(() => {
        const initMap = () => {
          if (!mapRef.current) return;

          // Asegurarse de que la API esté disponible
          if (!window.google || !window.google.maps) {
            console.error('Google Maps API no está disponible');
            return;
          }

          const map = new google.maps.Map(mapRef.current, {
            center: { lat: -17.3895, lng: -66.1568 },
            zoom: 13,
          });

          new google.maps.Marker({
            position: { lat: -17.3895, lng: -66.1568 },
            map,
            title: 'Cochabamba',
          });
        };

        // Cargar el script si no existe
        if (!document.querySelector('#google-maps-script')) {
          const script = document.createElement('script');
          script.id = 'google-maps-script';
          script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=maps,marker`;
          script.async = true;
          script.defer = true;
          script.onload = initMap;
          document.body.appendChild(script);
        } else {
          // Si ya está cargado, inicializa el mapa directamente
          initMap();
        }
      }, []);

      return (
        <div className="p-4">
          <h1 className="text-lg font-semibold mb-4">Mapa de Google</h1>
          <div ref={mapRef} className="w-full h-[400px] rounded-lg shadow-md border" />
        </div>
      );
    }
