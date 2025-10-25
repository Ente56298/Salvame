import React, { useState, useEffect } from 'react';
import { useGameification } from '../hooks/useGameification';

interface MaintenanceAlert {
  id: string;
  component: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  prediction: string;
  daysLeft: number;
  confidence: number;
  symptoms: string[];
  recommendation: string;
}

interface VehicleHealth {
  overall: number;
  engine: number;
  brakes: number;
  transmission: number;
  battery: number;
  tires: number;
}

const PredictiveMaintenance: React.FC = () => {
  const { actions } = useGameification();
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>([]);
  const [vehicleHealth, setVehicleHealth] = useState<VehicleHealth>({
    overall: 85,
    engine: 92,
    brakes: 78,
    transmission: 88,
    battery: 65,
    tires: 82
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    generatePredictions();
  }, []);

  const generatePredictions = () => {
    setIsAnalyzing(true);
    actions.addXP(40, 'Iniciaste análisis predictivo');

    setTimeout(() => {
      const mockAlerts: MaintenanceAlert[] = [
        {
          id: '1',
          component: 'Batería',
          severity: 'high',
          prediction: 'Falla probable en 15-20 días',
          daysLeft: 18,
          confidence: 87,
          symptoms: ['Arranque lento', 'Luces tenues', 'Voltaje bajo'],
          recommendation: 'Reemplazar batería antes de 2 semanas'
        },
        {
          id: '2',
          component: 'Pastillas de freno',
          severity: 'medium',
          prediction: 'Desgaste avanzado detectado',
          daysLeft: 45,
          confidence: 73,
          symptoms: ['Ruido al frenar', 'Vibración en pedal', 'Mayor distancia de frenado'],
          recommendation: 'Inspección en taller especializado'
        },
        {
          id: '3',
          component: 'Filtro de aire',
          severity: 'low',
          prediction: 'Mantenimiento preventivo recomendado',
          daysLeft: 90,
          confidence: 65,
          symptoms: ['Reducción en rendimiento', 'Mayor consumo combustible'],
          recommendation: 'Cambio en próximo servicio'
        },
        {
          id: '4',
          component: 'Aceite de motor',
          severity: 'critical',
          prediction: 'Cambio urgente requerido',
          daysLeft: 7,
          confidence: 95,
          symptoms: ['Color oscuro', 'Viscosidad alta', 'Kilometraje excedido'],
          recommendation: 'Cambio inmediato - No diferir'
        }
      ];

      setAlerts(mockAlerts);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getSeverityColor = (severity: MaintenanceAlert['severity']) => {
    switch (severity) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
    }
  };

  const getSeverityBg = (severity: MaintenanceAlert['severity']) => {
    switch (severity) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
    }
  };

  const getSeverityIcon = (severity: MaintenanceAlert['severity']) => {
    switch (severity) {
      case 'low': return '💚';
      case 'medium': return '💛';
      case 'high': return '🧡';
      case 'critical': return '❤️';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-400';
    if (health >= 60) return 'text-yellow-400';
    if (health >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getHealthBg = (health: number) => {
    if (health >= 80) return 'bg-green-500';
    if (health >= 60) return 'bg-yellow-500';
    if (health >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🔮</span>
        <div>
          <h2 className="text-xl font-bold text-white">Mantenimiento Predictivo</h2>
          <p className="text-gray-400">IA predice fallas del vehículo</p>
        </div>
      </div>

      {/* Analysis Status */}
      {isAnalyzing && (
        <div className="mb-6 bg-blue-900/30 border border-blue-500/30 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"></div>
            <div>
              <h3 className="font-bold text-white">🔍 Analizando Vehículo</h3>
              <p className="text-blue-300 text-sm">Procesando datos de sensores y patrones de uso...</p>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Health Overview */}
      <div className="mb-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 p-4 rounded-lg">
        <h3 className="font-bold text-white mb-4">🚗 Estado General del Vehículo</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getHealthColor(vehicleHealth.overall)}`}>
              {vehicleHealth.overall}%
            </div>
            <div className="text-sm text-gray-300">General</div>
            <div className="bg-gray-600 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${getHealthBg(vehicleHealth.overall)}`}
                style={{ width: `${vehicleHealth.overall}%` }}
              />
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${getHealthColor(vehicleHealth.engine)}`}>
              {vehicleHealth.engine}%
            </div>
            <div className="text-sm text-gray-300">Motor</div>
            <div className="bg-gray-600 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${getHealthBg(vehicleHealth.engine)}`}
                style={{ width: `${vehicleHealth.engine}%` }}
              />
            </div>
          </div>

          <div className="text-center">
            <div className={`text-2xl font-bold ${getHealthColor(vehicleHealth.brakes)}`}>
              {vehicleHealth.brakes}%
            </div>
            <div className="text-sm text-gray-300">Frenos</div>
            <div className="bg-gray-600 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${getHealthBg(vehicleHealth.brakes)}`}
                style={{ width: `${vehicleHealth.brakes}%` }}
              />
            </div>
          </div>

          <div className="text-center">
            <div className={`text-2xl font-bold ${getHealthColor(vehicleHealth.transmission)}`}>
              {vehicleHealth.transmission}%
            </div>
            <div className="text-sm text-gray-300">Transmisión</div>
            <div className="bg-gray-600 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${getHealthBg(vehicleHealth.transmission)}`}
                style={{ width: `${vehicleHealth.transmission}%` }}
              />
            </div>
          </div>

          <div className="text-center">
            <div className={`text-2xl font-bold ${getHealthColor(vehicleHealth.battery)}`}>
              {vehicleHealth.battery}%
            </div>
            <div className="text-sm text-gray-300">Batería</div>
            <div className="bg-gray-600 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${getHealthBg(vehicleHealth.battery)}`}
                style={{ width: `${vehicleHealth.battery}%` }}
              />
            </div>
          </div>

          <div className="text-center">
            <div className={`text-2xl font-bold ${getHealthColor(vehicleHealth.tires)}`}>
              {vehicleHealth.tires}%
            </div>
            <div className="text-sm text-gray-300">Llantas</div>
            <div className="bg-gray-600 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${getHealthBg(vehicleHealth.tires)}`}
                style={{ width: `${vehicleHealth.tires}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Alerts */}
      <div className="space-y-4 mb-6">
        <h3 className="font-bold text-white mb-4">⚠️ Alertas de Mantenimiento</h3>
        
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getSeverityIcon(alert.severity)}</span>
                <div>
                  <h4 className="font-bold text-white">{alert.component}</h4>
                  <div className="text-sm text-gray-400">{alert.prediction}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-xl font-bold ${getSeverityColor(alert.severity)}`}>
                  {alert.daysLeft} días
                </div>
                <div className="text-sm text-gray-400">{alert.confidence}% confianza</div>
              </div>
            </div>

            {/* Severity Bar */}
            <div className="mb-4">
              <div className="bg-gray-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getSeverityBg(alert.severity)}`}
                  style={{ width: `${alert.confidence}%` }}
                />
              </div>
            </div>

            {/* Symptoms */}
            <div className="mb-3">
              <h5 className="font-bold text-white text-sm mb-2">🔍 Síntomas Detectados:</h5>
              <div className="flex flex-wrap gap-2">
                {alert.symptoms.map((symptom, index) => (
                  <span key={index} className="bg-gray-600 text-gray-200 text-xs px-2 py-1 rounded">
                    {symptom}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-gray-600 p-3 rounded">
              <h5 className="font-bold text-white text-sm mb-1">💡 Recomendación:</h5>
              <p className="text-gray-200 text-sm">{alert.recommendation}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Predictive Analytics */}
      <div className="mb-6 bg-gray-700 p-4 rounded-lg">
        <h3 className="font-bold text-white mb-3">🤖 Análisis Predictivo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <h4 className="font-bold text-white mb-2">📊 Datos Analizados</h4>
            <ul className="space-y-1">
              <li>• Kilometraje y patrones de uso</li>
              <li>• Historial de mantenimiento</li>
              <li>• Condiciones de manejo</li>
              <li>• Datos de sensores OBD2</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">🎯 Precisión del Sistema</h4>
            <ul className="space-y-1">
              <li>• Predicciones &gt;90%: 92% precisión</li>
              <li>• Predicciones &gt;70%: 85% precisión</li>
              <li>• Falsos positivos: &lt;8%</li>
              <li>• Actualización: Cada 100 km</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={generatePredictions}
          disabled={isAnalyzing}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span>🔄</span>
          <span>{isAnalyzing ? 'Analizando...' : 'Actualizar Análisis'}</span>
        </button>
        
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <span>📅</span>
          <span>Programar Mantenimiento</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-red-400">
            {alerts.filter(a => a.severity === 'critical').length}
          </div>
          <div className="text-sm text-gray-300">Críticas</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-orange-400">
            {alerts.filter(a => a.severity === 'high').length}
          </div>
          <div className="text-sm text-gray-300">Altas</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-blue-400">
            {Math.min(...alerts.map(a => a.daysLeft))}
          </div>
          <div className="text-sm text-gray-300">Días mín.</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-green-400">
            {vehicleHealth.overall}%
          </div>
          <div className="text-sm text-gray-300">Salud</div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveMaintenance;