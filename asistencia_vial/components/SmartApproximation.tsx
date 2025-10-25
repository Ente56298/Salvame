import React, { useState, useEffect } from 'react';
import { useGameification } from '../hooks/useGameification';

interface AccessPoint {
  id: string;
  name: string;
  type: 'taller' | 'gasolinera' | 'hospital' | 'policia';
  probability: number; // 0-100
  distance: number; // km
  estimatedTime: number; // minutes
  reasons: string[];
  location: { lat: number; lng: number };
}

interface MovementPattern {
  direction: string;
  speed: number; // km/h
  consistency: number; // 0-100
  timeOfDay: string;
}

const SmartApproximation: React.FC = () => {
  const { actions } = useGameification();
  const [predictions, setPredictions] = useState<AccessPoint[]>([]);
  const [movement, setMovement] = useState<MovementPattern | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    startAnalysis();
  }, []);

  const startAnalysis = () => {
    setIsAnalyzing(true);
    actions.addXP(30, 'Iniciaste aproximación inteligente');

    // Simular análisis de movimiento
    setTimeout(() => {
      const mockMovement: MovementPattern = {
        direction: 'Norte-Este',
        speed: 45,
        consistency: 78,
        timeOfDay: 'Tarde'
      };

      const mockPredictions: AccessPoint[] = [
        {
          id: '1',
          name: 'Taller Mecánico San Juan',
          type: 'taller',
          probability: 85,
          distance: 2.1,
          estimatedTime: 6,
          reasons: [
            'Patrón de movimiento hacia zona industrial',
            'Historial de visitas a talleres',
            'Hora típica de servicios mecánicos'
          ],
          location: { lat: 19.4326, lng: -99.1332 }
        },
        {
          id: '2',
          name: 'Gasolinera Pemex Insurgentes',
          type: 'gasolinera',
          probability: 72,
          distance: 1.5,
          estimatedTime: 4,
          reasons: [
            'Ruta frecuente detectada',
            'Nivel de combustible estimado bajo',
            'Patrón de reabastecimiento semanal'
          ],
          location: { lat: 19.4350, lng: -99.1300 }
        },
        {
          id: '3',
          name: 'Hospital General',
          type: 'hospital',
          probability: 45,
          distance: 3.2,
          estimatedTime: 12,
          reasons: [
            'Dirección hacia zona médica',
            'Velocidad reducida detectada',
            'Patrón de emergencia posible'
          ],
          location: { lat: 19.4280, lng: -99.1380 }
        },
        {
          id: '4',
          name: 'Estación de Policía',
          type: 'policia',
          probability: 28,
          distance: 4.1,
          estimatedTime: 15,
          reasons: [
            'Ruta hacia centro administrativo',
            'Horario de atención activo'
          ],
          location: { lat: 19.4400, lng: -99.1250 }
        }
      ];

      setMovement(mockMovement);
      setPredictions(mockPredictions);
      setIsAnalyzing(false);
    }, 4000);
  };

  const getTypeIcon = (type: AccessPoint['type']) => {
    switch (type) {
      case 'taller': return '🔧';
      case 'gasolinera': return '⛽';
      case 'hospital': return '🏥';
      case 'policia': return '👮';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'text-green-400';
    if (probability >= 50) return 'text-yellow-400';
    if (probability >= 30) return 'text-orange-400';
    return 'text-red-400';
  };

  const getProbabilityBg = (probability: number) => {
    if (probability >= 70) return 'bg-green-500';
    if (probability >= 50) return 'bg-yellow-500';
    if (probability >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🎯</span>
        <div>
          <h2 className="text-xl font-bold text-white">Aproximación Inteligente</h2>
          <p className="text-gray-400">Predicción por movimiento y puntos de acceso</p>
        </div>
      </div>

      {/* Analysis Status */}
      {isAnalyzing && (
        <div className="mb-6 bg-blue-900/30 border border-blue-500/30 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"></div>
            <div>
              <h3 className="font-bold text-white">🧠 Analizando Patrones</h3>
              <p className="text-blue-300 text-sm">Procesando movimiento, historial y contexto...</p>
            </div>
          </div>
        </div>
      )}

      {/* Movement Analysis */}
      {movement && (
        <div className="mb-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 p-4 rounded-lg">
          <h3 className="font-bold text-white mb-4">📊 Análisis de Movimiento</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{movement.direction}</div>
              <div className="text-sm text-gray-300">Dirección</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{movement.speed} km/h</div>
              <div className="text-sm text-gray-300">Velocidad</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{movement.consistency}%</div>
              <div className="text-sm text-gray-300">Consistencia</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{movement.timeOfDay}</div>
              <div className="text-sm text-gray-300">Momento</div>
            </div>
          </div>
        </div>
      )}

      {/* Predictions */}
      <div className="space-y-4">
        <h3 className="font-bold text-white mb-4">🎯 Predicciones de Destino</h3>
        
        {predictions.map((prediction) => (
          <div key={prediction.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getTypeIcon(prediction.type)}</span>
                <div>
                  <h4 className="font-bold text-white">{prediction.name}</h4>
                  <div className="text-sm text-gray-400">
                    {prediction.distance.toFixed(1)} km • {prediction.estimatedTime} min
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-2xl font-bold ${getProbabilityColor(prediction.probability)}`}>
                  {prediction.probability}%
                </div>
                <div className="text-sm text-gray-400">Probabilidad</div>
              </div>
            </div>

            {/* Probability Bar */}
            <div className="mb-4">
              <div className="bg-gray-600 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${getProbabilityBg(prediction.probability)}`}
                  style={{ width: `${prediction.probability}%` }}
                />
              </div>
            </div>

            {/* Reasons */}
            <div className="mb-3">
              <h5 className="font-bold text-white text-sm mb-2">🧠 Razones del Análisis:</h5>
              <ul className="space-y-1">
                {prediction.reasons.map((reason, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400">
                Confianza: {prediction.probability >= 70 ? 'Alta' : 
                           prediction.probability >= 50 ? 'Media' : 'Baja'}
              </div>
              
              {prediction.probability >= 50 && (
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm">
                  Navegar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Algorithm Info */}
      <div className="mt-6 bg-gray-700 p-4 rounded-lg">
        <h3 className="font-bold text-white mb-3">🤖 Algoritmo de Predicción</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <h4 className="font-bold text-white mb-2">📍 Factores Analizados</h4>
            <ul className="space-y-1">
              <li>• Patrón de movimiento actual</li>
              <li>• Historial de ubicaciones</li>
              <li>• Hora del día y día de semana</li>
              <li>• Velocidad y dirección</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">🎯 Precisión del Sistema</h4>
            <ul className="space-y-1">
              <li>• Predicciones &gt;70%: 85% precisión</li>
              <li>• Predicciones &gt;50%: 72% precisión</li>
              <li>• Mejora con más datos</li>
              <li>• Actualización cada 30 segundos</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-green-400">
            {predictions.filter(p => p.probability >= 70).length}
          </div>
          <div className="text-sm text-gray-300">Alta Confianza</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {predictions.filter(p => p.probability >= 50 && p.probability < 70).length}
          </div>
          <div className="text-sm text-gray-300">Media Confianza</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-blue-400">
            {predictions.length > 0 ? Math.min(...predictions.map(p => p.estimatedTime)) : 0}
          </div>
          <div className="text-sm text-gray-300">Min ETA</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-purple-400">
            {movement?.consistency || 0}%
          </div>
          <div className="text-sm text-gray-300">Consistencia</div>
        </div>
      </div>
    </div>
  );
};

export default SmartApproximation;