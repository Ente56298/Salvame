import { useState, useEffect } from 'react';

interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  timestamp: number;
}

export const useRecentLocations = () => {
  const [recentLocations, setRecentLocations] = useState<Location[]>(() => {
    const saved = localStorage.getItem('recentLocations');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('recentLocations', JSON.stringify(recentLocations));
  }, [recentLocations]);

  const addLocation = (location: Omit<Location, 'id' | 'timestamp'>) => {
    const newLocation: Location = {
      ...location,
      id: Date.now().toString(),
      timestamp: Date.now()
    };

    setRecentLocations(prev => {
      const filtered = prev.filter(loc => 
        Math.abs(loc.lat - newLocation.lat) > 0.001 || 
        Math.abs(loc.lng - newLocation.lng) > 0.001
      );
      
      return [newLocation, ...filtered].slice(0, 5);
    });
  };

  const clearLocations = () => {
    setRecentLocations([]);
  };

  return {
    recentLocations,
    addLocation,
    clearLocations
  };
};