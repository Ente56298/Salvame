import React, { useState, useEffect } from 'react';

interface DemoSimulatorProps {
    onExitDemo: () => void;
}

const DemoSimulator: React.FC<DemoSimulatorProps> = ({ onExitDemo }) => {
    const [step, setStep] = useState(0);
    const [isSimulating, setIsSimulating] = useState(false);

    const demoSteps = [
        { title: "🚨 Emergencia Simulada", desc: "Tu vehículo se ha descompuesto", action: "Activar SOS" },
        { title: "📍 Ubicación Detectada", desc: "GPS: Av. Reforma, CDMX", action: "Confirmar" },
        { title: "🔧 Buscando Mecánico", desc: "Encontrando el más cercano...", action: "Esperar" },
        { title: "👨‍🔧 Mecánico Asignado", desc: "Juan Pérez - ETA: 15 min", action: "Contactar" },
        { title: "✅ Servicio Completado", desc: "Problema resuelto - $800 MXN", action: "Calificar" }
    ];

    const simulateStep = () => {
        setIsSimulating(true);
        setTimeout(() => {
            setIsSimulating(false);
            if (step < demoSteps.length - 1) {
                setStep(step + 1);
            }
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="max-w-md mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-xl font-bold">DEMO INTERACTIVO</h1>
                    <button onClick={onExitDemo} className="text-gray-400 hover:text-white">
                        ✕ Salir
                    </button>
                </div>

                <div className="bg-gray-800 rounded-2xl p-6 mb-6">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold mb-2">{demoSteps[step].title}</h2>
                        <p className="text-gray-300">{demoSteps[step].desc}</p>
                    </div>

                    {isSimulating ? (
                        <div className="text-center py-8">
                            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-blue-400">Procesando...</p>
                        </div>
                    ) : (
                        <button
                            onClick={simulateStep}
                            disabled={step >= demoSteps.length - 1}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                        >
                            {demoSteps[step].action}
                        </button>
                    )}
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="font-bold mb-2">Progreso del Demo:</h3>
                    <div className="flex space-x-2">
                        {demoSteps.map((_, index) => (
                            <div
                                key={index}
                                className={`flex-1 h-2 rounded ${
                                    index <= step ? 'bg-blue-500' : 'bg-gray-600'
                                }`}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                        Paso {step + 1} de {demoSteps.length}
                    </p>
                </div>

                {step >= demoSteps.length - 1 && (
                    <div className="mt-6 bg-green-900/50 border border-green-700 rounded-lg p-4 text-center">
                        <h3 className="font-bold text-green-400 mb-2">¡Demo Completado! 🎉</h3>
                        <p className="text-sm text-gray-300 mb-4">
                            Has experimentado el flujo completo de asistencia vial
                        </p>
                        <button
                            onClick={onExitDemo}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                        >
                            Solicitar Versión Completa
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DemoSimulator;