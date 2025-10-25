import React, { useState, useEffect } from 'react';
import { trackingService, Trip } from '../services/trackingService';

interface TripHistoryPanelProps {
  onClose: () => void;
}

const TripHistoryPanel: React.FC<TripHistoryPanelProps> = ({ onClose }) => {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const allTrips = trackingService.getTrips()
      .filter(trip => trip.status === 'completed')
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    setTrips(allTrips);
  }, []);

  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDistance = (meters: number): string => {
    return meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`;
  };

  const getAverageSpeed = (trip: Trip): string => {
    if (trip.duration === 0) return '0 km/h';
    const speedKmh = (trip.distance / 1000) / (trip.duration / 3600000);
    return `${Math.round(speedKmh)} km/h`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Historial de Viajes</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          {trips.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay viajes registrados
            </div>
          ) : (
            <div className="space-y-3">
              {trips.map(trip => (
                <div key={trip.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold">
                        {new Date(trip.startTime).toLocaleDateString('es-MX', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(trip.startTime).toLocaleTimeString('es-MX', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {trip.endTime && (
                          <span> - {new Date(trip.endTime).toLocaleTimeString('es-MX', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{formatDistance(trip.distance)}</div>
                      <div className="text-sm text-gray-500">{formatDuration(trip.duration)}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Puntos:</span>
                      <span className="ml-1 font-medium">{trip.points.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Velocidad promedio:</span>
                      <span className="ml-1 font-medium">{getAverageSpeed(trip)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Estado:</span>
                      <span className="ml-1 font-medium text-green-600">Completado</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripHistoryPanel;