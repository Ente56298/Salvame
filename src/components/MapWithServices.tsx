import React, { useState, useEffect, useRef } from 'react';
import { LocationCoords, Service } from '../types';

interface MapWithServicesProps {
    location: LocationCoords | null;
    onRequestService: () => void;
    services?: Service[];
}

const MapWithServices: React.FC<MapWithServicesProps> = ({ location, onRequestService, services = [] }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [mechanics, setMechanics] = useState<any[]>([]);
    const [selectedMechanic, setSelectedMechanic] = useState<any>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    useEffect(() => {
        const testLocation = location || { lat: 19.4326, lon: -99.1332 };
        
        const nearbyMechanics = [
            { id: 1, lat: testLocation.lat + 0.008, lon: testLocation.lon + 0.012, name: "Juan Pérez", rating: 4.8, eta: "3 min", price: "$450", type: "Mecánico" },
            { id: 2, lat: testLocation.lat - 0.012, lon: testLocation.lon + 0.015, name: "Carlos López", rating: 4.6, eta: "5 min", price: "$520", type: "Grúa" },
            { id: 3, lat: testLocation.lat + 0.015, lon: testLocation.lon - 0.008, name: "Ana García", rating: 4.9, eta: "7 min", price: "$380", type: "Mecánico" }
        ];
        
        setMechanics(nearbyMechanics);
    }, [location]);

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setPan({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const getServiceIcon = (tipo: string) => {
        switch (tipo.toLowerCase()) {
            case 'gasolinera': return '⛽';
            case 'taller': case 'taller mecánico': return '🔧';
            case 'hospital': return '🏥';
            case 'farmacia': return '💊';
            case 'restaurante': return '🍽️';
            case 'hotel': return '🏨';
            default: return '🏪';
        }
    };

    const getServiceColor = (tipo: string) => {
        switch (tipo.toLowerCase()) {
            case 'gasolinera': return 'bg-yellow-500';
            case 'taller': case 'taller mecánico': return 'bg-orange-500';
            case 'hospital': return 'bg-red-500';
            case 'farmacia': return 'bg-green-500';
            case 'restaurante': return 'bg-purple-500';
            case 'hotel': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    const testLocation = location || { lat: 19.4326, lon: -99.1332 };

    return (
        <div className="fixed inset-0 bg-gray-900 overflow-hidden">
            <div
                ref={mapRef}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div
                    className="w-full h-full transition-transform duration-100"
                    style={{
                        transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                        background: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #0f172a 100%)'
                    }}
                >
                    {/* User Location */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                        <div className="relative">
                            <div className="w-5 h-5 bg-blue-500 rounded-full border-3 border-white shadow-xl"></div>
                            <div className="absolute -inset-4 border-2 border-blue-400 rounded-full animate-ping opacity-40"></div>
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
                            <div className={`w-10 h-10 rounded-full border-3 border-white shadow-xl flex items-center justify-center ${
                                mechanic.type === 'Mecánico' ? 'bg-green-500' : 'bg-blue-500'
                            } ${selectedMechanic?.id === mechanic.id ? 'scale-125' : 'hover:scale-110'} transition-all`}>
                                <span className="text-white text-sm">
                                    {mechanic.type === 'Mecánico' ? '🔧' : '🚛'}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Services */}
                    {services.map((service, index) => {
                        const serviceLocation = {
                            lat: testLocation.lat + (Math.random() - 0.5) * 0.02,
                            lon: testLocation.lon + (Math.random() - 0.5) * 0.02
                        };
                        
                        return (
                            <div
                                key={`service-${index}`}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-15 cursor-pointer"
                                style={{
                                    top: `${50 + (serviceLocation.lat - testLocation.lat) * 800}%`,
                                    left: `${50 + (serviceLocation.lon - testLocation.lon) * 800}%`
                                }}
                                onClick={() => setSelectedService(service)}
                            >
                                <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                                    getServiceColor(service.tipo)
                                } ${selectedService === service ? 'scale-125' : 'hover:scale-110'} transition-all`}>
                                    <span className="text-white text-xs">
                                        {getServiceIcon(service.tipo)}
                                    </span>
                                </div>
                                
                                {selectedService === service && (
                                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-2 shadow-lg min-w-max z-30">
                                        <div className="text-xs font-bold text-gray-800">{service.nombre}</div>
                                        <div className="text-xs text-gray-600">{service.tipo}</div>
                                        {service.telefono && (
                                            <div className="text-xs text-green-600">{service.telefono}</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Zoom Controls */}
            <div className="absolute top-20 right-4 z-40 bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-lg">
                <div className="flex flex-col space-y-2">
                    <button
                        onClick={() => setZoom(prev => Math.min(3, prev + 0.2))}
                        className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center font-bold text-gray-700"
                    >
                        +
                    </button>
                    <div className="text-xs text-center text-gray-600 px-2">
                        {Math.round(zoom * 100)}%
                    </div>
                    <button
                        onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}
                        className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center font-bold text-gray-700"
                    >
                        −
                    </button>
                </div>
            </div>

            {/* Reset View Button */}
            <div className="absolute top-20 left-4 z-40">
                <button
                    onClick={() => {
                        setZoom(1);
                        setPan({ x: 0, y: 0 });
                    }}
                    className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg text-sm font-medium text-gray-700 hover:bg-white"
                >
                    🎯 Centrar
                </button>
            </div>

            {/* Services Legend */}
            {services.length > 0 && (
                <div className="absolute top-4 left-4 z-40 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg max-w-xs">
                    <h3 className="text-sm font-bold text-gray-800 mb-2">Servicios en el Mapa</h3>
                    <div className="space-y-1 text-xs">
                        {[...new Set(services.map(s => s.tipo))].map(tipo => (
                            <div key={tipo} className="flex items-center">
                                <div className={`w-4 h-4 rounded-full mr-2 ${getServiceColor(tipo)} flex items-center justify-center`}>
                                    <span className="text-white text-xs">{getServiceIcon(tipo)}</span>
                                </div>
                                <span className="text-gray-700">{tipo}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Bottom Panel */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-30">
                <div className="p-6">
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>
                    
                    {selectedService ? (
                        <>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Información del Servicio</h2>
                            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                <div className="flex items-center mb-3">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-3 ${getServiceColor(selectedService.tipo)}`}>
                                        <span className="text-white text-xl">{getServiceIcon(selectedService.tipo)}</span>
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800">{selectedService.nombre}</div>
                                        <div className="text-sm text-gray-600">{selectedService.tipo}</div>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-2">📍 {selectedService.ubicacion_aproximada}</p>
                                {selectedService.telefono && (
                                    <p className="text-green-600 font-semibold">📞 {selectedService.telefono}</p>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedService(null)}
                                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold"
                                >
                                    Cerrar
                                </button>
                                {selectedService.telefono && (
                                    <button className="flex-2 bg-green-600 text-white py-3 px-6 rounded-xl font-semibold">
                                        📞 Llamar
                                    </button>
                                )}
                            </div>
                        </>
                    ) : selectedMechanic ? (
                        <>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Confirmar Servicio</h2>
                            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-3 ${
                                            selectedMechanic.type === 'Mecánico' ? 'bg-green-100' : 'bg-blue-100'
                                        }`}>
                                            <span className="text-xl">{selectedMechanic.type === 'Mecánico' ? '🔧' : '🚛'}</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800">{selectedMechanic.name}</div>
                                            <div className="text-sm text-gray-600">⭐ {selectedMechanic.rating}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-gray-800">{selectedMechanic.price}</div>
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
                                    Solicitar
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                                {services.length > 0 ? 'Servicios y Mecánicos' : 'Mecánicos Disponibles'}
                            </h2>
                            {services.length > 0 && (
                                <p className="text-center text-gray-600 mb-4">
                                    {services.length} servicios encontrados en el mapa
                                </p>
                            )}
                            <div className="space-y-3">
                                {mechanics.slice(0, 2).map((mechanic) => (
                                    <div
                                        key={mechanic.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100"
                                        onClick={() => setSelectedMechanic(mechanic)}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-3 ${
                                                mechanic.type === 'Mecánico' ? 'bg-green-100' : 'bg-blue-100'
                                            }`}>
                                                <span className="text-xl">{mechanic.type === 'Mecánico' ? '🔧' : '🚛'}</span>
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800">{mechanic.name}</div>
                                                <div className="text-sm text-gray-600">⭐ {mechanic.rating} • {mechanic.eta}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-800">{mechanic.price}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MapWithServices;