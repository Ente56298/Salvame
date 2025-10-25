import React from 'react';
import { useRecentLocations } from '../hooks/useRecentLocations';

interface RecentLocationsProps {
  onSelectLocation: (location: { lat: number; lng: number; address: string }) => void;
}

export const RecentLocations: React.FC<RecentLocationsProps> = ({ onSelectLocation }) => {
  const { recentLocations, clearLocations } = useRecentLocations();

  if (recentLocations.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Ubicaciones Recientes</h3>
        <button
          onClick={clearLocations}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Limpiar
        </button>
      </div>
      
      <div className="space-y-2">
        {recentLocations.map((location) => (
          <button
            key={location.id}
            onClick={() => onSelectLocation({
              lat: location.lat,
              lng: location.lng,
              address: location.address
            })}
            className="w-full text-left p-2 bg-white border border-gray-200 rounded hover:bg-gray-100 transition-colors"
          >
            <div className="font-medium text-sm">{location.name}</div>
            <div className="text-xs text-gray-500">{location.address}</div>
          </button>
        ))}
      </div>
    </div>
  );
};