import React from 'react';
import { Feature, User } from '../types';
import WrenchIcon from './icons/WrenchIcon';
import TrafficIcon from './icons/TrafficIcon';
import GasStationIcon from './icons/GasStationIcon';
import SOSIcon from './icons/SOSIcon';
import EvaluationIcon from './icons/EvaluationIcon';
import AssistanceIcon from './icons/AssistanceIcon';
import PartnersIcon from './icons/PartnersIcon';
import StarIcon from './icons/StarIcon';
import AdminIcon from './icons/AdminIcon';
import FunctionAccessPanel from './FunctionAccessPanel';

interface DashboardProps {
    user: User;
    onFeatureSelect: (feature: Feature) => void;
    onActivateSOS: () => void;
    onSubscriptionPrompt: () => void;
}

interface FeatureButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    isSOS?: boolean;
    isPremium?: boolean;
    isAdmin?: boolean;
}

const FeatureButton: React.FC<FeatureButtonProps> = ({ icon, label, onClick, isSOS = false, isPremium = false, isAdmin = false }) => {
    const baseClasses = "relative flex flex-col items-center justify-center aspect-square rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4";
    const normalClasses = "bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:bg-gray-700/70 focus:ring-amber-500/50 text-white";
    const sosClasses = "bg-red-600/80 backdrop-blur-sm border border-red-400 hover:bg-red-500/90 focus:ring-red-400/50 text-white animate-pulse-slow";
    const adminClasses = "bg-indigo-800/50 backdrop-blur-sm border border-indigo-700 hover:bg-indigo-700/70 focus:ring-indigo-500/50 text-white";
    
    const buttonClass = isSOS ? sosClasses : (isAdmin ? adminClasses : normalClasses);

    return (
        <button onClick={onClick} className={`${baseClasses} ${buttonClass}`}>
             {isPremium && (
                 <div className="absolute top-2 right-2 text-amber-300">
                    <StarIcon />
                 </div>
             )}
             <div className="w-12 h-12 sm:w-16 sm:h-16 mb-2">{icon}</div>
             <span className="font-bold text-sm sm:text-base text-center">{label}</span>
        </button>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ user, onFeatureSelect, onActivateSOS, onSubscriptionPrompt }) => {
    
    const handleAssistanceClick = () => {
        onFeatureSelect(Feature.Assistance);
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
                 <FeatureButton 
                    icon={<EvaluationIcon />}
                    label="Asistente Evaluador"
                    onClick={() => onFeatureSelect(Feature.Evaluation)}
                />
                 <FeatureButton 
                    icon={<WrenchIcon />}
                    label="Refacciones"
                    onClick={() => onFeatureSelect(Feature.Parts)}
                />
                 <FeatureButton 
                    icon={<TrafficIcon />}
                    label="Reporte de Tráfico"
                    onClick={() => onFeatureSelect(Feature.Traffic)}
                />
                 <FeatureButton 
                    icon={<GasStationIcon />}
                    label="Servicios Cercanos"
                    onClick={() => onFeatureSelect(Feature.Services)}
                />
                 <FeatureButton 
                    icon={<AssistanceIcon />}
                    label="Tipos de Asistencia"
                    onClick={handleAssistanceClick}
                    isPremium={true}
                />
                 <FeatureButton 
                    icon={<PartnersIcon />}
                    label="Convenios"
                    onClick={() => onFeatureSelect(Feature.Partnerships)}
                />

                {user.subscriptionStatus === 'admin' && (
                    <FeatureButton
                        icon={<AdminIcon />}
                        label="Panel de Admin"
                        onClick={() => onFeatureSelect(Feature.Admin)}
                        isAdmin
                    />
                )}

                 <FeatureButton 
                    icon={<SOSIcon />}
                    label="SOS"
                    onClick={onActivateSOS}
                    isSOS
                />

                <FeatureButton 
                    icon={<div className="text-4xl">⚡</div>}
                    label="Funciones Avanzadas"
                    onClick={() => onFeatureSelect(Feature.Functions)}
                    isPremium={true}
                />
            </div>
        </div>
    );
};

export default Dashboard;
