import React from 'react';
import { Feature, User } from '../types';
import '../rocket-theme.css';

interface DashboardProps {
    user: User;
    onFeatureSelect: (feature: Feature) => void;
    onActivateSOS: () => void;
}

interface FeatureButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    isSOS?: boolean;
    isPremium?: boolean;
    isAdmin?: boolean;
}

const FeatureButton: React.FC<FeatureButtonProps> = ({ 
    icon, label, onClick, isSOS = false, isPremium = false, isAdmin = false 
}) => {
    const baseClasses = "relative flex flex-col items-center justify-center aspect-square rounded-2xl transform transition-all duration-300 hover:scale-105 focus:outline-none";
    const normalClasses = "rocket-card text-white hover:border-blue-400";
    const sosClasses = "bg-gradient-to-br from-red-500 to-red-600 border border-red-400 text-white neon-glow animate-pulse";
    const adminClasses = "bg-gradient-to-br from-purple-500 to-purple-600 border border-purple-400 text-white";
    
    const buttonClass = isSOS ? sosClasses : (isAdmin ? adminClasses : normalClasses);

    return (
        <button onClick={onClick} className={`${baseClasses} ${buttonClass}`}>
             {isPremium && (
                 <div className="absolute top-2 right-2 text-amber-300">
                    ⭐
                 </div>
             )}
             <div className="w-12 h-12 sm:w-16 sm:h-16 mb-2 text-3xl">{icon}</div>
             <span className="font-bold text-sm sm:text-base text-center">{label}</span>
        </button>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ user, onFeatureSelect, onActivateSOS }) => {
    return (
        <div className="w-full max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 glass-panel rounded-full px-6 py-3 mb-6">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-white">Sistema Operativo</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                    Asistencia Vial <span className="metric-number">México</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                    Plataforma inteligente de emergencias viales con IA avanzada
                </p>
                
                {/* Status Indicators */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <div className="status-indicator">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        99.9% Uptime
                    </div>
                    <div className="status-indicator">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        &lt; 100ms Response
                    </div>
                    <div className="status-indicator">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        ISO 27001
                    </div>
                </div>
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <FeatureButton 
                    icon="🔍"
                    label="Asistente Evaluador"
                    onClick={() => onFeatureSelect(Feature.Evaluation)}
                />
                <FeatureButton 
                    icon="🔧"
                    label="Refacciones"
                    onClick={() => onFeatureSelect(Feature.Parts)}
                />
                <FeatureButton 
                    icon="🚦"
                    label="Reporte de Tráfico"
                    onClick={() => onFeatureSelect(Feature.Traffic)}
                />
                <FeatureButton 
                    icon="⛽"
                    label="Servicios Cercanos"
                    onClick={() => onFeatureSelect(Feature.Services)}
                />
                <FeatureButton 
                    icon="🛠️"
                    label="Tipos de Asistencia"
                    onClick={() => onFeatureSelect(Feature.Assistance)}
                    isPremium={true}
                />
                <FeatureButton 
                    icon="🤝"
                    label="Convenios"
                    onClick={() => onFeatureSelect(Feature.Partnerships)}
                />

                {user.subscriptionStatus === 'admin' && (
                    <FeatureButton
                        icon="👑"
                        label="Panel de Admin"
                        onClick={() => onFeatureSelect(Feature.Admin)}
                        isAdmin
                    />
                )}

                <FeatureButton 
                    icon="🚨"
                    label="SOS"
                    onClick={onActivateSOS}
                    isSOS
                />

                <FeatureButton 
                    icon="⚡"
                    label="Funciones Avanzadas"
                    onClick={() => onFeatureSelect(Feature.Functions)}
                    isPremium={true}
                />
            </div>
        </div>
    );
};

export default Dashboard;