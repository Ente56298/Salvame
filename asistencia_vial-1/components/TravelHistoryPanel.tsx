import React from 'react';
import { useTravelHistory } from '../hooks/useTravelHistory';

interface TravelHistoryPanelProps {
  onClose: () => void;
}

export const TravelHistoryPanel: React.FC<TravelHistoryPanelProps> = ({ onClose }) => {
  const { travelHistory, clearHistory } = useTravelHistory();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDistance = (distance: number) => {
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Historial de Viajes</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        {travelHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay viajes registrados</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">{travelHistory.length} viajes</span>
              <button
                onClick={clearHistory}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Limpiar historial
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {travelHistory.map((route) => (
                <div key={route.id} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-green-600">
                        📍 {route.startLocation.address}
                      </div>
                      <div className="text-sm text-red-600 mt-1">
                        🎯 {route.endLocation.address}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 ml-2">
                      {formatDistance(route.distance)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{formatDate(route.timestamp)}</span>
                    {route.duration && <span>{route.duration} min</span>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-4">
          <button
            onClick={onClose}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};