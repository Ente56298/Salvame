import React, { useState, useEffect } from 'react';
import { useGameification } from '../hooks/useGameification';

interface EnvironmentalData {
  altitude: number; // msnm
  temperature: number; // °C
  humidity: number; // %
  pressure: number; // hPa
  visibility: number; // km
  windSpeed: number; // km/h
  windDirection: number; // degrees
}

interface VehicleMetrics {
  currentSpeed: number; // km/h
  maxSpeed: number; // km/h
  averageSpeed: number; // km/h
  acceleration: number; // m/s²
  braking: number; // m/s²
  fuelEfficiency: number; // km/l
  engineTemp: number; // °C
  rpm: number;
}

interface RiskFactors {
  speedRisk: number; // 0-100
  altitudeRisk: number; // 0-100
  weatherRisk: number; // 0-100
  trafficRisk: number; // 0-100
  mechanicalRisk: number; // 0-100
  overallRisk: number; // 0-100
}

const RealTimeAnalytics: React.FC = () => {
  const { actions } = useGameification();
  const [environmental, setEnvironmental] = useState<EnvironmentalData>({
    altitude: 2240, // CDMX altitude
    temperature: 22,
    humidity: 45,
    pressure: 1013,
    visibility: 15,
    windSpeed: 12,
    windDirection: 180
  });
  
  const [vehicle, setVehicle] = useState<VehicleMetrics>({
    currentSpeed: 0,
    maxSpeed: 0,
    averageSpeed: 0,
    acceleration: 0,
    braking: 0,
    fuelEfficiency: 12.5,
    engineTemp: 90,
    rpm: 800
  });
  
  const [risks, setRisks] = useState<RiskFactors>({
    speedRisk: 0,
    altitudeRisk: 0,
    weatherRisk: 0,
    trafficRisk: 0,
    mechanicalRisk: 0,
    overallRisk: 0
  });

  useEffect(() => {
    // Simular datos en tiempo real
    const interval = setInterval(() => {
      updateEnvironmentalData();
      updateVehicleMetrics();
      calculateRiskFactors();
    }, 2000);

    actions.addXP(40, 'Iniciaste análisis en tiempo real');
    return () => clearInterval(interval);
  }, [actions]);

  const updateEnvironmentalData = () => {
    setEnvironmental(prev => ({
      altitude: prev.altitude + (Math.random() - 0.5) * 10,
      temperature: Math.max(-5, Math.min(45, prev.temperature + (Math.random() - 0.5) * 2)),
      humidity: Math.max(10, Math.min(90, prev.humidity + (Math.random() - 0.5) * 5)),
      pressure: Math.max(950, Math.min(1050, prev.pressure + (Math.random() - 0.5) * 3)),
      visibility: Math.max(1, Math.min(50, prev.visibility + (Math.random() - 0.5) * 2)),
      windSpeed: Math.max(0, Math.min(80, prev.windSpeed + (Math.random() - 0.5) * 5)),
      windDirection: (prev.windDirection + (Math.random() - 0.5) * 20) % 360
    }));
  };

  const updateVehicleMetrics = () => {
    setVehicle(prev => {
      const newSpeed = Math.max(0, Math.min(120, prev.currentSpeed + (Math.random() - 0.5) * 15));
      const newAccel = (newSpeed - prev.currentSpeed) / 2; // m/s²
      const newMaxSpeed = Math.max(prev.maxSpeed, newSpeed);
      const newAvgSpeed = (prev.averageSpeed * 0.9) + (newSpeed * 0.1);
      
      return {
        currentSpeed: newSpeed,
        maxSpeed: newMaxSpeed,
        averageSpeed: newAvgSpeed,
        acceleration: newAccel,
        braking: newAccel < -1 ? Math.abs(newAccel) : 0,
        fuelEfficiency: Math.max(5, Math.min(25, prev.fuelEfficiency + (Math.random() - 0.5) * 0.5)),
        engineTemp: Math.max(60, Math.min(120, prev.engineTemp + (Math.random() - 0.5) * 3)),
        rpm: Math.max(600, Math.min(6000, 800 + (newSpeed * 40)))
      };
    });
  };

  const calculateRiskFactors = () => {
    setRisks(prev => {
      // Speed Risk (0-100)
      const speedRisk = vehicle.currentSpeed > 80 ? 
        Math.min(100, (vehicle.currentSpeed - 80) * 2.5) : 0;
      
      // Altitude Risk (0-100) - Higher altitude = more risk
      const altitudeRisk = environmental.altitude > 2500 ? 
        Math.min(100, (environmental.altitude - 2500) / 20) : 0;
      
      // Weather Risk (0-100)
      const weatherRisk = Math.max(
        environmental.visibility < 5 ? (5 - environmental.visibility) * 20 : 0,
        environmental.windSpeed > 40 ? (environmental.windSpeed - 40) * 2 : 0,
        environmental.temperature < 0 || environmental.temperature > 35 ? 30 : 0
      );
      
      // Traffic Risk (simulated 0-100)
      const trafficRisk = Math.random() * 60;
      
      // Mechanical Risk (0-100)
      const mechanicalRisk = Math.max(
        vehicle.engineTemp > 100 ? (vehicle.engineTemp - 100) * 5 : 0,
        vehicle.fuelEfficiency < 8 ? (8 - vehicle.fuelEfficiency) * 10 : 0
      );
      
      // Overall Risk (weighted average)
      const overallRisk = (speedRisk * 0.3 + altitudeRisk * 0.1 + weatherRisk * 0.25 + 
                          trafficRisk * 0.2 + mechanicalRisk * 0.15);
      
      return {
        speedRisk,
        altitudeRisk,
        weatherRisk,
        trafficRisk,
        mechanicalRisk,
        overallRisk
      };
    });
  };

  const getRiskColor = (risk: number) => {
    if (risk < 20) return 'text-green-400';
    if (risk < 40) return 'text-yellow-400';
    if (risk < 70) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRiskLevel = (risk: number) => {
    if (risk < 20) return 'BAJO';
    if (risk < 40) return 'MODERADO';
    if (risk < 70) return 'ALTO';
    return 'CRÍTICO';
  };

  const getSpeedColor = (speed: number) => {
    if (speed < 30) return 'text-green-400';
    if (speed < 60) return 'text-yellow-400';
    if (speed < 90) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">📊</span>
        <div>
          <h2 className="text-xl font-bold text-white">Análisis en Tiempo Real</h2>
          <p className="text-gray-400">Datos ambientales, vehículo y factores de riesgo</p>
        </div>
      </div>

      {/* Environmental Data */}
      <div className="mb-6 bg-gradient-to-r from-blue-900/30 to-green-900/30 border border-blue-500/30 p-4 rounded-lg">
        <h3 className="font-bold text-white mb-4">🌍 Datos Ambientales</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{environmental.altitude.toFixed(0)}</div>
            <div className="text-sm text-gray-300">msnm</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{environmental.temperature.toFixed(1)}°</div>
            <div className="text-sm text-gray-300">Temperatura</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{environmental.humidity.toFixed(0)}%</div>
            <div className="text-sm text-gray-300">Humedad</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{environmental.visibility.toFixed(1)}</div>
            <div className="text-sm text-gray-300">Visibilidad km</div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-300">{environmental.pressure.toFixed(0)}</div>
            <div className="text-xs text-gray-400">Presión hPa</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-300">{environmental.windSpeed.toFixed(1)}</div>
            <div className="text-xs text-gray-400">Viento km/h</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-300">{environmental.windDirection.toFixed(0)}°</div>
            <div className="text-xs text-gray-400">Dir. Viento</div>
          </div>
        </div>
      </div>

      {/* Vehicle Metrics */}
      <div className="mb-6 bg-gradient-to-r from-red-900/30 to-yellow-900/30 border border-red-500/30 p-4 rounded-lg">
        <h3 className="font-bold text-white mb-4">🚗 Métricas del Vehículo</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getSpeedColor(vehicle.currentSpeed)}`}>
              {vehicle.currentSpeed.toFixed(0)}
            </div>
            <div className="text-sm text-gray-300">km/h Actual</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{vehicle.maxSpeed.toFixed(0)}</div>
            <div className="text-sm text-gray-300">km/h Máxima</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{vehicle.averageSpeed.toFixed(1)}</div>
            <div className="text-sm text-gray-300">km/h Promedio</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${vehicle.acceleration >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {vehicle.acceleration > 0 ? '+' : ''}{vehicle.acceleration.toFixed(1)}
            </div>
            <div className="text-sm text-gray-300">m/s² Aceleración</div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-xl font-bold text-green-400">{vehicle.fuelEfficiency.toFixed(1)}</div>
            <div className="text-xs text-gray-400">km/l Eficiencia</div>
          </div>
          <div className="text-center">
            <div className={`text-xl font-bold ${vehicle.engineTemp > 100 ? 'text-red-400' : 'text-green-400'}`}>
              {vehicle.engineTemp.toFixed(0)}°
            </div>
            <div className="text-xs text-gray-400">Temp Motor</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-400">{vehicle.rpm.toFixed(0)}</div>
            <div className="text-xs text-gray-400">RPM</div>
          </div>
          <div className="text-center">
            <div className={`text-xl font-bold ${vehicle.braking > 0 ? 'text-red-400' : 'text-gray-400'}`}>
              {vehicle.braking.toFixed(1)}
            </div>
            <div className="text-xs text-gray-400">Frenado m/s²</div>
          </div>
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="mb-6 bg-gradient-to-r from-purple-900/30 to-red-900/30 border border-purple-500/30 p-4 rounded-lg">
        <h3 className="font-bold text-white mb-4">⚠️ Análisis de Riesgos</h3>
        
        {/* Overall Risk */}
        <div className="mb-4 text-center">
          <div className={`text-4xl font-bold ${getRiskColor(risks.overallRisk)}`}>
            {risks.overallRisk.toFixed(0)}%
          </div>
          <div className={`text-lg font-bold ${getRiskColor(risks.overallRisk)}`}>
            RIESGO {getRiskLevel(risks.overallRisk)}
          </div>
          <div className="bg-gray-600 rounded-full h-3 mt-2">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${
                risks.overallRisk < 20 ? 'bg-green-500' :
                risks.overallRisk < 40 ? 'bg-yellow-500' :
                risks.overallRisk < 70 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${risks.overallRisk}%` }}
            />
          </div>
        </div>

        {/* Individual Risk Factors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-700 p-3 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">🏎️ Velocidad</span>
              <span className={`font-bold ${getRiskColor(risks.speedRisk)}`}>
                {risks.speedRisk.toFixed(0)}%
              </span>
            </div>
            <div className="bg-gray-600 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  risks.speedRisk < 20 ? 'bg-green-500' :
                  risks.speedRisk < 40 ? 'bg-yellow-500' :
                  risks.speedRisk < 70 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${risks.speedRisk}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-700 p-3 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">⛰️ Altitud</span>
              <span className={`font-bold ${getRiskColor(risks.altitudeRisk)}`}>
                {risks.altitudeRisk.toFixed(0)}%
              </span>
            </div>
            <div className="bg-gray-600 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  risks.altitudeRisk < 20 ? 'bg-green-500' :
                  risks.altitudeRisk < 40 ? 'bg-yellow-500' :
                  risks.altitudeRisk < 70 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${risks.altitudeRisk}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-700 p-3 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">🌤️ Clima</span>
              <span className={`font-bold ${getRiskColor(risks.weatherRisk)}`}>
                {risks.weatherRisk.toFixed(0)}%
              </span>
            </div>
            <div className="bg-gray-600 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  risks.weatherRisk < 20 ? 'bg-green-500' :
                  risks.weatherRisk < 40 ? 'bg-yellow-500' :
                  risks.weatherRisk < 70 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${risks.weatherRisk}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-700 p-3 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">🚦 Tráfico</span>
              <span className={`font-bold ${getRiskColor(risks.trafficRisk)}`}>
                {risks.trafficRisk.toFixed(0)}%
              </span>
            </div>
            <div className="bg-gray-600 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  risks.trafficRisk < 20 ? 'bg-green-500' :
                  risks.trafficRisk < 40 ? 'bg-yellow-500' :
                  risks.trafficRisk < 70 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${risks.trafficRisk}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-700 p-3 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">🔧 Mecánico</span>
              <span className={`font-bold ${getRiskColor(risks.mechanicalRisk)}`}>
                {risks.mechanicalRisk.toFixed(0)}%
              </span>
            </div>
            <div className="bg-gray-600 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  risks.mechanicalRisk < 20 ? 'bg-green-500' :
                  risks.mechanicalRisk < 40 ? 'bg-yellow-500' :
                  risks.mechanicalRisk < 70 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${risks.mechanicalRisk}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-blue-400">{environmental.altitude.toFixed(0)}</div>
          <div className="text-sm text-gray-300">msnm</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className={`text-2xl font-bold ${getSpeedColor(vehicle.maxSpeed)}`}>
            {vehicle.maxSpeed.toFixed(0)}
          </div>
          <div className="text-sm text-gray-300">Máx km/h</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className={`text-2xl font-bold ${getRiskColor(risks.overallRisk)}`}>
            {getRiskLevel(risks.overallRisk)}
          </div>
          <div className="text-sm text-gray-300">Riesgo</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-green-400">{vehicle.fuelEfficiency.toFixed(1)}</div>
          <div className="text-sm text-gray-300">km/l</div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeAnalytics;