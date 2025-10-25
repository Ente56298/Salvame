import React, { useState, useEffect } from 'react';
import { checkTrafficAndNotify, showNotification } from '../utils/notifications';

interface TrafficReportPanelProps {
  onClose: () => void;
}

interface TrafficIncident {
  id: string;
  type: 'accident' | 'construction' | 'congestion' | 'closure';
  severity: 'low' | 'medium' | 'high';
  location: string;
  description: string;
  timestamp: number;
}

export const TrafficReportPanel: React.FC<TrafficReportPanelProps> = ({ onClose }) => {
  const [incidents, setIncidents] = useState<TrafficIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    fetchTrafficData();
  }, []);

  const fetchTrafficData = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockIncidents: TrafficIncident[] = [
      {
        id: '1',
        type: 'accident',
        severity: 'high',
        location: 'Periférico Sur, altura Insurgentes',
        description: 'Accidente vehicular bloquea 2 carriles',
        timestamp: Date.now() - 300000
      },
      {
        id: '2',
        type: 'construction',
        severity: 'medium',
        location: 'Av. Reforma, entre Ángel y Diana',
        description: 'Obras de mantenimiento hasta las 18:00',
        timestamp: Date.now() - 600000
      },
      {
        id: '3',
        type: 'congestion',
        severity: 'low',
        location: 'Eje Central Norte',
        description: 'Tráfico lento por alta demanda',
        timestamp: Date.now() - 900000
      }
    ];

    setIncidents(mockIncidents);
    setLoading(false);

    // Check for critical incidents and notify
    checkTrafficAndNotify({ incidents: mockIncidents });
  };

  const reportIncident = () => {
    if (!selectedLocation.trim()) {
      showNotification('Por favor selecciona una ubicación', 'error');
      return;
    }

    const newIncident: TrafficIncident = {
      id: Date.now().toString(),
      type: 'congestion',
      severity: 'medium',
      location: selectedLocation,
      description: 'Reporte de usuario',
      timestamp: Date.now()
    };

    setIncidents(prev => [newIncident, ...prev]);
    setSelectedLocation('');
    showNotification('Reporte enviado exitosamente', 'success');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'accident': return '🚗💥';
      case 'construction': return '🚧';
      case 'congestion': return '🚦';
      case 'closure': return '🚫';
      default: return '⚠️';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Reporte de Tráfico</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Reportar Incidente</h3>
          <input
            type="text"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            placeholder="Ubicación del incidente"
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={reportIncident}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Enviar Reporte
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando reportes...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3">
            <h3 className="font-semibold">Incidentes Activos ({incidents.length})</h3>
            
            {incidents.map((incident) => (
              <div key={incident.id} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getTypeIcon(incident.type)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                      {incident.severity.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(incident.timestamp).toLocaleTimeString('es-MX', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                
                <div className="text-sm font-medium text-gray-800 mb-1">
                  📍 {incident.location}
                </div>
                
                <div className="text-sm text-gray-600">
                  {incident.description}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <button
            onClick={fetchTrafficData}
            className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            Actualizar
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};