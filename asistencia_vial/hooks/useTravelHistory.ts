import { useState, useEffect } from 'react';

interface TravelRoute {
  id: string;
  startLocation: { lat: number; lng: number; address: string };
  endLocation: { lat: number; lng: number; address: string };
  timestamp: number;
  distance: number; // in kilometers
  duration?: number; // in minutes
}

export const useTravelHistory = () => {
  const [travelHistory, setTravelHistory] = useState<TravelRoute[]>(() => {
    const saved = localStorage.getItem('travelHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('travelHistory', JSON.stringify(travelHistory));
  }, [travelHistory]);

  const addRoute = (route: Omit<TravelRoute, 'id'>) => {
    const newRoute: TravelRoute = {
      ...route,
      id: Date.now().toString()
    };

    setTravelHistory(prev => [newRoute, ...prev].slice(0, 50)); // Keep last 50 routes
  };

  const clearHistory = () => {
    setTravelHistory([]);
  };

  const calculateDistance = (start: { lat: number; lng: number }, end: { lat: number; lng: number }): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (end.lat - start.lat) * Math.PI / 180;
    const dLng = (end.lng - start.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(start.lat * Math.PI / 180) * Math.cos(end.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return {
    travelHistory,
    addRoute,
    clearHistory,
    calculateDistance
  };
};