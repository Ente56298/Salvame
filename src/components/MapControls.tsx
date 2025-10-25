import React, { useState } from 'react';

interface MapControlsProps {
    onToggleMechanics: (show: boolean) => void;
    onToggleTraffic: (show: boolean) => void;
    onRecenter: () => void;
    onToggleMode: (mode: 'satellite' | 'street') => void;
}

const MapControls: React.FC<MapControlsProps> = ({
    onToggleMechanics,
    onToggleTraffic,
    onRecenter,
    onToggleMode
}) => {
    const [showMechanics, setShowMechanics] = useState(true);
    const [showTraffic, setShowTraffic] = useState(true);
    const [mapMode, setMapMode] = useState<'satellite' | 'street'>('street');

    const handleMechanicsToggle = () => {
        const newState = !showMechanics;
        setShowMechanics(newState);
        onToggleMechanics(newState);
    };

    const handleTrafficToggle = () => {
        const newState = !showTraffic;
        setShowTraffic(newState);
        onToggleTraffic(newState);
    };

    const handleModeToggle = () => {
        const newMode = mapMode === 'street' ? 'satellite' : 'street';
        setMapMode(newMode);
        onToggleMode(newMode);
    };

    return (
        <div className="absolute top-20 right-4 z-40 space-y-2">
            {/* Layer Controls */}
            <div className="bg-gray-900/90 backdrop-blur-lg rounded-lg p-2 border border-gray-700">
                <div className="space-y-2">
                    <button
                        onClick={handleMechanicsToggle}
                        className={`w-full flex items-center justify-between p-2 rounded text-sm transition-colors ${
                            showMechanics 
                                ? 'bg-green-600 text-white' 
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        <span className="flex items-center">
                            <span className="mr-2">🔧</span>
                            Mecánicos
                        </span>
                        <span className="text-xs">
                            {showMechanics ? 'ON' : 'OFF'}
                        </span>
                    </button>

                    <button
                        onClick={handleTrafficToggle}
                        className={`w-full flex items-center justify-between p-2 rounded text-sm transition-colors ${
                            showTraffic 
                                ? 'bg-yellow-600 text-white' 
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        <span className="flex items-center">
                            <span className="mr-2">🚦</span>
                            Tráfico
                        </span>
                        <span className="text-xs">
                            {showTraffic ? 'ON' : 'OFF'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Map Mode Toggle */}
            <div className="bg-gray-900/90 backdrop-blur-lg rounded-lg p-2 border border-gray-700">
                <button
                    onClick={handleModeToggle}
                    className="w-full flex items-center justify-between p-2 rounded text-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                    <span className="flex items-center">
                        <span className="mr-2">{mapMode === 'street' ? '🗺️' : '🛰️'}</span>
                        {mapMode === 'street' ? 'Calles' : 'Satélite'}
                    </span>
                </button>
            </div>

            {/* Navigation Controls */}
            <div className="bg-gray-900/90 backdrop-blur-lg rounded-lg p-2 border border-gray-700">
                <button
                    onClick={onRecenter}
                    className="w-full flex items-center justify-center p-2 rounded text-sm bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                >
                    <span className="mr-2">📍</span>
                    Mi Ubicación
                </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900/90 backdrop-blur-lg rounded-lg p-2 border border-gray-700">
                <div className="space-y-2">
                    <button className="w-full flex items-center justify-center p-2 rounded text-sm bg-green-600 hover:bg-green-700 text-white transition-colors">
                        <span className="mr-2">🔍</span>
                        Buscar
                    </button>
                    <button className="w-full flex items-center justify-center p-2 rounded text-sm bg-purple-600 hover:bg-purple-700 text-white transition-colors">
                        <span className="mr-2">📍</span>
                        Marcar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapControls;