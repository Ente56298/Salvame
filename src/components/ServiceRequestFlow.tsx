import React, { useState, useEffect } from 'react';

interface ServiceRequestFlowProps {
    onComplete: () => void;
    onCancel: () => void;
}

const ServiceRequestFlow: React.FC<ServiceRequestFlowProps> = ({ onComplete, onCancel }) => {
    const [step, setStep] = useState<'searching' | 'found' | 'confirmed' | 'tracking'>('searching');
    const [progress, setProgress] = useState(0);
    const [mechanic] = useState({
        name: "Juan Pérez",
        rating: 4.8,
        eta: "8 min",
        phone: "+52 55 1234 5678",
        vehicle: "Nissan Tsuru Blanco",
        plate: "ABC-123"
    });

    useEffect(() => {
        if (step === 'searching') {
            const timer = setTimeout(() => setStep('found'), 3000);
            return () => clearTimeout(timer);
        }
        if (step === 'tracking') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        onComplete();
                        return 100;
                    }
                    return prev + 1;
                });
            }, 100);
            return () => clearInterval(interval);
        }
    }, [step, onComplete]);

    const handleConfirm = () => {
        setStep('confirmed');
        setTimeout(() => setStep('tracking'), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end">
            <div className="w-full bg-white rounded-t-3xl p-6 animate-slide-up">
                {step === 'searching' && (
                    <div className="text-center py-8">
                        <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Buscando mecánicos...</h2>
                        <p className="text-gray-600">Encontrando el mejor servicio cerca de ti</p>
                    </div>
                )}

                {step === 'found' && (
                    <div className="py-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">¡Mecánico encontrado!</h2>
                        
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                            <div className="flex items-center mb-3">
                                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mr-4">
                                    <span className="text-white text-2xl">👨🔧</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800 text-lg">{mechanic.name}</h3>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="text-yellow-500 mr-1">⭐</span>
                                        <span>{mechanic.rating}</span>
                                        <span className="mx-2">•</span>
                                        <span>ETA: {mechanic.eta}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Vehículo:</span>
                                    <div className="font-semibold">{mechanic.vehicle}</div>
                                </div>
                                <div>
                                    <span className="text-gray-500">Placas:</span>
                                    <div className="font-semibold">{mechanic.plate}</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onCancel}
                                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-2 bg-green-600 text-white py-3 px-6 rounded-xl font-semibold"
                            >
                                Confirmar Servicio
                            </button>
                        </div>
                    </div>
                )}

                {step === 'confirmed' && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl">✓</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">¡Servicio confirmado!</h2>
                        <p className="text-gray-600">{mechanic.name} está en camino</p>
                    </div>
                )}

                {step === 'tracking' && (
                    <div className="py-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Seguimiento en vivo</h2>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-white">👨🔧</span>
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800">{mechanic.name}</div>
                                        <div className="text-sm text-gray-600">En camino • {mechanic.eta}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-green-600 font-bold">🚗 En ruta</div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Progreso</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-100"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center bg-green-600 text-white py-3 rounded-xl font-semibold">
                                <span className="mr-2">📞</span>
                                Llamar
                            </button>
                            <button className="flex items-center justify-center bg-blue-600 text-white py-3 rounded-xl font-semibold">
                                <span className="mr-2">💬</span>
                                Chat
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceRequestFlow;