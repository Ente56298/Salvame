import React, { useState, useEffect } from 'react';
import { LocationCoords } from '../types';

interface UberStyleMapProps {
    location: LocationCoords | null;
    onRequestService: () => void;
}

const UberStyleMap: React.FC<UberStyleMapProps> = ({ location, onRequestService }) => {
    const [mechanics, setMechanics] = useState<any[]>([]);
    const [selectedMechanic, setSelectedMechanic] = useState<any>(null);
    const [isRequesting, setIsRequesting] = useState(false);

    useEffect(() => {
        if (!location) return;
        
        const nearbyMechanics = [
            { id: 1, lat: location.lat + 0.008, lon: location.lon + 0.012, name: "Juan Pérez", rating: 4.8, eta: "3 min", price: "$450", type: "Mecánico", distance: "0.8 km" },
            { id: 2, lat: location.lat - 0.012, lon: location.lon + 0.015, name: "Carlos López", rating: 4.6, eta: "5 min", price: "$520", type: "Grúa", distance: "1.2 km" },
            { id: 3, lat: location.lat + 0.015, lon: location.lon - 0.008, name: "Ana García", rating: 4.9, eta: "7 min", price: "$380", type: "Mecánico", distance: "1.5 km" },
            { id: 4, lat: location.lat - 0.006, lon: location.lon - 0.018, name: "Miguel Torres", rating: 4.7, eta: "4 min", price: "$600", type: "Grúa", distance: "1.0 km" }
        ];
        
        setMechanics(nearbyMechanics);
    }, [location]);

    const handleMechanicSelect = (mechanic: any) => {
        setSelectedMechanic(mechanic);
    };

    const handleRequestService = () => {
        setIsRequesting(true);
        setTimeout(() => {
            onRequestService();
            setIsRequesting(false);
        }, 2000);
    };

    if (!location) {
        return (
            <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-white">Obteniendo tu ubicación...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-gray-900">
            {/* Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
                <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full" style={{
                        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                                         radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                                         radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)`
                    }}></div>
                </div>
            </div>

            {/* User Location */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="relative">
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="absolute -inset-3 border-2 border-blue-400 rounded-full animate-ping opacity-30"></div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        Tu ubicación
                    </div>
                </div>
            </div>

            {/* Mechanics on Map */}
            {mechanics.map((mechanic) => (
                <div
                    key={mechanic.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
                    style={{
                        top: `${50 + (mechanic.lat - location.lat) * 800}%`,
                        left: `${50 + (mechanic.lon - location.lon) * 800}%`
                    }}
                    onClick={() => handleMechanicSelect(mechanic)}
                >
                    <div className={`relative transition-all duration-200 ${selectedMechanic?.id === mechanic.id ? 'scale-125' : 'hover:scale-110'}`}>
                        <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                            mechanic.type === 'Mecánico' ? 'bg-green-500' : 'bg-orange-500'
                        }`}>
                            <span className="text-white text-xs">{mechanic.type === 'Mecánico' ? '🔧' : '🚛'}</span>
                        </div>
                        {selectedMechanic?.id === mechanic.id && (
                            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-2 shadow-lg min-w-max">
                                <div className="text-xs font-bold text-gray-800">{mechanic.name}</div>
                                <div className="text-xs text-gray-600">⭐ {mechanic.rating} • {mechanic.eta}</div>
                                <div className="text-xs font-bold text-green-600">{mechanic.price}</div>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* Bottom Panel - Uber Style */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-30">
                <div className="p-6">
                    {!selectedMechanic ? (
                        <>
                            <div className="text-center mb-4">
                                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">¿Necesitas asistencia?</h2>
                                <p className="text-gray-600 text-sm">Selecciona un mecánico en el mapa</p>
                            </div>
                            
                            <div className="space-y-3">
                                {mechanics.slice(0, 3).map((mechanic) => (
                                    <div
                                        key={mechanic.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => handleMechanicSelect(mechanic)}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                                mechanic.type === 'Mecánico' ? 'bg-green-100' : 'bg-orange-100'
                                            }`}>
                                                <span className="text-lg">{mechanic.type === 'Mecánico' ? '🔧' : '🚛'}</span>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-800">{mechanic.name}</div>
                                                <div className="text-sm text-gray-600">⭐ {mechanic.rating} • {mechanic.distance}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-800">{mechanic.price}</div>
                                            <div className="text-sm text-gray-600">{mechanic.eta}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="text-center mb-4">
                                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
                                <h2 className="text-xl font-bold text-gray-800">Confirmar servicio</h2>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
                                            selectedMechanic.type === 'Mecánico' ? 'bg-green-100' : 'bg-orange-100'
                                        }`}>
                                            <span className="text-xl">{selectedMechanic.type === 'Mecánico' ? '🔧' : '🚛'}</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800">{selectedMechanic.name}</div>
                                            <div className="text-sm text-gray-600">⭐ {selectedMechanic.rating} • {selectedMechanic.type}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-gray-800">{selectedMechanic.price}</div>
                                        <div className="text-sm text-gray-600">ETA: {selectedMechanic.eta}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                                    <div>
                                        <div className="text-gray-500">Distancia</div>
                                        <div className="font-semibold">{selectedMechanic.distance}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">Tiempo</div>
                                        <div className="font-semibold">{selectedMechanic.eta}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">Rating</div>
                                        <div className="font-semibold">⭐ {selectedMechanic.rating}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedMechanic(null)}
                                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleRequestService}
                                    disabled={isRequesting}
                                    className="flex-2 bg-black text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                                >
                                    {isRequesting ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                            Solicitando...
                                        </div>
                                    ) : (
                                        'Solicitar Servicio'
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Top Status Bar */}
            <div className="absolute top-4 left-4 right-4 z-40">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-800">4 mecánicos cerca</span>
                    </div>
                    <div className="text-sm text-gray-600">
                        📍 {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UberStyleMap;