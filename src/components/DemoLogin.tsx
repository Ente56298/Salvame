import React, { useState } from 'react';

interface DemoLoginProps {
    onLogin: (userType: 'user' | 'partner') => void;
}

const DemoLogin: React.FC<DemoLoginProps> = ({ onLogin }) => {
    const [selectedType, setSelectedType] = useState<'user' | 'partner' | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (type: 'user' | 'partner') => {
        setIsLoading(true);
        setTimeout(() => {
            onLogin(type);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-800/90 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">🚨 Demo Login</h1>
                    <p className="text-blue-400">Selecciona tu tipo de acceso</p>
                </div>

                <div className="space-y-4 mb-8">
                    <button
                        onClick={() => setSelectedType('user')}
                        className={`w-full p-6 rounded-xl border-2 transition-all ${
                            selectedType === 'user' 
                                ? 'border-blue-500 bg-blue-500/20' 
                                : 'border-gray-600 hover:border-gray-500'
                        }`}
                    >
                        <div className="text-center">
                            <div className="text-4xl mb-2">👤</div>
                            <h3 className="text-xl font-bold text-white mb-2">Usuario</h3>
                            <p className="text-gray-300 text-sm">
                                Acceso completo a servicios de asistencia vial
                            </p>
                            <div className="mt-3 text-xs text-blue-400">
                                • Solicitar mecánicos • Tracking en vivo • Chat soporte
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => setSelectedType('partner')}
                        className={`w-full p-6 rounded-xl border-2 transition-all ${
                            selectedType === 'partner' 
                                ? 'border-green-500 bg-green-500/20' 
                                : 'border-gray-600 hover:border-gray-500'
                        }`}
                    >
                        <div className="text-center">
                            <div className="text-4xl mb-2">🔧</div>
                            <h3 className="text-xl font-bold text-white mb-2">Socio/Mecánico</h3>
                            <p className="text-gray-300 text-sm">
                                Panel de gestión para proveedores de servicios
                            </p>
                            <div className="mt-3 text-xs text-green-400">
                                • Recibir solicitudes • Gestionar servicios • Dashboard ganancias
                            </div>
                        </div>
                    </button>
                </div>

                {selectedType && (
                    <button
                        onClick={() => handleLogin(selectedType)}
                        disabled={isLoading}
                        className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                            selectedType === 'user' 
                                ? 'bg-blue-600 hover:bg-blue-700' 
                                : 'bg-green-600 hover:bg-green-700'
                        } disabled:opacity-50`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                Accediendo...
                            </div>
                        ) : (
                            `Acceder como ${selectedType === 'user' ? 'Usuario' : 'Socio'}`
                        )}
                    </button>
                )}

                <div className="mt-6 text-center">
                    <p className="text-gray-400 text-xs">
                        Demo Mode • Datos simulados • Funcionalidad completa
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DemoLogin;