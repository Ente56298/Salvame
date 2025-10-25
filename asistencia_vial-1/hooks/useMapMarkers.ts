import { useState } from 'react';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  type: 'gas' | 'mechanic' | 'parts' | 'service' | 'user';
  details?: {
    address?: string;
    phone?: string;
    hours?: string;
    rating?: number;
  };
}

export const useMapMarkers = () => {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  const addMarker = (marker: Omit<MapMarker, 'id'>) => {
    const newMarker: MapMarker = {
      ...marker,
      id: Date.now().toString()
    };
    setMarkers(prev => [...prev, newMarker]);
    return newMarker;
  };

  const removeMarker = (id: string) => {
    setMarkers(prev => prev.filter(m => m.id !== id));
  };

  const clearMarkers = (type?: string) => {
    if (type) {
      setMarkers(prev => prev.filter(m => m.type !== type));
    } else {
      setMarkers([]);
    }
  };

  const selectMarker = (marker: MapMarker) => {
    setSelectedMarker(marker);
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'gas': return '⛽';
      case 'mechanic': return '🔧';
      case 'parts': return '🔩';
      case 'service': return '🛠️';
      case 'user': return '📍';
      default: return '📌';
    }
  };

  return {
    markers,
    selectedMarker,
    addMarker,
    removeMarker,
    clearMarkers,
    selectMarker,
    getMarkerIcon
  };
};