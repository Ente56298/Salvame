import React from 'react';
import StarIcon from './icons/StarIcon';

interface SubscriptionPanelProps {
    onClose: () => void;
    onSubscribe: () => void;
}

const SubscriptionPanel: React.FC<SubscriptionPanelProps> = ({ onClose, onSubscribe }) => {
    const benefits = [
        "Acceso a todos los Agentes de Asistencia (Médico, Seguridad, Funerario)",
        "Soporte prioritario en el chat",
        "Descuentos exclusivos con nuestros socios comerciales",
        "Experiencia sin anuncios (próximamente)",
    ];

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-lg bg-gray-900/80 border border-amber-500/50 rounded-2xl shadow-2xl flex flex-col">
                <header className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-amber-400 flex items-center">
                        <StarIcon className="w-6 h-6 mr-2" />
                        Hazte Premium
                    </h2>
                    <button onClick={onClose} className="bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-600 transition-colors" aria-label="Cerrar">&times;</button>
                </header>
                <div className="p-6">
                    <p className="text-gray-300 mb-6">Desbloquea todo el potencial de Asistente Vial México con una suscripción Premium.</p>
                    <ul className="space-y-3 mb-8">
                        {benefits.map((benefit, index) => (
                             <li key={index} className="flex items-start">
                                <svg className="w-5 h-5 mr-2 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                <span className="text-gray-200">{benefit}</span>
                            </li>
                        ))}
                    </ul>
                     <button
                        onClick={onSubscribe}
                        className="w-full bg-amber-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-amber-400 transition-transform transform hover:scale-105"
                    >
                        Actualizar Ahora
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPanel;
