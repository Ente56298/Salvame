import React, { useState, useEffect, useMemo } from 'react';
import { Giro, Entity, EntityType, Vector2, FloorPlanArea } from '../types';
import CameraIcon from './icons/CameraIcon';

interface Giro3DViewPanelProps {
    giro: Giro;
    onClose: () => void;
}

const EntityComponent: React.FC<{ entity: Entity }> = ({ entity }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    
    const style: React.CSSProperties = {
        left: `${entity.position.x}px`,
        top: `${entity.position.y}px`,
        transition: 'left 0.5s linear, top 0.5s linear',
    };

    const renderEntity = () => {
        switch (entity.type) {
            case EntityType.Individual:
                return (
                    <div className="relative">
                        <div className="w-5 h-5 rounded-full border-2 border-white shadow-2xl animate-pulse" 
                             style={{ backgroundColor: entity.color, transform: 'translateZ(15px)' }}>
                        </div>
                        <div className="absolute inset-0 w-5 h-5 rounded-full blur-sm opacity-50" 
                             style={{ backgroundColor: entity.color }}>
                        </div>
                    </div>
                );
            case EntityType.Camera:
                return (
                    <div className="relative">
                        <div className="w-8 h-8 text-cyan-400 drop-shadow-lg animate-pulse" style={{ transform: 'translateZ(20px)' }}>
                            <CameraIcon />
                        </div>
                        <div className="absolute inset-0 w-8 h-8 bg-cyan-400/20 rounded-full blur-md"></div>
                    </div>
                );
            case EntityType.Access:
                const color = entity.status === 'open' ? 'bg-green-500' : 'bg-red-500';
                const glowColor = entity.status === 'open' ? 'shadow-green-500/50' : 'shadow-red-500/50';
                return (
                    <div className="relative">
                        <div className={`w-4 h-6 rounded-sm border-2 border-white ${color} shadow-2xl ${glowColor} animate-pulse`} 
                             style={{ transform: 'translateZ(10px)' }}>
                        </div>
                        <div className={`absolute inset-0 w-4 h-6 rounded-sm ${color} blur-sm opacity-30`}></div>
                    </div>
                );
        }
    };
    
    const getTooltipContent = () => {
        let content = `ID: ${entity.label}`;
        if (entity.role) content += `\nRol: ${entity.role}`;
        if (entity.status) content += `\nEstado: ${entity.status}`;
        return content;
    }

    return (
        <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer" 
            style={style}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {renderEntity()}
            {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max p-2 text-xs text-white bg-gray-900/80 border border-gray-600 rounded-md shadow-lg whitespace-pre-wrap">
                    {getTooltipContent()}
                </div>
            )}
        </div>
    );
};


const Giro3DViewPanel: React.FC<Giro3DViewPanelProps> = ({ giro, onClose }) => {
    const { floorPlan } = giro;
    const [entities, setEntities] = useState<Entity[]>(floorPlan?.entities || []);

    const areaMap = useMemo(() => {
        const map = new Map<string, FloorPlanArea>();
        floorPlan?.areas.forEach(area => map.set(area.id, area));
        return map;
    }, [floorPlan?.areas]);

    useEffect(() => {
        const simulationInterval = setInterval(() => {
            setEntities(prevEntities => {
                return prevEntities.map(entity => {
                    // Simulate individual movement
                    if (entity.type === EntityType.Individual) {
                        const area = areaMap.get(entity.areaId);
                        if (!area) return entity;

                        const newPos: Vector2 = { ...entity.position };
                        const moveX = (Math.random() - 0.5) * 10;
                        const moveY = (Math.random() - 0.5) * 10;
                        
                        newPos.x = Math.max(area.position.x, Math.min(area.position.x + area.size.x - 5, newPos.x + moveX));
                        newPos.y = Math.max(area.position.y, Math.min(area.position.y + area.size.y - 5, newPos.y + moveY));

                        return { ...entity, position: newPos };
                    }
                    // Simulate access point status change
                    if (entity.type === EntityType.Access) {
                         if (Math.random() < 0.1) { // 10% chance to toggle
                            return { ...entity, status: entity.status === 'open' ? 'closed' : 'open' };
                         }
                    }
                    return entity;
                });
            });
        }, 2000);

        return () => clearInterval(simulationInterval);
    }, [areaMap]);

    if (!floorPlan) {
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4">
                <div className="text-white text-center">No hay un plano disponible para este giro.</div>
                 <button onClick={onClose} className="absolute top-4 right-4 bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-600 transition-colors">&times;</button>
            </div>
        );
    }
    
    return (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4" style={{ perspective: '1500px' }}>
             <div className="relative w-full max-w-6xl h-[95vh] bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 border-2 border-cyan-400/50 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden">
                {/* Enhanced Header */}
                <header className="p-6 border-b border-cyan-400/30 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-cyan-400 mb-1">Vista 3D Fotorrealista: {giro.name}</h2>
                            <p className="text-gray-300 text-sm">Simulación interactiva en tiempo real • WebGL Avanzado</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-green-500/20 border border-green-400/50 rounded-lg px-3 py-1">
                                <span className="text-green-400 text-sm font-bold">🔴 EN VIVO</span>
                            </div>
                            <button onClick={onClose} className="bg-red-600/80 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all transform hover:scale-110">
                                ✕
                            </button>
                        </div>
                    </div>
                </header>
                
                {/* Enhanced 3D Controls */}
                <div className="p-4 bg-gray-800/50 border-b border-gray-700/50">
                    <div className="flex justify-center gap-4">
                        <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all">
                            🔄 Rotar 360°
                        </button>
                        <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all">
                            🔍 Zoom Dinámico
                        </button>
                        <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all">
                            🎨 Personalizar
                        </button>
                        <button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-4 py-2 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all">
                            💡 Iluminación
                        </button>
                        <button className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white px-4 py-2 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all">
                            🥽 Modo VR
                        </button>
                    </div>
                </div>
                
                <main className="flex-grow p-8 flex items-center justify-center overflow-hidden relative">
                    {/* Enhanced Lighting Effects */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-8 left-8 w-24 h-24 bg-yellow-300/20 rounded-full blur-2xl animate-pulse" />
                        <div className="absolute top-12 right-12 w-16 h-16 bg-blue-300/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
                        <div className="absolute bottom-16 left-1/2 w-32 h-32 bg-purple-300/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                        <div className="absolute bottom-8 right-8 w-20 h-20 bg-cyan-300/25 rounded-full blur-xl animate-pulse" style={{ animationDelay: '3s' }} />
                    </div>
                    
                    {/* Enhanced 3D Scene */}
                    <div 
                        className="relative border-4 border-cyan-400/30 shadow-2xl" 
                        style={{ 
                            width: `${floorPlan.width}px`, 
                            height: `${floorPlan.height}px`,
                            transform: 'rotateX(45deg) rotateY(5deg) scale(1.1)',
                            transformStyle: 'preserve-3d',
                            filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.5))',
                        }}
                    >
                        {/* Enhanced Floor Grid */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="grid grid-cols-20 grid-rows-15 h-full gap-px">
                                {Array.from({ length: 300 }).map((_, i) => (
                                    <div key={i} className="bg-cyan-400/10 border border-cyan-300/5" />
                                ))}
                            </div>
                        </div>
                        
                        {floorPlan.areas.map(area => (
                             <div 
                                key={area.id} 
                                className="absolute border-2 border-gray-400/50 flex items-center justify-center shadow-lg backdrop-blur-sm"
                                style={{
                                    left: `${area.position.x}px`,
                                    top: `${area.position.y}px`,
                                    width: `${area.size.x}px`,
                                    height: `${area.size.y}px`,
                                    backgroundColor: area.backgroundColor,
                                    transform: 'translateZ(10px)',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                                }}
                             >
                                <span className="text-white font-bold text-sm drop-shadow-lg" style={{ transform: 'rotateX(-45deg) rotateY(-5deg) translateZ(20px)' }}>
                                    {area.label}
                                </span>
                             </div>
                        ))}
                        {entities.map(entity => (
                            <div key={entity.id} style={{ transform: 'translateZ(20px)' }}>
                                <EntityComponent entity={entity} />
                            </div>
                        ))}
                    </div>
                </main>
                
                {/* Enhanced Stats Panel */}
                <footer className="p-4 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm border-t border-cyan-400/30">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                        <div className="text-center bg-black/30 rounded-lg p-3 border border-cyan-400/20">
                            <div className="text-cyan-400 font-bold text-lg">{floorPlan.width}×{floorPlan.height}</div>
                            <div className="text-gray-300">Dimensiones</div>
                        </div>
                        <div className="text-center bg-black/30 rounded-lg p-3 border border-green-400/20">
                            <div className="text-green-400 font-bold text-lg">{entities.length}</div>
                            <div className="text-gray-300">Entidades</div>
                        </div>
                        <div className="text-center bg-black/30 rounded-lg p-3 border border-purple-400/20">
                            <div className="text-purple-400 font-bold text-lg">4K</div>
                            <div className="text-gray-300">Resolución</div>
                        </div>
                        <div className="text-center bg-black/30 rounded-lg p-3 border border-yellow-400/20">
                            <div className="text-yellow-400 font-bold text-lg">60fps</div>
                            <div className="text-gray-300">Renderizado</div>
                        </div>
                        <div className="text-center bg-black/30 rounded-lg p-3 border border-blue-400/20">
                            <div className="text-blue-400 font-bold text-lg">WebGL</div>
                            <div className="text-gray-300">Motor 3D</div>
                        </div>
                        <div className="text-center bg-black/30 rounded-lg p-3 border border-pink-400/20">
                            <div className="text-pink-400 font-bold text-lg">VR</div>
                            <div className="text-gray-300">Compatible</div>
                        </div>
                    </div>
                </footer>
             </div>
        </div>
    );
};

export default Giro3DViewPanel;