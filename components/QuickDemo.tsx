import React, { useState } from 'react';

const QuickDemo: React.FC = () => {
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState('');

    const steps = [
        { icon: "🚨", title: "SOS Activado", desc: "GPS detectado automáticamente" },
        { icon: "🔧", title: "Mecánico Encontrado", desc: "Juan Pérez - 4.8⭐ - 12 min" },
        { icon: "✅", title: "Problema Resuelto", desc: "Batería cambiada - $650 MXN" }
    ];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            // Save lead
            const leads = JSON.parse(localStorage.getItem('quickDemoLeads') || '[]');
            leads.push({ email, timestamp: Date.now(), completed: true });
            localStorage.setItem('quickDemoLeads', JSON.stringify(leads));
        }
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6 max-w-sm mx-auto">
            <div className="text-center mb-6">
                <div className="text-4xl mb-2">{steps[step].icon}</div>
                <h3 className="text-lg font-bold text-white">{steps[step].title}</h3>
                <p className="text-gray-300 text-sm">{steps[step].desc}</p>
            </div>

            {step < steps.length - 1 ? (
                <button
                    onClick={handleNext}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
                >
                    Continuar Demo
                </button>
            ) : (
                <div className="space-y-3">
                    <input
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-700 text-white p-3 rounded-lg"
                    />
                    <button
                        onClick={handleNext}
                        disabled={!email}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg"
                    >
                        Obtener Acceso Completo
                    </button>
                </div>
            )}

            <div className="flex justify-center mt-4 space-x-2">
                {steps.map((_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${i <= step ? 'bg-blue-500' : 'bg-gray-600'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default QuickDemo;