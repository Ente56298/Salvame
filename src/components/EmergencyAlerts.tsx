import { useState, useEffect } from 'react';

interface EmergencyAlert {
  id: string;
  type: 'SISMO' | 'HURACAN' | 'INUNDACION' | 'INCENDIO' | 'AMBER' | 'OTRO';
  title: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  area: string;
  timestamp: string;
  source: 'CENAPRED' | 'CONAGUA' | 'IFT' | 'GOBIERNO';
  active: boolean;
}

export default function EmergencyAlerts() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    // Simulate CBS (Cell Broadcast Service) alerts from IFT
    const simulateEmergencyAlerts = () => {
      const mockAlerts: EmergencyAlert[] = [
        {
          id: 'alert-001',
          type: 'SISMO',
          title: 'Alerta Sísmica CDMX',
          message: 'Sismo detectado. Manténgase en lugar seguro. Magnitud preliminar 4.2. Epicentro: 45km SE de CDMX.',
          severity: 'WARNING',
          area: 'Ciudad de México y área metropolitana',
          timestamp: new Date().toISOString(),
          source: 'CENAPRED',
          active: true
        },
        {
          id: 'alert-002', 
          type: 'AMBER',
          title: 'Alerta AMBER',
          message: 'Menor desaparecido en Polanco. Niño de 8 años, cabello castaño, playera azul. Contactar 911.',
          severity: 'CRITICAL',
          area: 'Polanco, Miguel Hidalgo',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          source: 'GOBIERNO',
          active: true
        }
      ];

      setAlerts(mockAlerts);
      
      // Show notification for new alerts
      if ('Notification' in window && Notification.permission === 'granted') {
        mockAlerts.forEach(alert => {
          new Notification(`🚨 ${alert.title}`, {
            body: alert.message,
            icon: '/manifest.json',
            tag: alert.id,
            requireInteraction: alert.severity === 'CRITICAL'
          });
        });
      }
    };

    // Simulate receiving alerts after 3 seconds
    const timer = setTimeout(simulateEmergencyAlerts, 3000);
    return () => clearTimeout(timer);
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'SISMO': return '🌍';
      case 'HURACAN': return '🌀';
      case 'INUNDACION': return '🌊';
      case 'INCENDIO': return '🔥';
      case 'AMBER': return '👶';
      default: return '⚠️';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'border-red-500 bg-red-900';
      case 'WARNING': return 'border-yellow-500 bg-yellow-900';
      default: return 'border-blue-500 bg-blue-900';
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, active: false } : alert
    ));
  };

  const activeAlerts = alerts.filter(alert => alert.active);

  if (activeAlerts.length === 0) return null;

  return (
    <>
      {/* Alert indicator */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowAlerts(!showAlerts)}
          className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg animate-pulse"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🚨</span>
            <span className="bg-red-800 text-xs px-2 py-1 rounded-full">
              {activeAlerts.length}
            </span>
          </div>
        </button>
      </div>

      {/* Alerts panel */}
      {showAlerts && (
        <div className="fixed top-20 right-4 z-50 max-w-sm">
          <div className="bg-gray-900 border border-red-500 rounded-lg shadow-xl">
            <div className="p-4 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-red-400">Alertas de Emergencia</h3>
                <button 
                  onClick={() => setShowAlerts(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Sistema CBS - IFT México
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {activeAlerts.map(alert => (
                <div key={alert.id} className={`p-4 border-l-4 ${getSeverityColor(alert.severity)}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getAlertIcon(alert.type)}</span>
                      <div className="font-semibold text-sm">{alert.title}</div>
                    </div>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="text-gray-400 hover:text-gray-300 text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-sm text-gray-300 mb-3">{alert.message}</p>

                  <div className="text-xs text-gray-400 space-y-1">
                    <div>📍 {alert.area}</div>
                    <div>🏛️ {alert.source}</div>
                    <div>🕐 {new Date(alert.timestamp).toLocaleString()}</div>
                  </div>

                  {alert.type === 'SISMO' && (
                    <div className="mt-3 bg-yellow-900 border border-yellow-600 rounded p-2 text-xs">
                      <div className="font-semibold text-yellow-200">Recomendaciones:</div>
                      <div className="text-yellow-100">
                        • Manténgase alejado de ventanas<br/>
                        • Busque refugio bajo escritorio<br/>
                        • No use elevadores
                      </div>
                    </div>
                  )}

                  {alert.type === 'AMBER' && (
                    <div className="mt-3 bg-red-900 border border-red-600 rounded p-2 text-xs">
                      <div className="font-semibold text-red-200">Acción Requerida:</div>
                      <div className="text-red-100">
                        Si tiene información, contacte inmediatamente al 911
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-gray-700 bg-gray-800">
              <div className="text-xs text-gray-400 text-center">
                Alertas oficiales del gobierno mexicano<br/>
                Powered by IFT Cell Broadcast Service
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Critical alert overlay */}
      {activeAlerts.some(alert => alert.severity === 'CRITICAL') && (
        <div className="fixed inset-0 bg-red-900 bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-red-800 border-2 border-red-400 rounded-lg p-6 max-w-md">
            {activeAlerts
              .filter(alert => alert.severity === 'CRITICAL')
              .map(alert => (
                <div key={alert.id} className="text-center">
                  <div className="text-6xl mb-4">{getAlertIcon(alert.type)}</div>
                  <h2 className="text-2xl font-bold text-red-100 mb-4">{alert.title}</h2>
                  <p className="text-red-200 mb-6">{alert.message}</p>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg"
                  >
                    Entendido
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}