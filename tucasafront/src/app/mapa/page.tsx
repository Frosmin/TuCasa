'use client';
import GoogleMaps from '../../components/googleMaps';

export default function MapaPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Vista del Mapa</h1>
      <div className="max-w-4xl mx-auto">
        <GoogleMaps />
      </div>
    </div>
  );
}
