import { useState, useEffect } from 'react';

interface Vehicle {
  id: string;
  plate: string;
  driver: string;
  status: 'ACTIVE' | 'IDLE' | 'MAINTENANCE' | 'EMERGENCY';
  location: { lat: number; lng: number };
  fuel: number;
  speed: number;
  lastUpdate: string;
  alerts: string[];
}

interface FleetAlert {
  id: string;
  vehicleId: string;
  type: 'SPEED' | 'FUEL' | 'MAINTENANCE' | 'EMERGENCY' | 'GEOFENCE';
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: string;
  resolved: boolean;
}

export default function FleetManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [alerts, setAlerts] = useState<FleetAlert[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  useEffect(() => {
    // Mock fleet data
    const mockVehicles: Vehicle[] = [
      {
        id: 'VEH-001',
        plate: 'ABC-123-D',
        driver: 'Juan Pérez',
        status: 'ACTIVE',
        location: { lat: 19.4326, lng: -99.1332 },
        fuel: 75,
        speed: 45,
        lastUpdate: new Date().toISOString(),
        alerts: []
      },
      {
        id: 'VEH-002', 
        plate: 'XYZ-456-E',
        driver: 'María González',
        status: 'EMERGENCY',
        location: { lat: 19.3895, lng: -99.1677 },
        fuel: 15,
        speed: 0,
        lastUpdate: new Date(Date.now() - 300000).toISOString(),
        alerts: ['LOW_FUEL', 'ENGINE_WARNING']
      },
      {
        id: 'VEH-003',
        plate: 'DEF-789-F',
        driver: 'Carlos Rodríguez',
        status: 'IDLE',
        location: { lat: 19.4284, lng: -99.1677 },
        fuel: 90,
        speed: 0,
        lastUpdate: new Date(Date.now() - 600000).toISOString(),
        alerts: []
      }
    ];

    setVehicles(mockVehicles);

    // Generate fleet alerts
    const mockAlerts: FleetAlert[] = [
      {
        id: 'ALERT-001',
        vehicleId: 'VEH-002',
        type: 'EMERGENCY',
        message: 'Vehículo detenido con alertas críticas',
        severity: 'HIGH',
        timestamp: new Date().toISOString(),
        resolved: false
      },
      {
        id: 'ALERT-002',
        vehicleId: 'VEH-001',
        type: 'SPEED',
        message: 'Exceso de velocidad detectado (85 km/h en zona de 60)',
        severity: 'MEDIUM',
        timestamp: new Date(Date.now() - 180000).toISOString(),
        resolved: false
      }
    ];

    setAlerts(mockAlerts);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-400';
      case 'IDLE': return 'text-yellow-400';
      case 'MAINTENANCE': return 'text-blue-400';
      case 'EMERGENCY': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'border-red-500 bg-red-900/20';
      case 'MEDIUM': return 'border-yellow-500 bg-yellow-900/20';
      default: return 'border-blue-500 bg-blue-900/20';
    }
  };

  const sendAssistance = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;

    const assistanceRequest = {
      vehicleId,
      plate: vehicle.plate,
      driver: vehicle.driver,
      location: vehicle.location,
      alerts: vehicle.alerts,
      timestamp: new Date().toISOString(),
      requestedBy: 'Fleet Manager'
    };

    // Send to assistance API
    fetch('/api/fleet-assistance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assistanceRequest)
    }).catch(error => console.error('Fleet assistance request failed:', error));

    alert(`Asistencia enviada para vehículo ${vehicle.plate}\nConductor: ${vehicle.driver}`);
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const emergencyStop = (vehicleId: string) => {
    const confirmed = confirm('¿Está seguro de activar el paro de motor de emergencia?\n\nEsta acción detendrá el vehículo inmediatamente.');
    
    if (confirmed) {
      // Update vehicle status
      setVehicles(prev => prev.map(vehicle => 
        vehicle.id === vehicleId 
          ? { ...vehicle, status: 'EMERGENCY', speed: 0 }
          : vehicle
      ));

      // Add emergency alert
      const emergencyAlert: FleetAlert = {
        id: `EMERGENCY-${Date.now()}`,
        vehicleId,
        type: 'EMERGENCY',
        message: 'Paro de motor activado remotamente por seguridad',
        severity: 'HIGH',
        timestamp: new Date().toISOString(),
        resolved: false
      };

      setAlerts(prev => [emergencyAlert, ...prev]);

      alert('Paro de motor activado. El vehículo se detendrá de forma segura.');
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const emergencyVehicles = vehicles.filter(v => v.status === 'EMERGENCY');

  return (
    <div className="space-y-6">
      {/* Fleet Overview */}
      <div className="rocket-card p-4">
        <h3 className="font-semibold mb-4">Gestión de Flotilla</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-800 rounded p-3 text-center">
            <div className="text-2xl font-bold text-green-400">{vehicles.filter(v => v.status === 'ACTIVE').length}</div>
            <div className="text-xs text-gray-400">Activos</div>
          </div>
          <div className="bg-gray-800 rounded p-3 text-center">
            <div className="text-2xl font-bold text-red-400">{emergencyVehicles.length}</div>
            <div className="text-xs text-gray-400">Emergencias</div>
          </div>
          <div className="bg-gray-800 rounded p-3 text-center">
            <div className="text-2xl font-bold text-yellow-400">{activeAlerts.length}</div>
            <div className="text-xs text-gray-400">Alertas</div>
          </div>
          <div className="bg-gray-800 rounded p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">{vehicles.length}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
        </div>

        {/* Vehicle List */}
        <div className="space-y-2">
          {vehicles.map(vehicle => (
            <div key={vehicle.id} className="bg-gray-800 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold">{vehicle.plate}</div>
                  <div className="text-sm text-gray-400">{vehicle.driver}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${getStatusColor(vehicle.status)}`}>
                    {vehicle.status}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(vehicle.lastUpdate).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs mb-3">
                <div>
                  <span className="text-gray-400">Combustible:</span>
                  <span className={`ml-1 ${vehicle.fuel < 20 ? 'text-red-400' : 'text-green-400'}`}>
                    {vehicle.fuel}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Velocidad:</span>
                  <span className="ml-1">{vehicle.speed} km/h</span>
                </div>
                <div>
                  <span className="text-gray-400">Alertas:</span>
                  <span className={`ml-1 ${vehicle.alerts.length > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {vehicle.alerts.length}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedVehicle(vehicle.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
                >
                  📍 Ver Ubicación
                </button>
                
                {vehicle.status === 'EMERGENCY' && (
                  <button
                    onClick={() => sendAssistance(vehicle.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                  >
                    🚨 Enviar Asistencia
                  </button>
                )}

                <button
                  onClick={() => emergencyStop(vehicle.id)}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1 rounded"
                >
                  🛑 Paro Motor
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="rocket-card p-4">
          <h3 className="font-semibold mb-4">Alertas Activas</h3>
          <div className="space-y-3">
            {activeAlerts.map(alert => (
              <div key={alert.id} className={`border-l-4 p-3 rounded ${getSeverityColor(alert.severity)}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-sm">{alert.type}</div>
                    <div className="text-xs text-gray-400">
                      Vehículo: {vehicles.find(v => v.id === alert.vehicleId)?.plate}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    alert.severity === 'HIGH' ? 'bg-red-600' :
                    alert.severity === 'MEDIUM' ? 'bg-yellow-600' : 'bg-blue-600'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                
                <p className="text-sm text-gray-300 mb-3">{alert.message}</p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => sendAssistance(alert.vehicleId)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                  >
                    Enviar Asistencia
                  </button>
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded"
                  >
                    Resolver
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Assistant */}
      <div className="rocket-card p-4">
        <h3 className="font-semibold mb-4">Asistente IA - A.N.I.A.</h3>
        <div className="bg-purple-900/20 border border-purple-500 rounded p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-purple-200 font-semibold text-sm">A.N.I.A. Activo</span>
          </div>
          <div className="text-sm text-purple-100 mb-3">
            Analizando patrones de conducción y optimizando rutas en tiempo real...
          </div>
          <div className="text-xs text-purple-200">
            • 2 alertas de velocidad procesadas<br/>
            • 1 ruta optimizada por tráfico<br/>
            • 0 incidentes de seguridad detectados
          </div>
        </div>
      </div>
    </div>
  );
}