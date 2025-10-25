import React, { useState } from 'react';
import { useGameification } from '../hooks/useGameification';
import SmartApproximation from './SmartApproximation';
import RealTimeTracking from './RealTimeTracking';
import NetworkScanner from './NetworkScanner';
import RealTimeAnalytics from './RealTimeAnalytics';
import AchievementsPanel from './AchievementsPanel';
import LeaderboardPanel from './LeaderboardPanel';

type FunctionView = 'menu' | 'approximation' | 'tracking' | 'networks' | 'analytics' | 'achievements' | 'leaderboard';

const FunctionAccessPanel: React.FC = () => {
  const { gameState, actions } = useGameification();
  const [currentView, setCurrentView] = useState<FunctionView>('menu');

  const functions = [
    {
      id: 'approximation',
      name: 'Aproximación Inteligente',
      icon: '🎯',
      description: 'Predicción por movimiento y puntos de acceso',
      color: 'bg-indigo-600 hover:bg-indigo-700',
      xp: 30
    },
    {
      id: 'tracking',
      name: 'Seguimiento Tiempo Real',
      icon: '📡',
      description: 'Tracking de servicios y estimaciones',
      color: 'bg-cyan-600 hover:bg-cyan-700',
      xp: 25
    },
    {
      id: 'networks',
      name: 'Escáner de Redes',
      icon: '🌐',
      description: 'Puntos de acceso y conectividad',
      color: 'bg-teal-600 hover:bg-teal-700',
      xp: 20
    },
    {
      id: 'analytics',
      name: 'Análisis en Tiempo Real',
      icon: '📊',
      description: 'Datos ambientales y factores de riesgo',
      color: 'bg-orange-600 hover:bg-orange-700',
      xp: 40
    },
    {
      id: 'achievements',
      name: 'Logros',
      icon: '🏆',
      description: 'Sistema de logros y recompensas',
      color: 'bg-purple-600 hover:bg-purple-700',
      xp: 0
    },
    {
      id: 'leaderboard',
      name: 'Ranking',
      icon: '🥇',
      description: 'Tabla de posiciones competitiva',
      color: 'bg-yellow-600 hover:bg-yellow-700',
      xp: 0
    }
  ];

  const handleFunctionSelect = (functionId: string, xp: number) => {
    setCurrentView(functionId as FunctionView);
    if (xp > 0) {
      actions.addXP(xp, `Accediste a ${functions.find(f => f.id === functionId)?.name}`);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'approximation':
        return <SmartApproximation />;
      case 'tracking':
        return <RealTimeTracking />;
      case 'networks':
        return <NetworkScanner />;
      case 'analytics':
        return <RealTimeAnalytics />;
      case 'achievements':
        return <AchievementsPanel />;
      case 'leaderboard':
        return <LeaderboardPanel />;
      default:
        return null;
    }
  };

  if (currentView !== 'menu') {
    return (
      <div className="bg-gray-900 min-h-screen">
        {/* Header with back button */}
        <div className="bg-gray-800 p-4 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('menu')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>←</span>
              <span>Volver</span>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{functions.find(f => f.id === currentView)?.icon}</span>
              <h1 className="text-xl font-bold text-white">
                {functions.find(f => f.id === currentView)?.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Function content */}
        <div className="p-6">
          {renderCurrentView()}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">⚡ Centro de Funciones</h1>
          <p className="text-gray-400">Accede a todas las funciones avanzadas del ecosistema</p>
          <div className="mt-4 bg-gray-800 p-4 rounded-lg inline-block">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{gameState.level}</div>
                <div className="text-sm text-gray-300">Nivel</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{gameState.xp}</div>
                <div className="text-sm text-gray-300">XP Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{gameState.achievements.length}</div>
                <div className="text-sm text-gray-300">Logros</div>
              </div>
            </div>
          </div>
        </div>

        {/* Functions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {functions.map((func) => (
            <div
              key={func.id}
              onClick={() => handleFunctionSelect(func.id, func.xp)}
              className={`${func.color} p-6 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 transform`}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{func.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{func.name}</h3>
                <p className="text-gray-200 text-sm mb-4">{func.description}</p>
                {func.xp > 0 && (
                  <div className="bg-white/20 rounded-full px-3 py-1 text-sm font-bold text-white">
                    +{func.xp} XP
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400">{functions.length}</div>
            <div className="text-sm text-gray-300">Funciones</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">
              {functions.filter(f => f.xp > 0).reduce((sum, f) => sum + f.xp, 0)}
            </div>
            <div className="text-sm text-gray-300">XP Disponible</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-400">6</div>
            <div className="text-sm text-gray-300">Categorías</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-400">100%</div>
            <div className="text-sm text-gray-300">Disponible</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-white mb-4">💡 Instrucciones</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <h4 className="font-bold text-white mb-2">🎯 Aproximación Inteligente</h4>
              <p>Predice puntos de acceso basado en tu movimiento y historial de ubicaciones.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">📡 Seguimiento Tiempo Real</h4>
              <p>Trackea servicios activos con estimaciones de tiempo precisas.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">🌐 Escáner de Redes</h4>
              <p>Encuentra y conecta a puntos de acceso WiFi, cellular y bluetooth.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">📊 Análisis Tiempo Real</h4>
              <p>Monitorea datos ambientales, vehículo y factores de riesgo.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunctionAccessPanel;