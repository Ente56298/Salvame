import React, { useState, useEffect } from 'react';

interface KPIData {
  users: number;
  partners: number;
  revenue: number;
  costs: number;
  roi: number;
  phase: string;
}

const KPIDashboard: React.FC = () => {
  const [data, setData] = useState<KPIData>({
    users: 0,
    partners: 0,
    revenue: 0,
    costs: 21500,
    roi: 0,
    phase: 'MVP'
  });

  const [scenario, setScenario] = useState<'conservative' | 'realistic' | 'optimistic'>('realistic');

  useEffect(() => {
    simulateKPIs();
  }, [scenario]);

  const simulateKPIs = () => {
    const multipliers = {
      conservative: 0.7,
      realistic: 1.0,
      optimistic: 1.5
    };

    const baseData = {
      users: 10000,
      partners: 300,
      revenue: 45000,
      costs: 21500
    };

    const multiplier = multipliers[scenario];
    const newData = {
      ...baseData,
      users: Math.round(baseData.users * multiplier),
      partners: Math.round(baseData.partners * multiplier),
      revenue: Math.round(baseData.revenue * multiplier),
      costs: baseData.costs,
      roi: ((baseData.revenue * multiplier - baseData.costs) / baseData.costs * 100),
      phase: 'Lanzamiento Público'
    };

    setData(newData);
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD' }).format(amount);

  const getROIColor = (roi: number) => {
    if (roi > 50) return 'text-green-600';
    if (roi > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Asistente Vial México</h1>
          <p className="text-gray-600">Dashboard Estratégico de Despliegue</p>
        </div>

        {/* Scenario Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Escenario de Simulación
          </label>
          <select 
            value={scenario}
            onChange={(e) => setScenario(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="conservative">Conservador (70%)</option>
            <option value="realistic">Realista (100%)</option>
            <option value="optimistic">Optimista (150%)</option>
          </select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Usuarios Activos</h3>
            <p className="text-2xl font-bold text-blue-600">{data.users.toLocaleString()}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Socios Comerciales</h3>
            <p className="text-2xl font-bold text-green-600">{data.partners.toLocaleString()}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Ingresos Mensuales</h3>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(data.revenue)}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">ROI</h3>
            <p className={`text-2xl font-bold ${getROIColor(data.roi)}`}>
              {data.roi.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Phase Progress */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">Progreso de Fases</h3>
          <div className="flex items-center space-x-4">
            {['MVP', 'Beta Cerrada', 'Lanzamiento Público', 'Escalamiento'].map((phase, index) => (
              <div key={phase} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  phase === data.phase ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <span className="ml-2 text-sm">{phase}</span>
                {index < 3 && <div className="w-8 h-0.5 bg-gray-300 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Agent Performance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Rendimiento de Agentes</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">10K</div>
              <div className="text-sm text-gray-500">Diagnósticos/mes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">2K</div>
              <div className="text-sm text-gray-500">Alertas SOS/mes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">50K</div>
              <div className="text-sm text-gray-500">Consultas/mes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">500</div>
              <div className="text-sm text-gray-500">Reportes/mes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIDashboard;