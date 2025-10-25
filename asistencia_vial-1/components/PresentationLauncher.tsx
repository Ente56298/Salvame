import React, { useState } from 'react';
import PresentationViewer from './PresentationViewer';

const PresentationLauncher: React.FC = () => {
  const [showPresentation, setShowPresentation] = useState(false);

  if (showPresentation) {
    return (
      <div>
        <PresentationViewer />
        <button
          onClick={() => setShowPresentation(false)}
          className="fixed top-4 left-4 z-50 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold"
        >
          ✕ Cerrar Presentación
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="text-center space-y-6">
        <div className="text-6xl">📊</div>
        <h2 className="text-2xl font-bold text-white">Presentación Ejecutiva</h2>
        <p className="text-gray-300">
          Ecosistema Asistencia Vial Gamificada
        </p>
        <p className="text-sm text-gray-400">
          9 slides • Potencial $100M+ USD • 4 apps separadas
        </p>
        
        <button
          onClick={() => setShowPresentation(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all transform hover:scale-105 shadow-lg"
        >
          🚀 Iniciar Presentación
        </button>

        <div className="grid grid-cols-3 gap-4 mt-8 text-sm">
          <div className="bg-gray-700 p-3 rounded">
            <div className="text-green-400 font-bold">$10.3M</div>
            <div className="text-gray-300">Año 1</div>
          </div>
          <div className="bg-gray-700 p-3 rounded">
            <div className="text-blue-400 font-bold">4 Apps</div>
            <div className="text-gray-300">Separadas</div>
          </div>
          <div className="bg-gray-700 p-3 rounded">
            <div className="text-purple-400 font-bold">$500M+</div>
            <div className="text-gray-300">Salida</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationLauncher;