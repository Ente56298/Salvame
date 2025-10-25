import React, { useState, useEffect } from 'react';

interface Mechanic {
    id: number;
    name: string;
    rating: number;
    eta: string;
    distance: string;
    status: 'en_route' | 'arrived' | 'working';
    phone: string;
}

const LiveTrackingPanel: React.FC = () => {
    const [mechanic, setMechanic] = useState<Mechanic>({
        id: 1,
        name: "Juan Pérez",
        rating: 4.8,
        eta: "8 min",
        distance: "2.3 km",
        status: "en_route",
        phone: "+52 55 1234 5678"
    });

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + 2;
                if (newProgress >= 100) {
                    setMechanic(prev => ({ ...prev, status: 'arrived', eta: '¡Llegó!' }));
                    return 100;
                }
                return newProgress;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'en_route': return 'text-blue-400';
            case 'arrived': return 'text-green-400';
            case 'working': return 'text-yellow-400';
            default: return 'text-gray-400';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'en_route': return '🚗 En camino';
            case 'arrived': return '✅ Llegó';
            case 'working': return '🔧 Trabajando';
            default: return '⏳ Esperando';
        }
    };

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
            <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Seguimiento en Vivo</h3>
                    <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                        <span className="text-xs text-gray-400">LIVE</span>
                    </div>
                </div>

                {/* Mechanic Info */}
                <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-lg">👨🔧</span>
                    </div>
                    <div className="flex-1">
                        <div className="text-white font-bold">{mechanic.name}</div>
                        <div className="flex items-center text-sm">
                            <span className="text-yellow-400 mr-1">⭐</span>
                            <span className="text-gray-300">{mechanic.rating}</span>
                            <span className="text-gray-500 mx-2">•</span>
                            <span className="text-gray-300">{mechanic.distance}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`font-bold ${getStatusColor(mechanic.status)}`}>
                            {getStatusText(mechanic.status)}
                        </div>
                        <div className="text-sm text-gray-400">{mechanic.eta}</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progreso</span>
                        <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                        <span className="mr-2">📞</span>
                        <span className="text-sm">Llamar</span>
                    </button>
                    <button className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                        <span className="mr-2">💬</span>
                        <span className="text-sm">Chat</span>
                    </button>
                </div>

                {/* Timeline */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="text-xs text-gray-400 mb-2">Timeline</div>
                    <div className="space-y-2 text-xs">
                        <div className="flex items-center text-green-400">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                            SOS activado - 14:32
                        </div>
                        <div className="flex items-center text-green-400">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                            Mecánico asignado - 14:33
                        </div>
                        <div className="flex items-center text-blue-400">
                            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                            En camino - 14:34
                        </div>
                        <div className="flex items-center text-gray-500">
                            <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                            Llegada estimada - 14:42
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveTrackingPanel;