import React, { useState } from 'react';
import { useGameification } from '../hooks/useGameification';

interface FeatureModule {
  id: string;
  name: string;
  icon: string;
  description: string;
  status: 'active' | 'beta' | 'coming_soon';
  category: 'core' | 'premium' | 'experimental';
  xp: number;
}

const IntegratedFeatures: React.FC = () => {
  const { actions } = useGameification();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'premium' | 'experimental'>('all');

  const features: FeatureModule[] = [
    {
      id: 'sos',
      name: 'SOS Emergencia',
      icon: '🚨',
      description: 'Sistema de emergencia con GPS automático y contactos',
      status: 'active',
      category: 'core',
      xp: 0
    },
    {
      id: 'tracking',
      name: 'Tracking Tiempo Real',
      icon: '📡',
      description: 'Seguimiento de servicios con estimaciones precisas',
      status: 'active',
      category: 'premium',
      xp: 25
    },
    {
      id: 'approximation',
      name: 'Aproximación Inteligente',
      icon: '🎯',
      description: 'Predicción de puntos de acceso por comportamiento',
      status: 'active',
      category: 'premium',
      xp: 30
    },
    {
      id: 'analytics',
      name: 'Análisis Tiempo Real',
      icon: '📊',
      description: 'Métricas ambientales y factores de riesgo',
      status: 'active',
      category: 'premium',
      xp: 40
    },
    {
      id: 'networks',
      name: 'Escáner de Redes',
      icon: '🌐',
      description: 'WiFi, cellular y bluetooth disponibles',
      status: 'active',
      category: 'core',
      xp: 20
    },
    {
      id: 'gamification',
      name: 'Sistema de Gamificación',
      icon: '🎮',
      description: 'XP, logros, ranking y desafíos',
      status: 'active',
      category: 'core',
      xp: 0
    },
    {
      id: 'ai_assistant',
      name: 'Asistente IA',
      icon: '🤖',
      description: 'Chat contextual con Gemini AI',
      status: 'beta',
      category: 'premium',
      xp: 35
    },
    {
      id: 'voice_commands',
      name: 'Comandos de Voz',
      icon: '🎤',
      description: 'Control por voz para manos libres',
      status: 'beta',
      category: 'experimental',
      xp: 50
    },
    {
      id: 'ar_navigation',
      name: 'Navegación AR',
      icon: '🥽',
      description: 'Realidad aumentada para navegación',
      status: 'coming_soon',
      category: 'experimental',
      xp: 100
    },
    {
      id: 'predictive_maintenance',
      name: 'Mantenimiento Predictivo',
      icon: '🔮',
      description: 'IA predice fallas del vehículo',
      status: 'coming_soon',
      category: 'premium',
      xp: 75
    },
    {
      id: 'social_features',
      name: 'Funciones Sociales',
      icon: '👥',
      description: 'Compartir ubicación y formar grupos',
      status: 'beta',
      category: 'core',
      xp: 15
    },
    {
      id: 'offline_mode',
      name: 'Modo Offline',
      icon: '📴',
      description: 'Funcionalidad sin conexión a internet',
      status: 'coming_soon',
      category: 'premium',
      xp: 60
    }
  ];

  const categories = [
    { id: 'all', name: 'Todas', icon: '⚡' },
    { id: 'core', name: 'Básicas', icon: '🔧' },
    { id: 'premium', name: 'Premium', icon: '💎' },
    { id: 'experimental', name: 'Experimental', icon: '🧪' }
  ];

  const filteredFeatures = selectedCategory === 'all' 
    ? features 
    : features.filter(f => f.category === selectedCategory);

  const getStatusColor = (status: FeatureModule['status']) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'beta': return 'text-yellow-400';
      case 'coming_soon': return 'text-gray-400';
    }
  };

  const getStatusText = (status: FeatureModule['status']) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'beta': return 'Beta';
      case 'coming_soon': return 'Próximamente';
    }
  };

  const getCategoryColor = (category: FeatureModule['category']) => {
    switch (category) {
      case 'core': return 'bg-blue-600';
      case 'premium': return 'bg-purple-600';
      case 'experimental': return 'bg-orange-600';
    }
  };

  const handleFeatureActivate = (feature: FeatureModule) => {
    if (feature.status === 'active' && feature.xp > 0) {
      actions.addXP(feature.xp, `Activaste ${feature.name}`);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">⚡</span>
        <div>
          <h2 className="text-xl font-bold text-white">Funciones Integradas</h2>
          <p className="text-gray-400">Todas las características del ecosistema</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id as any)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
            <span className="bg-white/20 rounded-full px-2 py-1 text-xs">
              {category.id === 'all' ? features.length : features.filter(f => f.category === category.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredFeatures.map((feature) => (
          <div
            key={feature.id}
            className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <h3 className="font-bold text-white">{feature.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${getStatusColor(feature.status)}`}>
                      {getStatusText(feature.status)}
                    </span>
                    <span className={`${getCategoryColor(feature.category)} text-white text-xs px-2 py-1 rounded`}>
                      {feature.category.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              
              {feature.xp > 0 && (
                <div className="bg-yellow-600 text-white text-xs px-2 py-1 rounded">
                  +{feature.xp} XP
                </div>
              )}
            </div>

            <p className="text-gray-300 text-sm mb-4">{feature.description}</p>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400">
                {feature.status === 'active' ? '✅ Disponible' :
                 feature.status === 'beta' ? '🧪 En pruebas' :
                 '⏳ En desarrollo'}
              </div>
              
              {feature.status === 'active' && (
                <button
                  onClick={() => handleFeatureActivate(feature)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                >
                  Usar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-green-400">
            {features.filter(f => f.status === 'active').length}
          </div>
          <div className="text-sm text-gray-300">Activas</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {features.filter(f => f.status === 'beta').length}
          </div>
          <div className="text-sm text-gray-300">Beta</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-gray-400">
            {features.filter(f => f.status === 'coming_soon').length}
          </div>
          <div className="text-sm text-gray-300">Próximamente</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-purple-400">
            {features.filter(f => f.xp > 0).reduce((sum, f) => sum + f.xp, 0)}
          </div>
          <div className="text-sm text-gray-300">XP Total</div>
        </div>
      </div>

      {/* Roadmap */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="font-bold text-white mb-4">🗺️ Roadmap de Desarrollo</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-white font-bold">Q1 2025</span>
            <span className="text-gray-300">Comandos de Voz, Funciones Sociales</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-white font-bold">Q2 2025</span>
            <span className="text-gray-300">Modo Offline, Mantenimiento Predictivo</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-white font-bold">Q3 2025</span>
            <span className="text-gray-300">Navegación AR, Integración IoT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegratedFeatures;