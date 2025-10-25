import React, { useState } from 'react';
import { useGameification } from '../hooks/useGameification';
import RealTimeTracking from './RealTimeTracking';
import NetworkScanner from './NetworkScanner';
import SmartApproximation from './SmartApproximation';
import VoiceCommands from './VoiceCommands';
import OfflineMapDownloader from './OfflineMapDownloader';
import PredictiveMaintenance from './PredictiveMaintenance';
import ServiceManuals from './ServiceManuals';
import PlusCodeIntegration from './PlusCodeIntegration';

const FunctionCenter: React.FC = () => {
  const { actions } = useGameification();
  const [activeFunction, setActiveFunction] = useState<'realtime' | 'network' | 'smart' | 'voice' | 'offline' | 'predictive' | 'manuals' | 'pluscodes'>('realtime');

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🚀</span>
        <div>
          <h2 className="text-xl font-bold text-white">Centro de Funciones Avanzadas</h2>
          <p className="text-gray-400">Herramientas especializadas para conductores</p>
        </div>
      </div>

      {/* Function Selector */}
      <div className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveFunction('realtime')}
            className={`p-4 rounded-lg border transition-all ${
              activeFunction === 'realtime'
                ? 'bg-blue-600 border-blue-400 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <div className="text-2xl mb-2">📡</div>
            <div className="font-bold">Seguimiento Tiempo Real</div>
            <div className="text-sm opacity-75">Ubicación y estado en vivo</div>
          </button>

          <button
            onClick={() => setActiveFunction('network')}
            className={`p-4 rounded-lg border transition-all ${
              activeFunction === 'network'
                ? 'bg-blue-600 border-blue-400 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <div className="text-2xl mb-2">🌐</div>
            <div className="font-bold">Escáner de Redes</div>
            <div className="text-sm opacity-75">WiFi, cellular, bluetooth</div>
          </button>

          <button
            onClick={() => setActiveFunction('smart')}
            className={`p-4 rounded-lg border transition-all ${
              activeFunction === 'smart'
                ? 'bg-blue-600 border-blue-400 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-bold">Aproximación Inteligente</div>
            <div className="text-sm opacity-75">Predicción por IA</div>
          </button>

          <button
            onClick={() => setActiveFunction('voice')}
            className={`p-4 rounded-lg border transition-all ${
              activeFunction === 'voice'
                ? 'bg-blue-600 border-blue-400 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <div className="text-2xl mb-2">🎤</div>
            <div className="font-bold">Comandos de Voz</div>
            <div className="text-sm opacity-75">Control por voz</div>
          </button>

          <button
            onClick={() => setActiveFunction('offline')}
            className={`p-4 rounded-lg border transition-all ${
              activeFunction === 'offline'
                ? 'bg-blue-600 border-blue-400 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <div className="text-2xl mb-2">📴</div>
            <div className="font-bold">Modo Offline</div>
            <div className="text-sm opacity-75">Sin conexión</div>
          </button>

          <button
            onClick={() => setActiveFunction('predictive')}
            className={`p-4 rounded-lg border transition-all ${
              activeFunction === 'predictive'
                ? 'bg-blue-600 border-blue-400 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <div className="text-2xl mb-2">🔮</div>
            <div className="font-bold">Mantenimiento Predictivo</div>
            <div className="text-sm opacity-75">IA predice fallas</div>
          </button>

          <button
            onClick={() => setActiveFunction('manuals')}
            className={`p-4 rounded-lg border transition-all ${
              activeFunction === 'manuals'
                ? 'bg-blue-600 border-blue-400 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <div className="text-2xl mb-2">📚</div>
            <div className="font-bold">Manuales de Servicio</div>
            <div className="text-sm opacity-75">Guías paso a paso</div>
          </button>

          <button
            onClick={() => setActiveFunction('pluscodes')}
            className={`p-4 rounded-lg border transition-all ${
              activeFunction === 'pluscodes'
                ? 'bg-blue-600 border-blue-400 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <div className="text-2xl mb-2">🌐</div>
            <div className="font-bold">Plus Codes</div>
            <div className="text-sm opacity-75">Ubicaciones precisas</div>
          </button>
        </div>
      </div>

      {/* Active Function Display */}
      <div className="bg-gray-800 rounded-lg p-1">
        {activeFunction === 'realtime' && <RealTimeTracking />}
        {activeFunction === 'network' && <NetworkScanner />}
        {activeFunction === 'smart' && <SmartApproximation />}
        {activeFunction === 'voice' && <VoiceCommands />}
        {activeFunction === 'offline' && <OfflineMapDownloader />}
        {activeFunction === 'predictive' && <PredictiveMaintenance />}
        {activeFunction === 'manuals' && <ServiceManuals />}
        {activeFunction === 'pluscodes' && <PlusCodeIntegration />}
      </div>
    </div>
  );
};

export default FunctionCenter;