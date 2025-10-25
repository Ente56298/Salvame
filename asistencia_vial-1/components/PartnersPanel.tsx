import React from 'react';
import { Partner } from '../types';
import { partnerIcons } from '../data/partnersData';

interface PartnersPanelProps {
    onClose: () => void;
    partners: Partner[];
}

const PartnerLogo: React.FC<{ icon: React.ReactNode, name: string }> = ({ icon, name }) => (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-800/70 border border-gray-700 rounded-xl transition-all duration-200 hover:bg-gray-700/90 hover:border-blue-400">
        <div className="w-24 h-16 text-white flex items-center justify-center">
            {icon}
        </div>
        <span className="mt-2 font-semibold text-center text-gray-300">{name}</span>
    </div>
);


const PartnersPanel: React.FC<PartnersPanelProps> = ({ onClose, partners }) => {

    const renderPartnerIcon = (iconComponentKey: string) => {
        const IconComponent = partnerIcons[iconComponentKey];
        return IconComponent ? <IconComponent /> : null;
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-40 p-4">
            <div className="relative w-full max-w-2xl bg-gray-900/80 border border-blue-500/30 rounded-2xl shadow-2xl flex flex-col">
                <header className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-blue-400">Nuestros Convenios</h2>
                    <button onClick={onClose} className="bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-600 transition-colors">&times;</button>
                </header>
                <div className="p-6">
                    <p className="text-center text-gray-300 mb-6">
                        Aprovecha descuentos y promociones especiales con nuestros socios comerciales.
                        ¡Exclusivo para miembros Premium!
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {partners.map(partner => (
                            <PartnerLogo 
                                key={partner.id}
                                icon={renderPartnerIcon(partner.iconComponent)} 
                                name={partner.name} 
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnersPanel;
