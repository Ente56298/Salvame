import React, { useState, useEffect } from 'react';
import { useGameification } from '../hooks/useGameification';

interface Manual {
  id: string;
  title: string;
  category: 'motor' | 'frenos' | 'transmision' | 'electrico' | 'suspension' | 'general';
  difficulty: 'basico' | 'intermedio' | 'avanzado';
  duration: string;
  tools: string[];
  steps: ManualStep[];
  warnings: string[];
  tips: string[];
}

interface ManualStep {
  id: number;
  title: string;
  description: string;
  image?: string;
  video?: string;
  tools: string[];
  timeEstimate: string;
}

const ServiceManuals: React.FC = () => {
  const { actions } = useGameification();
  const [selectedCategory, setSelectedCategory] = useState<Manual['category']>('general');
  const [selectedManual, setSelectedManual] = useState<Manual | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const manuals: Manual[] = [
    {
      id: '1',
      title: 'Cambio de Aceite de Motor',
      category: 'motor',
      difficulty: 'basico',
      duration: '30-45 min',
      tools: ['Llave de filtro', 'Recipiente 5L', 'Embudo', 'Guantes'],
      warnings: ['Motor caliente puede causar quemaduras', 'Usar gafas de protección'],
      tips: ['Cambiar cada 5,000-7,500 km', 'Verificar nivel semanalmente'],
      steps: [
        {
          id: 1,
          title: 'Preparación del vehículo',
          description: 'Calentar motor 2-3 minutos, apagar y esperar 10 minutos. Levantar vehículo con gato.',
          tools: ['Gato hidráulico', 'Soportes'],
          timeEstimate: '10 min'
        },
        {
          id: 2,
          title: 'Drenar aceite usado',
          description: 'Localizar tapón de drenaje, colocar recipiente debajo y aflojar con llave.',
          tools: ['Llave 17mm', 'Recipiente'],
          timeEstimate: '15 min'
        },
        {
          id: 3,
          title: 'Cambiar filtro de aceite',
          description: 'Remover filtro viejo con llave especial, limpiar superficie y instalar nuevo.',
          tools: ['Llave de filtro', 'Trapo'],
          timeEstimate: '10 min'
        },
        {
          id: 4,
          title: 'Agregar aceite nuevo',
          description: 'Instalar tapón de drenaje, agregar aceite nuevo por el motor usando embudo.',
          tools: ['Embudo', 'Aceite nuevo'],
          timeEstimate: '10 min'
        }
      ]
    },
    {
      id: '2',
      title: 'Revisión de Frenos',
      category: 'frenos',
      difficulty: 'intermedio',
      duration: '45-60 min',
      tools: ['Llaves métricas', 'Gato', 'Linterna', 'Calibrador'],
      warnings: ['Sistema crítico de seguridad', 'No conducir si hay dudas'],
      tips: ['Revisar cada 10,000 km', 'Cambiar líquido cada 2 años'],
      steps: [
        {
          id: 1,
          title: 'Inspección visual',
          description: 'Revisar nivel de líquido de frenos, buscar fugas en mangueras.',
          tools: ['Linterna'],
          timeEstimate: '10 min'
        },
        {
          id: 2,
          title: 'Revisar pastillas',
          description: 'Remover rueda, inspeccionar grosor de pastillas (mín 3mm).',
          tools: ['Gato', 'Llaves', 'Calibrador'],
          timeEstimate: '20 min'
        },
        {
          id: 3,
          title: 'Inspeccionar discos',
          description: 'Verificar superficie de discos, buscar rayones o deformaciones.',
          tools: ['Linterna', 'Calibrador'],
          timeEstimate: '15 min'
        }
      ]
    },
    {
      id: '3',
      title: 'Diagnóstico Eléctrico Básico',
      category: 'electrico',
      difficulty: 'avanzado',
      duration: '60-90 min',
      tools: ['Multímetro', 'Scanner OBD2', 'Cables de prueba'],
      warnings: ['Desconectar batería antes de trabajar', 'Evitar cortocircuitos'],
      tips: ['Siempre verificar fusibles primero', 'Documentar códigos de error'],
      steps: [
        {
          id: 1,
          title: 'Verificar batería',
          description: 'Medir voltaje de batería (12.6V en reposo, 14.4V con motor).',
          tools: ['Multímetro'],
          timeEstimate: '15 min'
        },
        {
          id: 2,
          title: 'Escanear códigos',
          description: 'Conectar scanner OBD2, leer códigos de error del ECU.',
          tools: ['Scanner OBD2'],
          timeEstimate: '20 min'
        },
        {
          id: 3,
          title: 'Probar circuitos',
          description: 'Verificar continuidad en cables, medir resistencias de sensores.',
          tools: ['Multímetro', 'Cables'],
          timeEstimate: '30 min'
        }
      ]
    }
  ];

  const categories = [
    { id: 'general', name: 'General', icon: '🔧', count: 5 },
    { id: 'motor', name: 'Motor', icon: '⚙️', count: 8 },
    { id: 'frenos', name: 'Frenos', icon: '🛑', count: 4 },
    { id: 'transmision', name: 'Transmisión', icon: '⚡', count: 3 },
    { id: 'electrico', name: 'Eléctrico', icon: '🔌', count: 6 },
    { id: 'suspension', name: 'Suspensión', icon: '🏗️', count: 3 }
  ];

  const filteredManuals = manuals.filter(manual => manual.category === selectedCategory);

  const getDifficultyColor = (difficulty: Manual['difficulty']) => {
    switch (difficulty) {
      case 'basico': return 'text-green-400 bg-green-900/30';
      case 'intermedio': return 'text-yellow-400 bg-yellow-900/30';
      case 'avanzado': return 'text-red-400 bg-red-900/30';
    }
  };

  const completeStep = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
      actions.addXP(25, `Paso completado: ${selectedManual?.steps[stepId - 1]?.title}`);
    }
  };

  const completeManual = () => {
    if (selectedManual && completedSteps.length === selectedManual.steps.length) {
      actions.addXP(100, `Manual completado: ${selectedManual.title}`);
      setSelectedManual(null);
      setCompletedSteps([]);
      setCurrentStep(0);
    }
  };

  useEffect(() => {
    if (selectedManual && completedSteps.length === selectedManual.steps.length) {
      setTimeout(completeManual, 1000);
    }
  }, [completedSteps, selectedManual]);

  if (selectedManual) {
    const progress = (completedSteps.length / selectedManual.steps.length) * 100;
    
    return (
      <div className="bg-gray-800 p-6 rounded-lg">
        {/* Manual Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{selectedManual.title}</h2>
            <div className="flex items-center gap-4 text-sm">
              <span className={`px-3 py-1 rounded-full ${getDifficultyColor(selectedManual.difficulty)}`}>
                {selectedManual.difficulty.toUpperCase()}
              </span>
              <span className="text-gray-300">⏱️ {selectedManual.duration}</span>
              <span className="text-gray-300">📋 {selectedManual.steps.length} pasos</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedManual(null)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            ← Volver
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>Progreso del Manual</span>
            <span>{Math.round(progress)}% Completado</span>
          </div>
          <div className="bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Tools Required */}
        <div className="mb-6 bg-gray-700 p-4 rounded-lg">
          <h3 className="font-bold text-white mb-3">🛠️ Herramientas Necesarias</h3>
          <div className="flex flex-wrap gap-2">
            {selectedManual.tools.map((tool, index) => (
              <span key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Warnings */}
        {selectedManual.warnings.length > 0 && (
          <div className="mb-6 bg-red-900/30 border border-red-500/30 p-4 rounded-lg">
            <h3 className="font-bold text-red-400 mb-3">⚠️ Advertencias de Seguridad</h3>
            <ul className="space-y-1">
              {selectedManual.warnings.map((warning, index) => (
                <li key={index} className="text-red-300 text-sm">• {warning}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Steps */}
        <div className="space-y-4">
          {selectedManual.steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === index;
            
            return (
              <div key={step.id} className={`p-4 rounded-lg border-2 transition-all ${
                isCompleted ? 'bg-green-900/30 border-green-500/50' :
                isCurrent ? 'bg-blue-900/30 border-blue-500/50' :
                'bg-gray-700 border-gray-600'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isCurrent ? 'bg-blue-500 text-white' :
                      'bg-gray-600 text-gray-300'
                    }`}>
                      {isCompleted ? '✓' : step.id}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{step.title}</h4>
                      <div className="text-sm text-gray-300">⏱️ {step.timeEstimate}</div>
                    </div>
                  </div>
                  
                  {!isCompleted && (
                    <button
                      onClick={() => completeStep(step.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Completar
                    </button>
                  )}
                </div>
                
                <p className="text-gray-300 mb-3">{step.description}</p>
                
                {step.tools.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {step.tools.map((tool, toolIndex) => (
                      <span key={toolIndex} className="bg-gray-600 text-gray-200 px-2 py-1 rounded text-xs">
                        🔧 {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tips */}
        {selectedManual.tips.length > 0 && (
          <div className="mt-6 bg-blue-900/30 border border-blue-500/30 p-4 rounded-lg">
            <h3 className="font-bold text-blue-400 mb-3">💡 Consejos Profesionales</h3>
            <ul className="space-y-1">
              {selectedManual.tips.map((tip, index) => (
                <li key={index} className="text-blue-300 text-sm">• {tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">📖</span>
        <div>
          <h2 className="text-xl font-bold text-white">Manuales de Servicio Automotriz</h2>
          <p className="text-gray-400">Guías paso a paso para mantenimiento vehicular</p>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="font-bold text-white mb-4">🔧 Categorías de Servicio</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as Manual['category'])}
              className={`p-4 rounded-lg border transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 border-blue-400 text-white'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="font-bold">{category.name}</div>
              <div className="text-sm opacity-75">{category.count} manuales</div>
            </button>
          ))}
        </div>
      </div>

      {/* Manuals List */}
      <div className="space-y-4">
        <h3 className="font-bold text-white mb-4">📋 Manuales Disponibles</h3>
        
        {filteredManuals.map((manual) => (
          <div key={manual.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-white text-lg">{manual.title}</h4>
                <div className="flex items-center gap-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(manual.difficulty)}`}>
                    {manual.difficulty.toUpperCase()}
                  </span>
                  <span className="text-gray-300 text-sm">⏱️ {manual.duration}</span>
                  <span className="text-gray-300 text-sm">📋 {manual.steps.length} pasos</span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setSelectedManual(manual);
                  actions.addXP(15, `Manual iniciado: ${manual.title}`);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
              >
                Iniciar Manual
              </button>
            </div>
            
            <div className="mb-3">
              <h5 className="font-bold text-white text-sm mb-2">🛠️ Herramientas:</h5>
              <div className="flex flex-wrap gap-2">
                {manual.tools.slice(0, 4).map((tool, index) => (
                  <span key={index} className="bg-gray-600 text-gray-200 px-2 py-1 rounded text-xs">
                    {tool}
                  </span>
                ))}
                {manual.tools.length > 4 && (
                  <span className="text-gray-400 text-xs">+{manual.tools.length - 4} más</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-blue-400">{manuals.length}</div>
          <div className="text-sm text-gray-300">Manuales</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-green-400">{categories.length}</div>
          <div className="text-sm text-gray-300">Categorías</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-purple-400">
            {manuals.reduce((acc, manual) => acc + manual.steps.length, 0)}
          </div>
          <div className="text-sm text-gray-300">Pasos Total</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {manuals.filter(m => m.difficulty === 'basico').length}
          </div>
          <div className="text-sm text-gray-300">Básicos</div>
        </div>
      </div>
    </div>
  );
};

export default ServiceManuals;