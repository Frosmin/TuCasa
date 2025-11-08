// publicar/components/LocationPicker.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';

interface LocationPickerProps {
    latitude: string;
    longitude: string;
    onChange: (lat: number, lng: number) => void;
    onAddressChange?: (address: string) => void;
    onZonaChange?: (zona: string) => void; 
}

export default function LocationPicker({ 
    latitude, 
    longitude, 
    onChange, 
    onAddressChange,
    onZonaChange 
}: LocationPickerProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const [address, setAddress] = useState('');
    const { isLoaded, loadError } = useGoogleMaps();

    useEffect(() => {
        if (!isLoaded || !mapRef.current || !window.google?.maps) return;

        const initialLat = parseFloat(latitude) || -17.3895;
        const initialLng = parseFloat(longitude) || -66.1568;
        const initialPosition = { lat: initialLat, lng: initialLng };

        // Crear el mapa
        const map = new google.maps.Map(mapRef.current, {
            center: initialPosition,
            zoom: 15,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
        });

        mapInstanceRef.current = map;

        // Crear el marcador
        const marker = new google.maps.Marker({
            position: initialPosition,
            map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            title: 'Arrastra el marcador para seleccionar la ubicación',
        });

        markerRef.current = marker;

        // Obtener dirección inicial
        getAddressAndZone(initialLat, initialLng);

        // Evento: cuando se arrastra el marcador
        marker.addListener('dragend', () => {
            const position = marker.getPosition();
            if (position) {
                const lat = position.lat();
                const lng = position.lng();
                onChange(lat, lng);
                getAddressAndZone(lat, lng);
            }
        });

        // Evento: click en el mapa para mover el marcador
        map.addListener('click', (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                marker.setPosition(e.latLng);
                map.panTo(e.latLng);
                onChange(lat, lng);
                getAddressAndZone(lat, lng);
            }
        });
    }, [isLoaded]);

    // Actualizar marcador cuando cambian las coordenadas externamente
    useEffect(() => {
        if (!isLoaded || !markerRef.current || !mapInstanceRef.current) return;

        if (latitude && longitude) {
            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
                const newPosition = { lat, lng };
                markerRef.current.setPosition(newPosition);
                mapInstanceRef.current.panTo(newPosition);
                getAddressAndZone(lat, lng);
            }
        }
    }, [latitude, longitude, isLoaded]);

    const getAddressAndZone = async (lat: number, lng: number) => {
        if (!window.google?.maps?.Geocoder) return;

        const geocoder = new google.maps.Geocoder();
        try {
            const response = await geocoder.geocode({ location: { lat, lng } });
            if (response.results[0]) {
                const result = response.results[0];
                const detectedAddress = result.formatted_address;
                
                // Extraer la zona del resultado de geocodificación
                const zona = extractZonaFromGeocodeResult(result);
                
                setAddress(detectedAddress);
                
                // Actualizar dirección
                if (onAddressChange) {
                    onAddressChange(detectedAddress);
                }
                
                // Actualizar zona
                if (onZonaChange && zona) {
                    onZonaChange(zona);
                }
            }
        } catch (error) {
            console.error('Error al obtener la dirección:', error);
        }
    };

    // Función para extraer la zona de los componentes del resultado de geocodificación
    const extractZonaFromGeocodeResult = (result: google.maps.GeocoderResult): string => {
        const addressComponents = result.address_components;
        
        // Prioridad de búsqueda de la zona:
        // 1. sublocality_level_1 (barrio/zona específica)
        // 2. locality (ciudad)
        // 3. administrative_area_level_2 (municipio)
        // 4. administrative_area_level_1 (departamento/estado)
        
        const priorityTypes = [
            'sublocality_level_1',
            'sublocality',
            'neighborhood',
            'locality',
            'administrative_area_level_2',
            'administrative_area_level_1'
        ];
        
        for (const type of priorityTypes) {
            const component = addressComponents.find(comp => 
                comp.types.includes(type)
            );
            if (component) {
                return component.long_name;
            }
        }
        
        // Fallback: retornar el primer componente si no se encuentra ninguno
        return addressComponents[0]?.long_name || 'Zona no especificada';
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('La geolocalización no está soportada en tu navegador');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                onChange(lat, lng);

                if (markerRef.current && mapInstanceRef.current) {
                    const newPosition = { lat, lng };
                    markerRef.current.setPosition(newPosition);
                    mapInstanceRef.current.panTo(newPosition);
                    mapInstanceRef.current.setZoom(16);
                    getAddressAndZone(lat, lng);
                }
            },
            (error) => {
                console.error('Error al obtener ubicación:', error);
                alert('No se pudo obtener tu ubicación actual');
            }
        );
    };

    if (loadError) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <p className="font-medium">Error al cargar Google Maps</p>
                </div>
                <p className="text-sm text-red-600 mt-1">{loadError}</p>
                <p className="text-xs text-red-500 mt-2">
                    Verifica que NEXT_PUBLIC_GOOGLE_MAPS_API_KEY esté configurada en tu archivo .env.local
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación de la propiedad *
                </label>

                {/* Mapa */}
                <div className="relative">
                    <div ref={mapRef} className="w-full h-[400px] rounded-lg shadow-md border border-gray-300" />

                    {!isLoaded && (
                        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                <p className="text-gray-500 text-sm">Cargando mapa...</p>
                            </div>
                        </div>
                    )}
                </div>
                
                <p className="mt-2 text-xs text-gray-500 text-center">
                    💡 Haz clic en el mapa o arrastra el marcador para seleccionar la ubicación exacta
                </p>
                <div className="flex justify-center mt-3">
                    <button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={!isLoaded}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        <MapPin className="w-4 h-4" />
                        Usar mi ubicación actual
                    </button>
                </div>
            </div>
        </div>
    );
}