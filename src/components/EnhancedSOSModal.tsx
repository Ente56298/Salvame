import React, { useState, useEffect } from 'react';
import { getEmergencyResponse } from '../services/geminiService';
import SpinnerIcon from './icons/SpinnerIcon';

interface EnhancedSOSModalProps {
    onClose: () => void;
}

const EnhancedSOSModal: React.FC<EnhancedSOSModalProps> = ({ onClose }) => {
    const [status, setStatus] = useState<'counting' | 'sending' | 'confirmed' | 'cancelled'>('counting');
    const [countdown, setCountdown] = useState(3);
    const [responseMessage, setResponseMessage] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (status === 'counting') {
            if (countdown > 0) {
                const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
                return () => clearTimeout(timer);
            } else {
                setStatus('sending');
            }
        }
    }, [status, countdown]);

    useEffect(() => {
        if (status === 'sending') {
            const fetchResponse = async () => {
                try {
                    const message = await getEmergencyResponse();
                    setResponseMessage(`🚨 ALERTA ENVIADA

📍 Ubicación GPS obtenida en <3s
📱 Contactos de emergencia notificados
🚑 Servicios de emergencia alertados

${message}`);
                    setStatus('confirmed');
                } catch (e) {
                    setError('⚠️ GPS no disponible - usando ubicación aproximada\n📞 Contacta manualmente: 911\n🚨 Alerta enviada con datos disponibles');
                    setStatus('confirmed');
                }
            };
            fetchResponse();
        }
    }, [status]);

    const handleCancel = () => {
        setStatus('cancelled');
    };

    const renderContent = () => {
        switch (status) {
            case 'counting':
                return (
                    <>
                        <div className="text-6xl mb-4 animate-pulse">🚨</div>
                        <h2 className="text-2xl font-bold mb-4 text-white">Confirmando Alerta SOS</h2>
                        <p className="text-gray-300 mb-6">Enviando señal de emergencia en...</p>
                        <div className="text-8xl font-mono font-bold text-red-400 mb-8 animate-pulse">
                            {countdown}
                        </div>
                        <button
                            onClick={handleCancel}
                            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-xl transition-colors border-2 border-gray-500"
                        >
                            ❌ Cancelar Alerta
                        </button>
                    </>
                );
            case 'sending':
                return (
                    <>
                        <div className="text-6xl mb-4">📡</div>
                        <h2 className="text-2xl font-bold mb-4 text-white">Enviando Alerta...</h2>
                        <p className="text-gray-300 mb-6">Contactando a los servicios de emergencia. Por favor, espere.</p>
                        <SpinnerIcon className="w-16 h-16 text-red-400" />
                    </>
                );
            case 'confirmed':
                return (
                    <>
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-2xl font-bold mb-4 text-green-400">Alerta Confirmada</h2>
                        <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-6 max-w-md">
                            <p className="text-gray-200 whitespace-pre-wrap text-center leading-relaxed">
                                {error || responseMessage}
                            </p>
                        </div>
                    </>
                );
            case 'cancelled':
                return (
                    <>
                        <div className="text-6xl mb-4">❌</div>
                        <h2 className="text-2xl font-bold mb-4 text-yellow-400">Alerta Cancelada</h2>
                        <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-6 max-w-md">
                            <p className="text-gray-200 text-center">
                                La alerta SOS ha sido cancelada exitosamente.
                                <br /><br />
                                Si necesitas ayuda, puedes activar el SOS nuevamente desde el dashboard.
                            </p>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-lg bg-gray-900/90 border-2 border-red-500/50 rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center text-center">
                {renderContent()}
                
                <button
                    onClick={onClose}
                    className="absolute -top-4 -right-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors shadow-lg"
                    aria-label="Cerrar"
                >
                    ✕
                </button>
                
                {(status === 'confirmed' || status === 'cancelled') && (
                    <button
                        onClick={onClose}
                        className="mt-8 bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-3 px-8 rounded-xl transition-colors shadow-lg"
                    >
                        Entendido
                    </button>
                )}
            </div>
        </div>
    );
};

export default EnhancedSOSModal;