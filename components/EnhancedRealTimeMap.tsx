import React, { useState, useEffect } from 'react';
import { LocationCoords } from '../types';

interface EnhancedRealTimeMapProps {
    location: LocationCoords | null;
    onRequestService: () => void;
}

const EnhancedRealTimeMap: React.FC<EnhancedRealTimeMapProps> = ({ location, onRequestService }) => {
    const [mechanics, setMechanics] = useState<any[]>([]);
    const [selectedMechanic, setSelectedMechanic] = useState<any>(null);
    const [liveUpdates, setLiveUpdates] = useState(0);
    const [trafficLevel, setTrafficLevel] = useState<'low' | 'medium' | 'high'>('medium');

    useEffect(() => {
        const testLocation = location || { lat: 19.4326, lon: -99.1332 };
        
        const nearbyMechanics = [
            { 
                id: 1, 
                lat: testLocation.lat + 0.008, 
                lon: testLocation.lon + 0.012, 
                name: "Juan Pérez", 
                rating: 4.8, 
                eta: "3 min", 
                price: "$450", 
                type: "Mecánico",
                status: "available",
                distance: "0.8 km",
                vehicle: "Nissan Tsuru Blanco",
                plate: "ABC-123"
            },
            { 
                id: 2, 
                lat: testLocation.lat - 0.012, 
                lon: testLocation.lon + 0.015, 
                name: "Carlos López", 
                rating: 4.6, 
                eta: "5 min", 
                price: "$520", 
                type: "Grúa",
                status: "busy",
                distance: "1.2 km",
                vehicle: "Ford F-150 Roja",
                plate: "DEF-456"
            },
            { 
                id: 3, 
                lat: testLocation.lat + 0.015, 
                lon: testLocation.lon - 0.008, 
                name: "Ana García", 
                rating: 4.9, 
                eta: "7 min", 
                price: "$380", 
                type: "Mecánico",
                status: "available",
                distance: "1.5 km",
                vehicle: "Chevrolet Aveo Azul",
                plate: "GHI-789"
            }
        ];
        
        setMechanics(nearbyMechanics);

        // Simulate real-time updates
        const interval = setInterval(() => {
            setLiveUpdates(prev => prev + 1);
            
            // Update traffic randomly
            const levels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
            setTrafficLevel(levels[Math.floor(Math.random() * levels.length)]);
            
            // Update mechanic positions slightly
            setMechanics(prev => prev.map(mechanic => ({
                ...mechanic,
                lat: mechanic.lat + (Math.random() - 0.5) * 0.001,
                lon: mechanic.lon + (Math.random() - 0.5) * 0.001,
                eta: `${Math.floor(Math.random() * 10) + 2} min`
            })));
        }, 3000);

        return () => clearInterval(interval);
    }, [location]);

    const testLocation = location || { lat: 19.4326, lon: -99.1332 };
    const availableMechanics = mechanics.filter(m => m.status === 'available');

    return (
        <div className="fixed inset-0 bg-gray-900">
            {/* Enhanced Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
                <div className="absolute inset-0 opacity-30">
                    <div className="w-full h-full" style={{
                        backgroundImage: `
                            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
                            radial-gradient(circle at 40% 80%, rgba(245, 158, 11, 0.15) 0%, transparent 50%)
                        `
                    }}></div>
                </div>
                
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M0 0h40v1H0zM0 20h40v1H0z\"/%3E%3Cpath d=\"M0 0v40h1V0zM20 0v40h1V0z\"/%3E%3C/g%3E%3C/svg%3E')]"></div>
                </div>
            </div>

            {/* User Location with Enhanced Animation */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="relative">
                    <div className="w-5 h-5 bg-blue-500 rounded-full border-3 border-white shadow-xl"></div>
                    <div className="absolute -inset-4 border-2 border-blue-400 rounded-full animate-ping opacity-40"></div>
                    <div className="absolute -inset-6 border border-blue-300 rounded-full animate-pulse opacity-20"></div>
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
                        📍 Tu ubicación
                    </div>
                </div>
            </div>

            {/* Enhanced Mechanics Markers */}
            {mechanics.map((mechanic) => (
                <div
                    key={mechanic.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
                    style={{
                        top: `${50 + (mechanic.lat - testLocation.lat) * 800}%`,
                        left: `${50 + (mechanic.lon - testLocation.lon) * 800}%`
                    }}
                    onClick={() => setSelectedMechanic(mechanic)}
                >
                    <div className={`relative transition-all duration-300 ${
                        selectedMechanic?.id === mechanic.id ? 'scale-125 z-30' : 'hover:scale-110'
                    }`}>
                        <div className={`w-10 h-10 rounded-full border-3 border-white shadow-xl flex items-center justify-center ${
                            mechanic.status === 'available' 
                                ? (mechanic.type === 'Mecánico' ? 'bg-green-500' : 'bg-blue-500')
                                : 'bg-gray-500'
                        }`}>
                            <span className="text-white text-sm">
                                {mechanic.type === 'Mecánico' ? '🔧' : '🚛'}
                            </span>
                        </div>
                        
                        {/* Status indicator */}
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            mechanic.status === 'available' ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                        
                        {/* Enhanced Tooltip */}
                        {selectedMechanic?.id === mechanic.id && (
                            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-xl p-3 shadow-2xl min-w-max border">
                                <div className="text-sm font-bold text-gray-800">{mechanic.name}</div>
                                <div className="text-xs text-gray-600 flex items-center">
                                    <span className="text-yellow-500 mr-1">⭐</span>
                                    {mechanic.rating} • {mechanic.distance}
                                </div>
                                <div className="text-xs font-bold text-green-600 mt-1">{mechanic.price} • {mechanic.eta}</div>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* Enhanced Top Status Bar */}
            <div className="absolute top-4 left-4 right-4 z-40">
                <div className="bg-white/95 backdrop-blur-lg rounded-2xl px-6 py-3 shadow-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                <span className="text-sm font-semibold text-gray-800">
                                    {availableMechanics.length} disponibles
                                </span>
                            </div>
                            <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-2 ${
                                    trafficLevel === 'low' ? 'bg-green-400' : 
                                    trafficLevel === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                                }`}></div>
                                <span className="text-xs text-gray-600">
                                    Tráfico {trafficLevel === 'low' ? 'fluido' : trafficLevel === 'medium' ? 'moderado' : 'pesado'}
                                </span>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500">
                            Actualizado hace {liveUpdates % 10}s
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Bottom Panel */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-30 border-t border-gray-200">
                <div className="p-6">
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>
                    
                    {!selectedMechanic ? (
                        <>
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Asistencia Disponible</h2>
                                <p className="text-gray-600">Selecciona un mecánico en el mapa</p>
                            </div>
                            
                            <div className="space-y-4">
                                {availableMechanics.slice(0, 3).map((mechanic) => (
                                    <div
                                        key={mechanic.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all duration-200 border border-gray-100"
                                        onClick={() => setSelectedMechanic(mechanic)}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-4 ${
                                                mechanic.type === 'Mecánico' ? 'bg-green-100' : 'bg-blue-100'
                                            }`}>
                                                <span className="text-2xl">
                                                    {mechanic.type === 'Mecánico' ? '🔧' : '🚛'}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 text-lg">{mechanic.name}</div>
                                                <div className="text-sm text-gray-600 flex items-center">
                                                    <span className="text-yellow-500 mr-1">⭐</span>
                                                    <span>{mechanic.rating}</span>
                                                    <span className="mx-2 text-gray-400">•</span>
                                                    <span>{mechanic.distance}</span>
                                                </div>
                                                <div className="text-xs text-gray-500">{mechanic.vehicle}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-gray-800">{mechanic.price}</div>
                                            <div className="text-sm text-green-600 font-semibold">{mechanic.eta}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Confirmar Servicio</h2>
                                <p className="text-gray-600">Revisa los detalles antes de continuar</p>
                            </div>

                            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 mb-6 border border-blue-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mr-4 ${
                                            selectedMechanic.type === 'Mecánico' ? 'bg-green-100' : 'bg-blue-100'
                                        }`}>
                                            <span className="text-3xl">
                                                {selectedMechanic.type === 'Mecánico' ? '🔧' : '🚛'}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800 text-xl">{selectedMechanic.name}</div>
                                            <div className="text-sm text-gray-600 flex items-center">
                                                <span className="text-yellow-500 mr-1">⭐</span>
                                                <span>{selectedMechanic.rating}</span>
                                                <span className="mx-2">•</span>
                                                <span>{selectedMechanic.type}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">{selectedMechanic.vehicle} • {selectedMechanic.plate}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-gray-800">{selectedMechanic.price}</div>
                                        <div className="text-sm text-green-600 font-semibold">ETA: {selectedMechanic.eta}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                                    <div className="bg-white/70 rounded-xl p-3">
                                        <div className="text-gray-500 text-xs">Distancia</div>
                                        <div className="font-bold text-gray-800">{selectedMechanic.distance}</div>
                                    </div>
                                    <div className="bg-white/70 rounded-xl p-3">
                                        <div className="text-gray-500 text-xs">Tiempo</div>
                                        <div className="font-bold text-gray-800">{selectedMechanic.eta}</div>
                                    </div>
                                    <div className="bg-white/70 rounded-xl p-3">
                                        <div className="text-gray-500 text-xs">Rating</div>
                                        <div className="font-bold text-gray-800">⭐ {selectedMechanic.rating}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setSelectedMechanic(null)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 rounded-2xl font-bold transition-all duration-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={onRequestService}
                                    className="flex-2 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-4 px-8 rounded-2xl font-bold transition-all duration-200 shadow-lg"
                                >
                                    Solicitar Servicio
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EnhancedRealTimeMap;