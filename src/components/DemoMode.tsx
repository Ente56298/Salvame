import React, { useState } from 'react';

interface DemoModeProps {
    onStartDemo: () => void;
    onRequestAccess: () => void;
}

const DemoMode: React.FC<DemoModeProps> = ({ onStartDemo, onRequestAccess }) => {
    const [email, setEmail] = useState('');

    const handleRequestAccess = () => {
        if (email) {
            // Store lead in localStorage for demo
            const leads = JSON.parse(localStorage.getItem('demoLeads') || '[]');
            leads.push({ email, timestamp: Date.now() });
            localStorage.setItem('demoLeads', JSON.stringify(leads));
            onRequestAccess();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-800/90 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">🚨 Asistencia Vial</h1>
                    <p className="text-blue-400 font-semibold">VERSIÓN DEMO</p>
                    <p className="text-gray-300 text-sm mt-2">Experimenta el futuro de la asistencia vial</p>
                </div>

                <div className="space-y-6">
                    <button
                        onClick={onStartDemo}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                        🎮 Probar Demo Interactivo
                    </button>

                    <div className="border-t border-gray-600 pt-6">
                        <p className="text-gray-300 text-sm mb-4">¿Interesado en la versión completa?</p>
                        <input
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-700 text-white p-3 rounded-lg mb-4"
                        />
                        <button
                            onClick={handleRequestAccess}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            💼 Solicitar Acceso Completo
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-xs">
                        Demo limitado • Funciones completas próximamente
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DemoMode;