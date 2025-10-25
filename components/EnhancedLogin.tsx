import React, { useState, useEffect } from 'react';

interface EnhancedLoginProps {
    onLogin: (userType: 'user' | 'partner') => void;
}

const EnhancedLogin: React.FC<EnhancedLoginProps> = ({ onLogin }) => {
    const [selectedType, setSelectedType] = useState<'user' | 'partner' | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogin = (type: 'user' | 'partner') => {
        setIsLoading(true);
        setTimeout(() => {
            onLogin(type);
            setIsLoading(false);
        }, 1500);
    };

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return "Buenos días";
        if (hour < 18) return "Buenas tardes";
        return "Buenas noches";
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-white/60 text-sm mb-2">
                        {currentTime.toLocaleTimeString('es-MX', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true 
                        })}
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        {getGreeting()} 👋
                    </h1>
                    <h2 className="text-2xl font-bold text-amber-400 mb-2">
                        Asistente Vial México
                    </h2>
                    <p className="text-blue-200 mb-4">Tu copiloto inteligente en el camino</p>
                    <div className="inline-flex items-center px-4 py-2 bg-green-500/20 rounded-full border border-green-400/30">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                        <span className="text-green-300 text-sm font-semibold">Sistema Activo</span>
                    </div>
                </div>

                {/* User Type Selection */}
                <div className="space-y-4 mb-8">
                    <button
                        onClick={() => setSelectedType('user')}
                        className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                            selectedType === 'user' 
                                ? 'border-blue-400 bg-blue-500/30 shadow-xl shadow-blue-500/25 scale-105' 
                                : 'border-white/20 hover:border-blue-400/50 bg-white/5'
                        }`}
                    >
                        <div className="text-center">
                            <div className="text-6xl mb-4">🚗</div>
                            <h3 className="text-xl font-bold text-white mb-2">Conductor</h3>
                            <p className="text-gray-300 text-sm mb-4">
                                Solicita asistencia vial cuando la necesites
                            </p>
                            <div className="grid grid-cols-3 gap-2 text-xs text-blue-300">
                                <span className="bg-blue-500/20 px-2 py-1 rounded-full">SOS</span>
                                <span className="bg-blue-500/20 px-2 py-1 rounded-full">GPS</span>
                                <span className="bg-blue-500/20 px-2 py-1 rounded-full">24/7</span>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => setSelectedType('partner')}
                        className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                            selectedType === 'partner' 
                                ? 'border-green-400 bg-green-500/30 shadow-xl shadow-green-500/25 scale-105' 
                                : 'border-white/20 hover:border-green-400/50 bg-white/5'
                        }`}
                    >
                        <div className="text-center">
                            <div className="text-6xl mb-4">🔧</div>
                            <h3 className="text-xl font-bold text-white mb-2">Mecánico</h3>
                            <p className="text-gray-300 text-sm mb-4">
                                Ofrece servicios y genera ingresos
                            </p>
                            <div className="grid grid-cols-3 gap-2 text-xs text-green-300">
                                <span className="bg-green-500/20 px-2 py-1 rounded-full">Solicitudes</span>
                                <span className="bg-green-500/20 px-2 py-1 rounded-full">Dashboard</span>
                                <span className="bg-green-500/20 px-2 py-1 rounded-full">Ganancias</span>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Login Button */}
                {selectedType && (
                    <button
                        onClick={() => handleLogin(selectedType)}
                        disabled={isLoading}
                        className={`w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 ${
                            selectedType === 'user' 
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl shadow-blue-500/25' 
                                : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-xl shadow-green-500/25'
                        } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin w-6 h-6 border-3 border-white border-t-transparent rounded-full mr-3"></div>
                                <span>Iniciando sesión...</span>
                            </div>
                        ) : (
                            <span className="text-lg">
                                {selectedType === 'user' ? '🚗 Acceder como Conductor' : '🔧 Acceder como Mecánico'}
                            </span>
                        )}
                    </button>
                )}

                {/* Footer */}
                <div className="mt-8 text-center">
                    <div className="flex items-center justify-center space-x-4 text-xs text-white/50 mb-4">
                        <span>🔒 Seguro</span>
                        <span>•</span>
                        <span>⚡ Rápido</span>
                        <span>•</span>
                        <span>🇲🇽 México</span>
                    </div>
                    <p className="text-white/40 text-xs">
                        Versión Demo • <a href="https://asistencia-vial.vercel.app" className="text-blue-300 hover:text-blue-200">asistencia-vial.vercel.app</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EnhancedLogin;