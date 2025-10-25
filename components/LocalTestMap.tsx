import React, { useState, useEffect } from 'react';
import { LocationCoords } from '../types';

interface LocalTestMapProps {
    location: LocationCoords | null;
    onRequestService: () => void;
}

const LocalTestMap: React.FC<LocalTestMapProps> = ({ location, onRequestService }) => {
    const [mechanics, setMechanics] = useState<any[]>([]);
    const [selectedMechanic, setSelectedMechanic] = useState<any>(null);

    useEffect(() => {
        // Use Mexico City as default for local testing
        const testLocation = location || { lat: 19.4326, lon: -99.1332 };
        
        const nearbyMechanics = [
            { id: 1, lat: testLocation.lat + 0.008, lon: testLocation.lon + 0.012, name: "Juan Pérez", rating: 4.8, eta: "3 min", price: "$450", type: "Mecánico" },
            { id: 2, lat: testLocation.lat - 0.012, lon: testLocation.lon + 0.015, name: "Carlos López", rating: 4.6, eta: "5 min", price: "$520", type: "Grúa" },
            { id: 3, lat: testLocation.lat + 0.015, lon: testLocation.lon - 0.008, name: "Ana García", rating: 4.9, eta: "7 min", price: "$380", type: "Mecánico" }
        ];
        
        setMechanics(nearbyMechanics);
    }, [location]);

    const testLocation = location || { lat: 19.4326, lon: -99.1332 };

    return (
        <div className="fixed inset-0 bg-gray-900">
            {/* Simulated Map */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
                <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
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

            {/* Mechanics */}
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
                    <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                        mechanic.type === 'Mecánico' ? 'bg-green-500' : 'bg-orange-500'
                    } ${selectedMechanic?.id === mechanic.id ? 'scale-125' : 'hover:scale-110'} transition-all`}>
                        <span className="text-white text-xs">{mechanic.type === 'Mecánico' ? '🔧' : '🚛'}</span>
                    </div>
                </div>
            ))}

            {/* Bottom Panel */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-30">
                <div className="p-6">
                    <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
                    
                    {!selectedMechanic ? (
                        <>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Mecánicos Disponibles</h2>
                            <div className="space-y-3">
                                {mechanics.map((mechanic) => (
                                    <div
                                        key={mechanic.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100"
                                        onClick={() => setSelectedMechanic(mechanic)}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                                mechanic.type === 'Mecánico' ? 'bg-green-100' : 'bg-orange-100'
                                            }`}>
                                                <span className="text-lg">{mechanic.type === 'Mecánico' ? '🔧' : '🚛'}</span>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-800">{mechanic.name}</div>
                                                <div className="text-sm text-gray-600">⭐ {mechanic.rating} • {mechanic.eta}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-800">{mechanic.price}</div>
                                            <div className="text-sm text-green-600">Disponible</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Confirmar Servicio</h2>
                            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                <div className="flex items-center justify-between">
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
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedMechanic(null)}
                                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={onRequestService}
                                    className="flex-2 bg-black text-white py-3 px-6 rounded-xl font-semibold"
                                >
                                    Solicitar Servicio
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Top Status */}
            <div className="absolute top-4 left-4 right-4 z-40">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-800">LOCAL TEST MODE</span>
                    </div>
                    <div className="text-sm text-gray-600">
                        📍 CDMX Demo
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocalTestMap;