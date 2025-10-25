import React, { useRef, useEffect, useState } from 'react';
import { LocationCoords } from '../types';

interface RealTimeMapProps {
    location: LocationCoords | null;
    error: string | null;
    showMechanics?: boolean;
    showTraffic?: boolean;
}

const RealTimeMap: React.FC<RealTimeMapProps> = ({ 
    location, 
    error, 
    showMechanics = true, 
    showTraffic = true 
}) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [mechanics, setMechanics] = useState<any[]>([]);
    const [trafficLevel, setTrafficLevel] = useState<'low' | 'medium' | 'high'>('medium');

    // Simulate real-time mechanics data
    useEffect(() => {
        if (!location) return;
        
        const simulatedMechanics = [
            { id: 1, lat: location.lat + 0.01, lon: location.lon + 0.01, name: "Juan Pérez", rating: 4.8, eta: "8 min", status: "available" },
            { id: 2, lat: location.lat - 0.015, lon: location.lon + 0.02, name: "Carlos López", rating: 4.6, eta: "12 min", status: "busy" },
            { id: 3, lat: location.lat + 0.02, lon: location.lon - 0.01, name: "Ana García", rating: 4.9, eta: "15 min", status: "available" }
        ];
        
        setMechanics(simulatedMechanics);
        
        // Simulate traffic updates
        const trafficInterval = setInterval(() => {
            const levels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
            setTrafficLevel(levels[Math.floor(Math.random() * levels.length)]);
        }, 5000);
        
        return () => clearInterval(trafficInterval);
    }, [location]);

    if (!location) {
        return (
            <div className="fixed inset-0 z-30 bg-gray-900 flex items-center justify-center">
                <div className="text-center p-6 bg-gray-800 rounded-lg">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <h3 className="text-white font-bold">Obteniendo ubicación...</h3>
                    <p className="text-gray-400 text-sm">Activando GPS de alta precisión</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-30 bg-gray-900">
            {/* Simulated Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
                <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
                </div>
            </div>

            {/* User Location */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                    <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                    <div className="absolute -inset-4 border-2 border-blue-400 rounded-full animate-ping opacity-30"></div>
                </div>
            </div>

            {/* Mechanics Markers */}
            {showMechanics && mechanics.map((mechanic) => (
                <div
                    key={mechanic.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                        top: `${50 + (mechanic.lat - location.lat) * 1000}%`,
                        left: `${50 + (mechanic.lon - location.lon) * 1000}%`
                    }}
                >
                    <div className="relative group cursor-pointer">
                        <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                            mechanic.status === 'available' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}>
                            <span className="absolute -top-1 -right-1 text-xs">🔧</span>
                        </div>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            <div className="font-bold">{mechanic.name}</div>
                            <div className="text-yellow-400">⭐ {mechanic.rating}</div>
                            <div className="text-green-400">ETA: {mechanic.eta}</div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Real-time Info Panel */}
            <div className="absolute top-4 left-4 right-4 z-40">
                <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-bold flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                            Mapa en Tiempo Real
                        </h3>
                        <div className="text-xs text-gray-400">
                            Actualizado hace 2s
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-lg font-bold text-green-400">{mechanics.filter(m => m.status === 'available').length}</div>
                            <div className="text-xs text-gray-400">Disponibles</div>
                        </div>
                        <div>
                            <div className={`text-lg font-bold ${
                                trafficLevel === 'low' ? 'text-green-400' : 
                                trafficLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                                {trafficLevel === 'low' ? '🟢' : trafficLevel === 'medium' ? '🟡' : '🔴'}
                            </div>
                            <div className="text-xs text-gray-400">Tráfico</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-blue-400">8min</div>
                            <div className="text-xs text-gray-400">ETA Promedio</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Location Details */}
            <div className="absolute bottom-4 left-4 right-4 z-40">
                <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-white font-bold">📍 Tu Ubicación</div>
                            <div className="text-gray-400 text-sm">
                                Lat: {location.lat.toFixed(6)}, Lon: {location.lon.toFixed(6)}
                            </div>
                            <div className="text-blue-400 text-sm">Precisión: ±3 metros</div>
                        </div>
                        <div className="text-right">
                            <div className="text-green-400 font-bold">GPS Activo</div>
                            <div className="text-xs text-gray-400">Alta precisión</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <div className="absolute bottom-24 right-4 z-40">
                <button className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-colors">
                    <span className="text-xl">🚨</span>
                </button>
            </div>
        </div>
    );
};

export default RealTimeMap;