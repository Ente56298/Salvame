import React, { useState, useEffect } from 'react';
import { useGameification } from '../hooks/useGameification';

interface ServiceStatus {
  id: string;
  name: string;
  type: 'taller' | 'grua' | 'gasolinera' | 'vulcanizadora';
  status: 'disponible' | 'ocupado' | 'en_camino' | 'offline';
  eta: number; // minutos
  distance: number; // km
  price: number; // pesos
  rating: number; // 1-5
  location: { lat: number; lng: number };
}

const RealTimeTracking: React.FC = () => {
  const { actions } = useGameification();
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceStatus | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    // Simular servicios en tiempo real
    const mockServices: ServiceStatus[] = [
      {
        id: '1',
        name: 'Taller Mecánico Express',
        type: 'taller',
        status: 'disponible',
        eta: 15,
        distance: 2.3,
        price: 350,
        rating: 4.5,
        location: { lat: 19.4326, lng: -99.1332 }
      },
      {
        id: '2',
        name: 'Grúas Rápidas 24/7',
        type: 'grua',
        status: 'en_camino',
        eta: 8,
        distance: 1.2,
        price: 800,
        rating: 4.8,
        location: { lat: 19.4350, lng: -99.1300 }
      },
      {
        id: '3',
        name: 'Vulcanizadora El Rayo',
        type: 'vulcanizadora',
        status: 'ocupado',
        eta: 25,
        distance: 3.1,
        price: 150,
        rating: 4.2,
        location: { lat: 19.4280, lng: -99.1380 }
      },
      {
        id: '4',
        name: 'Pemex Insurgentes',
        type: 'gasolinera',
        status: 'disponible',
        eta: 5,
        distance: 0.8,
        price: 24,
        rating: 4.0,
        location: { lat: 19.4340, lng: -99.1320 }
      }
    ];

    setServices(mockServices);
    actions.addXP(25, 'Iniciaste tracking en tiempo real');

    // Simular actualizaciones cada 10 segundos
    const interval = setInterval(() => {
      setServices(prev => prev.map(service => ({
        ...service,
        eta: Math.max(1, service.eta + (Math.random() - 0.6) * 3),
        status: Math.random() > 0.8 ? 
          (['disponible', 'ocupado', 'en_camino'] as const)[Math.floor(Math.random() * 3)] : 
          service.status
      })));
    }, 10000);

    return () => clearInterval(interval);
  }, [actions]);

  const getServiceIcon = (type: ServiceStatus['type']) => {
    switch (type) {
      case 'taller': return '🔧';
      case 'grua': return '🚛';
      case 'gasolinera': return '⛽';
      case 'vulcanizadora': return '🛞';
    }
  };

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'disponible': return 'text-green-400';
      case 'ocupado': return 'text-yellow-400';
      case 'en_camino': return 'text-blue-400';
      case 'offline': return 'text-red-400';
    }
  };

  const getStatusText = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'disponible': return 'Disponible';
      case 'ocupado': return 'Ocupado';
      case 'en_camino': return 'En camino';
      case 'offline': return 'Sin conexión';
    }
  };

  const handleTrackService = (service: ServiceStatus) => {
    setSelectedService(service);
    setIsTracking(true);
    actions.addXP(15, `Iniciaste tracking de ${service.name}`);
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    setSelectedService(null);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">📡</span>
        <div>
          <h2 className="text-xl font-bold text-white">Tracking en Tiempo Real</h2>
          <p className="text-gray-400">Servicios activos con estimaciones precisas</p>
        </div>
      </div>

      {/* Active Tracking */}
      {isTracking && selectedService && (
        <div className="mb-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">🎯 Tracking Activo</h3>
            <button
              onClick={handleStopTracking}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Detener
            </button>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl">{getServiceIcon(selectedService.type)}</span>
            <div className="flex-1">
              <h4 className="font-bold text-white">{selectedService.name}</h4>
              <div className={`text-sm ${getStatusColor(selectedService.status)}`}>
                {getStatusText(selectedService.status)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-400">{selectedService.eta.toFixed(0)}</div>
              <div className="text-sm text-gray-300">min</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="bg-gray-600 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${Math.max(10, 100 - (selectedService.eta * 2))}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Iniciado</span>
              <span>ETA: {selectedService.eta.toFixed(0)} min</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-white font-bold">{selectedService.distance.toFixed(1)} km</div>
              <div className="text-gray-400">Distancia</div>
            </div>
            <div className="text-center">
              <div className="text-white font-bold">${selectedService.price}</div>
              <div className="text-gray-400">Precio est.</div>
            </div>
            <div className="text-center">
              <div className="text-white font-bold">{selectedService.rating} ⭐</div>
              <div className="text-gray-400">Rating</div>
            </div>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="space-y-4">
        <h3 className="font-bold text-white mb-4">🚗 Servicios Disponibles</h3>
        
        {services.map((service) => (
          <div key={service.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getServiceIcon(service.type)}</span>
                <div>
                  <h4 className="font-bold text-white">{service.name}</h4>
                  <div className={`text-sm ${getStatusColor(service.status)}`}>
                    {getStatusText(service.status)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-400">{service.eta.toFixed(0)} min</div>
                  <div className="text-xs text-gray-400">{service.distance.toFixed(1)} km</div>
                </div>
                
                {service.status === 'disponible' && (
                  <button
                    onClick={() => handleTrackService(service)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
                    disabled={isTracking}
                  >
                    {isTracking ? 'Tracking...' : 'Trackear'}
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-white font-bold">${service.price}</div>
                <div className="text-gray-400">Precio</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold">{service.rating} ⭐</div>
                <div className="text-gray-400">Rating</div>
              </div>
              <div className="text-center">
                <div className={`font-bold ${getStatusColor(service.status)}`}>
                  {service.status === 'disponible' ? '✅' : 
                   service.status === 'ocupado' ? '⏳' :
                   service.status === 'en_camino' ? '🚗' : '❌'}
                </div>
                <div className="text-gray-400">Estado</div>
              </div>
            </div>

            {/* ETA Bar */}
            <div className="mt-3">
              <div className="bg-gray-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    service.eta <= 10 ? 'bg-green-500' :
                    service.eta <= 20 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.max(10, 100 - (service.eta * 2))}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-blue-400">{services.length}</div>
          <div className="text-sm text-gray-300">Servicios</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-green-400">
            {services.filter(s => s.status === 'disponible').length}
          </div>
          <div className="text-sm text-gray-300">Disponibles</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {services.filter(s => s.eta <= 15).length}
          </div>
          <div className="text-sm text-gray-300">Rápidos</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-purple-400">
            {isTracking ? '🎯' : '⏸️'}
          </div>
          <div className="text-sm text-gray-300">Tracking</div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeTracking;