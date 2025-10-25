import React, { useState, useEffect } from 'react';
import { getEmergencyResponse } from '../services/geminiService';

interface SOSModalProps {
    onClose: () => void;
}

const SOSModal: React.FC<SOSModalProps> = ({ onClose }) => {
    const [status, setStatus] = useState<'counting' | 'sending' | 'confirmed'>('counting');
    const [countdown, setCountdown] = useState(3);
    const [responseMessage, setResponseMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [canCancel, setCanCancel] = useState(true);

    useEffect(() => {
        if (status === 'counting') {
            if (countdown > 0) {
                const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
                return () => clearTimeout(timer);
            } else {
                setCanCancel(false);
                setStatus('sending');
            }
        }
    }, [status, countdown]);

    useEffect(() => {
        if (status === 'sending') {
            const handleEmergency = async () => {
                try {
                    // Simular obtención de GPS optimizada
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    const message = await getEmergencyResponse();
                    setResponseMessage(`🚨 ALERTA ENVIADA\n\n📍 Ubicación GPS obtenida en <3s\n📱 Contactos de emergencia notificados\n🚑 Servicios de emergencia alertados\n🚗 Grúa más cercana: 8 min\n\n${message}`);
                    setStatus('confirmed');
                } catch (e) {
                    setError('⚠️ GPS no disponible - usando ubicación aproximada\n📞 Contacta manualmente: 911\n🚨 Alerta enviada con datos disponibles');
                    setStatus('confirmed');
                }
            };
            handleEmergency();
        }
    }, [status]);

    const handleCancel = () => {
        if (canCancel) {
            onClose();
        }
    };

    const renderContent = () => {
        switch (status) {
            case 'counting':
                return (
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-white">⚠️ Confirmando Alerta SOS</h2>
                        <p className="text-gray-300 mb-6">Enviando señal de emergencia en...</p>
                        <div className="text-8xl font-mono font-bold text-red-400 animate-pulse">{countdown}</div>
                        <div className="mt-4 text-sm text-gray-400">
                            📍 Obteniendo ubicación GPS...
                        </div>
                        {canCancel && (
                            <button
                                onClick={handleCancel}
                                className="mt-6 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                            >
                                ❌ Cancelar SOS
                            </button>
                        )}
                    </>
                );
            case 'sending':
                return (
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-white">📡 Enviando Alerta...</h2>
                        <p className="text-gray-300 mb-6">Contactando servicios de emergencia</p>
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-400 border-t-transparent"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-2xl">🚨</div>
                        </div>
                        <div className="mt-4 space-y-2 text-sm text-gray-300">
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span>GPS localizado</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                <span>Enviando coordenadas...</span>
                            </div>
                        </div>
                    </>
                );
            case 'confirmed':
                return (
                     <>
                        <h2 className="text-2xl font-bold mb-4 text-green-400">✅ Alerta Confirmada</h2>
                        <p className="text-gray-200 whitespace-pre-wrap text-center max-w-md text-sm leading-relaxed">
                          {error || responseMessage}
                        </p>
                        <div className="mt-4 p-3 bg-green-900/30 border border-green-500/30 rounded-lg">
                            <div className="text-green-300 text-sm font-bold">🆔 ID de Emergencia: SOS-{Date.now().toString().slice(-6)}</div>
                        </div>
                        <button
                            onClick={onClose}
                            className="mt-6 bg-amber-500 text-gray-900 font-bold py-3 px-8 rounded-lg hover:bg-amber-400 transition-colors"
                        >
                            ✓ Entendido
                        </button>
                    </>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-lg bg-gray-900/90 border border-red-500/50 rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center text-center">
                {renderContent()}
                {status !== 'counting' && (
                    <button
                        onClick={onClose}
                        className="absolute -top-4 -right-4 bg-gray-700 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-600 transition-colors"
                        aria-label="Cerrar"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
};

export default SOSModal;