import React, { useState, useEffect } from 'react';
import { RouteHistory, getRouteHistory, deleteRoute, clearRouteHistory } from '../utils/routeHistory';

interface RouteHistoryPanelProps {
    onClose: () => void;
}

const RouteHistoryPanel: React.FC<RouteHistoryPanelProps> = ({ onClose }) => {
    const [routes, setRoutes] = useState<RouteHistory[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<RouteHistory | null>(null);

    useEffect(() => {
        setRoutes(getRouteHistory());
    }, []);

    const handleDeleteRoute = (id: string) => {
        deleteRoute(id);
        setRoutes(getRouteHistory());
        if (selectedRoute?.id === id) {
            setSelectedRoute(null);
        }
    };

    const handleClearAll = () => {
        if (confirm('¿Estás seguro de eliminar todo el historial?')) {
            clearRouteHistory();
            setRoutes([]);
            setSelectedRoute(null);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-MX', { 
            day: 'numeric', 
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Historial de Rutas</h2>
                            <p className="text-blue-100">{routes.length} servicios registrados</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                        >
                            <span className="text-xl">✕</span>
                        </button>
                    </div>
                </div>

                <div className="flex h-[calc(90vh-120px)]">
                    {/* Routes List */}
                    <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-800">Servicios Recientes</h3>
                                {routes.length > 0 && (
                                    <button
                                        onClick={handleClearAll}
                                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                                    >
                                        Limpiar Todo
                                    </button>
                                )}
                            </div>

                            {routes.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🗺️</div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">Sin historial</h3>
                                    <p className="text-gray-600 text-sm">Tus servicios aparecerán aquí</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {routes.map((route) => (
                                        <div
                                            key={route.id}
                                            className={`p-4 rounded-xl cursor-pointer transition-all ${
                                                selectedRoute?.id === route.id
                                                    ? 'bg-blue-50 border-2 border-blue-200'
                                                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                                            }`}
                                            onClick={() => setSelectedRoute(route)}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    <div className={`w-3 h-3 rounded-full mr-2 ${
                                                        route.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                                                    }`}></div>
                                                    <span className="font-semibold text-gray-800">
                                                        {route.mechanic.name}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    {formatDate(route.date)}
                                                </span>
                                            </div>
                                            
                                            <div className="text-sm text-gray-600 mb-2">
                                                📍 {route.startLocation.address}
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">
                                                    {route.time} • {route.duration}
                                                </span>
                                                <span className="font-bold text-green-600">
                                                    {route.cost}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Route Details */}
                    <div className="w-1/2 overflow-y-auto">
                        {selectedRoute ? (
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-800">Detalles del Servicio</h3>
                                    <button
                                        onClick={() => handleDeleteRoute(selectedRoute.id)}
                                        className="text-red-600 hover:text-red-700 text-sm"
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Status */}
                                    <div className="flex items-center">
                                        <div className={`w-4 h-4 rounded-full mr-3 ${
                                            selectedRoute.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                                        }`}></div>
                                        <span className="font-semibold">
                                            {selectedRoute.status === 'completed' ? 'Completado' : 'Cancelado'}
                                        </span>
                                    </div>

                                    {/* Date & Time */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h4 className="font-semibold text-gray-800 mb-2">Fecha y Hora</h4>
                                        <p className="text-gray-600">
                                            📅 {formatDate(selectedRoute.date)} a las {selectedRoute.time}
                                        </p>
                                        <p className="text-gray-600">
                                            ⏱️ Duración: {selectedRoute.duration}
                                        </p>
                                    </div>

                                    {/* Mechanic */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h4 className="font-semibold text-gray-800 mb-2">Mecánico</h4>
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-xl">👨🔧</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold">{selectedRoute.mechanic.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    ⭐ {selectedRoute.mechanic.rating} • {selectedRoute.mechanic.service}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Locations */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h4 className="font-semibold text-gray-800 mb-3">Ubicaciones</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Inicio</p>
                                                <p className="text-gray-700">📍 {selectedRoute.startLocation.address}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Destino</p>
                                                <p className="text-gray-700">🏁 {selectedRoute.endLocation.address}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cost */}
                                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                                        <h4 className="font-semibold text-gray-800 mb-2">Costo Total</h4>
                                        <p className="text-2xl font-bold text-green-600">{selectedRoute.cost}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">📋</div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">Selecciona un servicio</h3>
                                    <p className="text-gray-600">Elige un servicio para ver los detalles</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RouteHistoryPanel;