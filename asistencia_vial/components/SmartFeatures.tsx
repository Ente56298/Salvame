import React, { useState, useEffect } from 'react';
import { useGameification } from '../hooks/useGameification';

interface SmartFeature {
  id: string;
  name: string;
  icon: string;
  description: string;
  aiPowered: boolean;
  status: 'learning' | 'active' | 'optimizing';
  accuracy: number;
  usageCount: number;
}

const SmartFeatures: React.FC = () => {
  const { actions } = useGameification();
  const [features, setFeatures] = useState<SmartFeature[]>([
    {
      id: 'predictive_maintenance',
      name: 'Mantenimiento Predictivo',
      icon: '🔧',
      description: 'Predice cuándo necesitas servicio',
      aiPowered: true,
      status: 'learning',
      accuracy: 78,
      usageCount: 0
    },
    {
      id: 'smart_routing',
      name: 'Rutas Inteligentes',
      icon: '🧠',
      description: 'Aprende tus patrones de manejo',
      aiPowered: true,
      status: 'active',
      accuracy: 92,
      usageCount: 0
    },
    {
      id: 'behavior_analysis',
      name: 'Análisis de Conducción',
      icon: '📊',
      description: 'Evalúa tu estilo de manejo',
      aiPowered: true,
      status: 'optimizing',
      accuracy: 85,
      usageCount: 0
    },
    {
      id: 'fuel_optimizer',
      name: 'Optimizador de Combustible',
      icon: '⛽',
      description: 'Encuentra las gasolineras más baratas',
      aiPowered: false,
      status: 'active',
      accuracy: 95,
      usageCount: 0
    },
    {
      id: 'weather_predictor',
      name: 'Predictor Climático',
      icon: '🌤️',
      description: 'Anticipa condiciones de manejo',
      aiPowered: true,
      status: 'active',
      accuracy: 88,
      usageCount: 0
    },
    {
      id: 'parking_finder',
      name: 'Buscador de Estacionamiento',
      icon: '🅿️',
      description: 'Encuentra espacios disponibles',
      aiPowered: true,
      status: 'learning',
      accuracy: 72,
      usageCount: 0
    }
  ]);

  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  useEffect(() => {
    // Simular mejora de precisión con el tiempo
    const interval = setInterval(() => {
      setFeatures(prev => prev.map(feature => ({
        ...feature,
        accuracy: Math.min(99, feature.accuracy + Math.random() * 0.5),
        usageCount: feature.usageCount + Math.floor(Math.random() * 3)
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleFeatureClick = (feature: SmartFeature) => {
    setSelectedFeature(feature.id);
    
    // Simular uso de la función
    setFeatures(prev => prev.map(f => 
      f.id === feature.id 
        ? { ...f, usageCount: f.usageCount + 1 }
        : f
    ));

    // Dar XP basado en la función
    const xpReward = feature.aiPowered ? 40 : 25;
    actions.addXP(xpReward, `Usaste ${feature.name}`);

    // Simular funcionalidad específica
    switch (feature.id) {
      case 'predictive_maintenance':
        alert('🔧 Tu auto necesitará servicio en ~2,500 km basado en tu uso');
        break;
      case 'smart_routing':
        alert('🧠 Ruta optimizada: 15% más rápida que la ruta normal');
        break;
      case 'behavior_analysis':
        alert('📊 Puntuación de conducción: 8.5/10 - Excelente manejo');
        break;
      case 'fuel_optimizer':
        alert('⛽ Gasolinera más barata: $22.50/L a 800m');
        break;
      case 'weather_predictor':
        alert('🌤️ Lluvia ligera en 2 horas - Conduce con precaución');
        break;
      case 'parking_finder':
        alert('🅿️ 3 espacios disponibles en Plaza Central');
        break;
    }

    setTimeout(() => setSelectedFeature(null), 2000);
  };

  const getStatusColor = (status: SmartFeature['status']) => {
    switch (status) {
      case 'learning': return 'text-yellow-400';
      case 'active': return 'text-green-400';
      case 'optimizing': return 'text-blue-400';
    }
  };

  const getStatusIcon = (status: SmartFeature['status']) => {
    switch (status) {
      case 'learning': return '🧠';
      case 'active': return '✅';
      case 'optimizing': return '⚡';
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-400';
    if (accuracy >= 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🤖</span>
        <div>
          <h2 className="text-xl font-bold text-white">Funciones Inteligentes</h2>
          <p className="text-gray-400">IA que aprende de tu comportamiento</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map(feature => (
          <div
            key={feature.id}
            onClick={() => handleFeatureClick(feature)}
            className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
              selectedFeature === feature.id
                ? 'bg-blue-600/30 border-blue-500/50 scale-105'
                : 'bg-gray-700 border-gray-600 hover:border-gray-500'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="text-3xl">{feature.icon}</div>
              <div className="flex items-center gap-1">
                {feature.aiPowered && <span className="text-purple-400">🧠</span>}
                <span className={getStatusColor(feature.status)}>
                  {getStatusIcon(feature.status)}
                </span>
              </div>
            </div>
            
            <h3 className="font-bold text-white mb-2">{feature.name}</h3>
            <p className="text-sm text-gray-300 mb-3">{feature.description}</p>
            
            {/* Accuracy Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Precisión</span>
                <span className={getAccuracyColor(feature.accuracy)}>
                  {feature.accuracy.toFixed(1)}%
                </span>
              </div>
              <div className="bg-gray-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    feature.accuracy >= 90 ? 'bg-green-500' :
                    feature.accuracy >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${feature.accuracy}%` }}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Usos: {feature.usageCount}</span>
              <span className="text-yellow-400 font-bold">
                +{feature.aiPowered ? 40 : 25} XP
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Learning Progress */}
      <div className="mt-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🧠</span>
          <h3 className="font-bold text-white">Estado del Aprendizaje IA</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {features.filter(f => f.aiPowered).length}
            </div>
            <div className="text-sm text-gray-300">Funciones IA</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {(features.reduce((sum, f) => sum + f.accuracy, 0) / features.length).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-300">Precisión Promedio</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {features.reduce((sum, f) => sum + f.usageCount, 0)}
            </div>
            <div className="text-sm text-gray-300">Usos Totales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {features.filter(f => f.status === 'active').length}
            </div>
            <div className="text-sm text-gray-300">Activas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartFeatures;