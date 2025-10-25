import React, { useState, useEffect } from 'react';

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: '¡Bienvenido a Asistencia Vial!',
    content: 'Te guiaremos por las funciones principales de la aplicación.',
    position: 'bottom'
  },
  {
    id: 'sos',
    title: 'Botón SOS',
    content: 'En caso de emergencia, presiona este botón para enviar tu ubicación a servicios de emergencia.',
    target: '[data-tutorial="sos-button"]',
    position: 'bottom'
  },
  {
    id: 'map',
    title: 'Mapa Interactivo',
    content: 'Aquí puedes ver tu ubicación actual y buscar servicios cercanos.',
    target: '[data-tutorial="map"]',
    position: 'top'
  },
  {
    id: 'services',
    title: 'Búsqueda de Servicios',
    content: 'Encuentra talleres, gasolineras y otros servicios automotrices cerca de ti.',
    target: '[data-tutorial="services"]',
    position: 'left'
  },
  {
    id: 'profile',
    title: 'Tu Perfil',
    content: 'Configura tu información personal, vehículo y contactos de emergencia.',
    target: '[data-tutorial="profile"]',
    position: 'bottom'
  }
];

interface TutorialProps {
  onComplete: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (hasSeenTutorial) {
      setIsVisible(false);
      onComplete();
    }
  }, [onComplete]);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTutorial = () => {
    completeTutorial();
  };

  const completeTutorial = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  const step = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold">{step.title}</h3>
            <div className="text-sm text-gray-500 mt-1">
              Paso {currentStep + 1} de {tutorialSteps.length}
            </div>
          </div>
          <button
            onClick={skipTutorial}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            Saltar
          </button>
        </div>

        <p className="text-gray-700 mb-6">{step.content}</p>

        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-4 py-2 text-gray-600 disabled:text-gray-300"
          >
            Anterior
          </button>

          <div className="flex space-x-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {currentStep === tutorialSteps.length - 1 ? 'Finalizar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
};