import React, { useState, useEffect } from 'react';
import { trackingService, Trip } from '../services/trackingService';

interface UberStyleTrackerProps {
  onTripUpdate?: (trip: Trip | null) => void;
}

const UberStyleTracker: React.FC<UberStyleTrackerProps> = ({ onTripUpdate }) => {
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const trip = trackingService.getCurrentTrip();
      setCurrentTrip(trip);
      setIsTracking(!!trip);
      onTripUpdate?.(trip);
    }, 1000);

    return () => clearInterval(interval);
  }, [onTripUpdate]);

  const startTrip = () => {
    const trip = trackingService.startTrip();
    setCurrentTrip(trip);
    setIsTracking(true);
  };

  const stopTrip = () => {
    const completedTrip = trackingService.stopTrip();
    setCurrentTrip(null);
    setIsTracking(false);
    
    if (completedTrip) {
      alert(`Viaje completado: ${(completedTrip.distance / 1000).toFixed(1)} km en ${Math.round(completedTrip.duration / 60000)} min`);
    }
  };

  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDistance = (meters: number): string => {
    return meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`;
  };

  if (!isTracking) {
    return (
      <div className="absolute bottom-20 left-4 right-4">
        <button
          onClick={startTrip}
          className="w-full bg-black text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg"
        >
          🚗 Iniciar Viaje
        </button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-20 left-4 right-4">
      <div className="bg-white rounded-lg shadow-lg p-4 mb-2">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-600">Viaje en curso</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600">En vivo</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <div className="text-xs text-gray-500">Distancia</div>
            <div className="text-lg font-bold">
              {currentTrip ? formatDistance(currentTrip.distance) : '0 m'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Tiempo</div>
            <div className="text-lg font-bold">
              {currentTrip ? formatDuration(currentTrip.duration) : '0:00'}
            </div>
          </div>
        </div>

        {currentTrip && currentTrip.points.length > 0 && (
          <div className="text-xs text-gray-500 mb-3">
            Puntos registrados: {currentTrip.points.length}
          </div>
        )}
      </div>

      <button
        onClick={stopTrip}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold shadow-lg"
      >
        ⏹️ Finalizar Viaje
      </button>
    </div>
  );
};

export default UberStyleTracker;