import React from 'react';
import { AssistanceType, User } from '../types';
import MechanicIcon from './icons/MechanicIcon';
import MedicalIcon from './icons/MedicalIcon';
import SecurityIcon from './icons/SecurityIcon';
import FuneralIcon from './icons/FuneralIcon';
import StarIcon from './icons/StarIcon';

interface AssistancePanelProps {
    onClose: () => void;
    onSelect: (type: AssistanceType) => void;
    user: User;
}

interface AssistanceButtonProps {
    icon: React.ReactNode;
    label: AssistanceType;
    onClick: () => void;
    isPremium: boolean;
}

const AssistanceButton: React.FC<AssistanceButtonProps> = ({ icon, label, onClick, isPremium }) => (
    <button
        onClick={onClick}
        className="relative flex flex-col items-center justify-center p-4 bg-gray-800/70 border border-gray-700 rounded-xl hover:bg-gray-700/90 hover:border-cyan-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
    >
        {isPremium && (
            <div className="absolute top-2 right-2 text-amber-300">
                <StarIcon />
            </div>
        )}
        <div className="w-16 h-16 mb-2 text-cyan-300">{icon}</div>
        <span className="font-semibold text-center text-white">{label}</span>
    </button>
);

const AssistancePanel: React.FC<AssistancePanelProps> = ({ onClose, onSelect, user }) => {
    const premiumAgents = [AssistanceType.Medical, AssistanceType.Security, AssistanceType.Funeral];
    
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-40 p-4">
            <div className="relative w-full max-w-2xl bg-gray-900/80 border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col">
                <header className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-cyan-400">Seleccione un tipo de asistencia</h2>
                    <button onClick={onClose} className="bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-600 transition-colors">&times;</button>
                </header>
                <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <AssistanceButton
                            icon={<MechanicIcon />}
                            label={AssistanceType.Mechanic}
                            onClick={() => onSelect(AssistanceType.Mechanic)}
                            isPremium={false}
                        />
                        <AssistanceButton
                            icon={<MedicalIcon />}
                            label={AssistanceType.Medical}
                            onClick={() => onSelect(AssistanceType.Medical)}
                            isPremium={true}
                        />
                        <AssistanceButton
                            icon={<SecurityIcon />}
                            label={AssistanceType.Security}
                            onClick={() => onSelect(AssistanceType.Security)}
                            isPremium={true}
                        />
                        <AssistanceButton
                            icon={<FuneralIcon />}
                            label={AssistanceType.Funeral}
                            onClick={() => onSelect(AssistanceType.Funeral)}
                            isPremium={true}
                        />
                    </div>
                     <p className="text-center text-xs text-gray-400 mt-4">
                        Los servicios marcados con <StarIcon className="inline w-3 h-3 mx-1 text-amber-300" /> son exclusivos para miembros Premium.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AssistancePanel;
