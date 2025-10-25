import { useEffect, useRef } from 'react';

interface SimpleMapProps {
  userLocation?: { lat: number; lng: number } | null;
  businesses?: Array<{
    id: string;
    nombre: string;
    lat: number;
    lng: number;
    tipo: string;
  }>;
}

export default function SimpleMap({ userLocation, businesses = [] }: SimpleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple map implementation without Google Maps API
    if (!mapRef.current) return;

    const mapContainer = mapRef.current;
    mapContainer.innerHTML = `
      <div class="bg-gray-800 rounded-lg p-4 h-64 flex items-center justify-center">
        <div class="text-center">
          <div class="text-4xl mb-2">🗺️</div>
          <p class="text-gray-300">Mapa Interactivo</p>
          ${userLocation ? 
            `<p class="text-sm text-blue-400 mt-2">📍 Tu ubicación: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}</p>` : 
            '<p class="text-sm text-gray-500 mt-2">Ubicación no disponible</p>'
          }
          <div class="mt-4 space-y-1">
            ${businesses.slice(0, 3).map(business => 
              `<div class="text-xs text-gray-400">📍 ${business.nombre}</div>`
            ).join('')}
          </div>
        </div>
      </div>
    `;
  }, [userLocation, businesses]);

  const openInGoogleMaps = () => {
    if (userLocation) {
      window.open(`https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`);
    } else {
      window.open('https://maps.google.com/');
    }
  };

  return (
    <div className="rocket-card p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Mapa de Servicios</h3>
        <button 
          onClick={openInGoogleMaps}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          Abrir en Google Maps →
        </button>
      </div>
      <div ref={mapRef}></div>
    </div>
  );
}