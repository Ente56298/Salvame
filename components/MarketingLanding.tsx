import React, { useState } from 'react';
import QuickDemo from './QuickDemo';
import SocialProof from './SocialProof';

interface MarketingLandingProps {
    onStartDemo: () => void;
    onRequestInvestment: () => void;
}

const MarketingLanding: React.FC<MarketingLandingProps> = ({ onStartDemo, onRequestInvestment }) => {
    const [activeTab, setActiveTab] = useState<'demo' | 'investors'>('demo');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-5xl font-bold text-white mb-4">
                    🚨 Asistencia Vial México
                </h1>
                <p className="text-xl text-blue-300 mb-2">
                    La primera plataforma integral de asistencia vial con IA
                </p>
                <p className="text-sm text-gray-400 mb-8">
                    🚀 Live en <a href="https://asistencia-vial.vercel.app" className="text-blue-400 hover:underline">asistencia-vial.vercel.app</a>
                </p>
                
                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-800 rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab('demo')}
                            className={`px-6 py-2 rounded-md transition-colors ${
                                activeTab === 'demo' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            🎮 Demo
                        </button>
                        <button
                            onClick={() => setActiveTab('investors')}
                            className={`px-6 py-2 rounded-md transition-colors ${
                                activeTab === 'investors' 
                                    ? 'bg-green-600 text-white' 
                                    : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            💰 Inversores
                        </button>
                    </div>
                </div>

                {/* Content */}
                {activeTab === 'demo' ? (
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6">
                                <h2 className="text-2xl font-bold text-white mb-4">Demo en 30 Segundos</h2>
                                <QuickDemo />
                            </div>
                            <div className="space-y-4">
                                <div className="bg-gray-700/50 p-4 rounded-lg">
                                    <div className="text-blue-400 font-bold mb-1">⚡ SOS Instantáneo</div>
                                    <div className="text-gray-300 text-sm">GPS automático en 3s</div>
                                </div>
                                <div className="bg-gray-700/50 p-4 rounded-lg">
                                    <div className="text-green-400 font-bold mb-1">🤖 IA Integrada</div>
                                    <div className="text-gray-300 text-sm">Diagnóstico inteligente</div>
                                </div>
                                <div className="bg-gray-700/50 p-4 rounded-lg">
                                    <div className="text-yellow-400 font-bold mb-1">🔧 Red 24/7</div>
                                    <div className="text-gray-300 text-sm">+500 talleres verificados</div>
                                </div>
                                <button
                                    onClick={onStartDemo}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                                >
                                    🚀 Demo Completo
                                </button>
                            </div>
                        </div>
                        <SocialProof />
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 mb-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Oportunidad de Inversión 🚀</h2>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-400">$50M</div>
                                    <div className="text-sm text-gray-300">Mercado México</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-400">85%</div>
                                    <div className="text-sm text-gray-300">MVP Completo</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-yellow-400">2M</div>
                                    <div className="text-sm text-gray-300">Usuarios Meta Y1</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-400">$15</div>
                                    <div className="text-sm text-gray-300">ARPU Mensual</div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4">✅ Traction</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center text-gray-300">
                                            <span className="text-green-400 mr-2">✓</span>
                                            MVP funcional desplegado
                                        </div>
                                        <div className="flex items-center text-gray-300">
                                            <span className="text-green-400 mr-2">✓</span>
                                            Demo validado con usuarios
                                        </div>
                                        <div className="flex items-center text-gray-300">
                                            <span className="text-green-400 mr-2">✓</span>
                                            Tecnología probada (React + IA)
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4">💰 Modelo</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center text-gray-300">
                                            <span className="text-blue-400 mr-2">•</span>
                                            Freemium: $0-15/mes
                                        </div>
                                        <div className="flex items-center text-gray-300">
                                            <span className="text-blue-400 mr-2">•</span>
                                            Comisiones: 15-20% por servicio
                                        </div>
                                        <div className="flex items-center text-gray-300">
                                            <span className="text-blue-400 mr-2">•</span>
                                            B2B: Seguros y flotas
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={onRequestInvestment}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
                            >
                                💼 Solicitar Pitch Deck Completo
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Footer */}
            <div className="text-center py-8 border-t border-gray-800 mt-16">
                <p className="text-gray-400 text-sm mb-2">
                    🚀 Desplegado en Vercel • 📱 PWA Ready • 🤖 IA Powered
                </p>
                <div className="flex justify-center space-x-4 text-xs">
                    <a href="https://github.com/Ente56298/asistencia_vial" target="_blank" className="text-blue-400 hover:text-blue-300">
                        📂 GitHub
                    </a>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-400">Made in México 🇲🇽</span>
                </div>
            </div>
        </div>
    );
};

export default MarketingLanding;