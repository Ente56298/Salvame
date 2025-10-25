import React, { useState } from 'react';
import { useGameification } from '../hooks/useGameification';

interface Integration {
  id: string;
  name: string;
  icon: string;
  description: string;
  status: 'connected' | 'available' | 'coming_soon';
  category: 'automotive' | 'emergency' | 'social' | 'business';
  features: string[];
  xp: number;
}

const AdvancedIntegrations: React.FC = () => {
  const { actions } = useGameification();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'automotive' | 'emergency' | 'social' | 'business'>('all');

  const integrations: Integration[] = [
    {
      id: 'obd2',
      name: 'OBD2 Scanner',
      icon: '🔌',
      description: 'Diagnóstico del vehículo en tiempo real',
      status: 'available',
      category: 'automotive',
      features: ['Códigos de error', 'Métricas del motor', 'Consumo combustible', 'Alertas preventivas'],
      xp: 50
    },
    {
      id: 'tesla',
      name: 'Tesla API',
      icon: '🚗',
      description: 'Integración completa con vehículos Tesla',
      status: 'connected',
      category: 'automotive',
      features: ['Estado batería', 'Control remoto', 'Ubicación', 'Climatización'],
      xp: 75
    },
    {
      id: 'cruz_roja',
      name: 'Cruz Roja Mexicana',
      icon: '🚑',
      description: 'Conexión directa con servicios médicos',
      status: 'available',
      category: 'emergency',
      features: ['SOS médico', 'Ambulancias', 'Hospitales cercanos', 'Historial médico'],
      xp: 100
    },
    {
      id: 'policia',
      name: 'Policía Federal',
      icon: '👮',
      description: 'Reportes directos a autoridades',
      status: 'coming_soon',
      category: 'emergency',
      features: ['Reportes de emergencia', 'Ubicación en tiempo real', 'Historial de incidentes'],
      xp: 80
    },
    {
      id: 'waze',
      name: 'Waze Community',
      icon: '🗺️',
      description: 'Datos de tráfico y comunidad',
      status: 'connected',
      category: 'social',
      features: ['Reportes tráfico', 'Alertas comunidad', 'Rutas optimizadas', 'Eventos viales'],
      xp: 30
    },
    {
      id: 'google_maps',
      name: 'Google Maps',
      icon: '📍',
      description: 'Navegación y lugares de interés',
      status: 'connected',
      category: 'social',
      features: ['Navegación', 'Lugares', 'Reviews', 'Fotos'],
      xp: 25
    },
    {
      id: 'uber',
      name: 'Uber for Business',
      icon: '🚕',
      description: 'Servicios de transporte empresarial',
      status: 'available',
      category: 'business',
      features: ['Viajes corporativos', 'Facturación', 'Reportes', 'Gestión flotas'],
      xp: 60
    },
    {
      id: 'pemex',
      name: 'PEMEX Rewards',
      icon: '⛽',
      description: 'Programa de lealtad y pagos',
      status: 'available',
      category: 'business',
      features: ['Puntos rewards', 'Pagos móviles', 'Descuentos', 'Historial compras'],
      xp: 40
    },
    {
      id: 'insurance',
      name: 'Seguros Monterrey',
      icon: '🛡️',
      description: 'Gestión de seguros vehiculares',
      status: 'coming_soon',
      category: 'business',
      features: ['Pólizas', 'Siniestros', 'Asistencia vial', 'Renovaciones'],
      xp: 90
    },
    {
      id: 'alexa',
      name: 'Amazon Alexa',
      icon: '🎤',
      description: 'Control por voz inteligente',
      status: 'available',
      category: 'automotive',
      features: ['Comandos voz', 'Smart home', 'Música', 'Noticias'],
      xp: 45
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      icon: '💬',
      description: 'Comunicación con servicios',
      status: 'connected',
      category: 'social',
      features: ['Chat talleres', 'Cotizaciones', 'Citas', 'Soporte'],
      xp: 20
    },
    {
      id: 'apple_carplay',
      name: 'Apple CarPlay',
      icon: '🍎',
      description: 'Integración con sistema del vehículo',
      status: 'coming_soon',
      category: 'automotive',
      features: ['Dashboard nativo', 'Siri', 'Mapas', 'Música'],
      xp: 70
    }
  ];

  const categories = [
    { id: 'all', name: 'Todas', icon: '🔗' },
    { id: 'automotive', name: 'Automotriz', icon: '🚗' },
    { id: 'emergency', name: 'Emergencias', icon: '🚨' },
    { id: 'social', name: 'Social', icon: '👥' },
    { id: 'business', name: 'Negocios', icon: '💼' }
  ];

  const filteredIntegrations = selectedCategory === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === selectedCategory);

  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return 'text-green-400';
      case 'available': return 'text-blue-400';
      case 'coming_soon': return 'text-gray-400';
    }
  };

  const getStatusText = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'available': return 'Disponible';
      case 'coming_soon': return 'Próximamente';
    }
  };

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return '✅';
      case 'available': return '🔗';
      case 'coming_soon': return '⏳';
    }
  };

  const getCategoryColor = (category: Integration['category']) => {
    switch (category) {
      case 'automotive': return 'bg-blue-600';
      case 'emergency': return 'bg-red-600';
      case 'social': return 'bg-green-600';
      case 'business': return 'bg-purple-600';
    }
  };

  const handleConnect = (integration: Integration) => {
    if (integration.status === 'available') {
      actions.addXP(integration.xp, `Conectaste ${integration.name}`);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🔗</span>
        <div>
          <h2 className="text-xl font-bold text-white">Integraciones Avanzadas</h2>
          <p className="text-gray-400">Conecta con servicios externos y APIs</p>
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
              {category.id === 'all' ? integrations.length : integrations.filter(i => i.category === category.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredIntegrations.map((integration) => (
          <div
            key={integration.id}
            className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{integration.icon}</span>
                <div>
                  <h3 className="font-bold text-white">{integration.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${getStatusColor(integration.status)}`}>
                      {getStatusIcon(integration.status)} {getStatusText(integration.status)}
                    </span>
                    <span className={`${getCategoryColor(integration.category)} text-white text-xs px-2 py-1 rounded`}>
                      {integration.category.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              
              {integration.xp > 0 && (
                <div className="bg-yellow-600 text-white text-xs px-2 py-1 rounded">
                  +{integration.xp} XP
                </div>
              )}
            </div>

            <p className="text-gray-300 text-sm mb-4">{integration.description}</p>

            {/* Features */}
            <div className="mb-4">
              <h4 className="font-bold text-white text-sm mb-2">Características:</h4>
              <div className="flex flex-wrap gap-1">
                {integration.features.slice(0, 3).map((feature, index) => (
                  <span key={index} className="bg-gray-600 text-gray-200 text-xs px-2 py-1 rounded">
                    {feature}
                  </span>
                ))}
                {integration.features.length > 3 && (
                  <span className="bg-gray-600 text-gray-200 text-xs px-2 py-1 rounded">
                    +{integration.features.length - 3} más
                  </span>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400">
                {integration.status === 'connected' ? '✅ Activo' :
                 integration.status === 'available' ? '🔗 Listo para conectar' :
                 '⏳ En desarrollo'}
              </div>
              
              {integration.status === 'available' && (
                <button
                  onClick={() => handleConnect(integration)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Conectar
                </button>
              )}
              
              {integration.status === 'connected' && (
                <button className="bg-green-600 text-white px-3 py-1 rounded text-sm cursor-default">
                  Conectado
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
            {integrations.filter(i => i.status === 'connected').length}
          </div>
          <div className="text-sm text-gray-300">Conectadas</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-blue-400">
            {integrations.filter(i => i.status === 'available').length}
          </div>
          <div className="text-sm text-gray-300">Disponibles</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-gray-400">
            {integrations.filter(i => i.status === 'coming_soon').length}
          </div>
          <div className="text-sm text-gray-300">Próximamente</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-purple-400">
            {integrations.filter(i => i.status === 'available').reduce((sum, i) => sum + i.xp, 0)}
          </div>
          <div className="text-sm text-gray-300">XP Disponible</div>
        </div>
      </div>

      {/* Integration Benefits */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="font-bold text-white mb-4">🌟 Beneficios de las Integraciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <h4 className="font-bold text-white mb-2">🚗 Automotriz</h4>
            <ul className="space-y-1">
              <li>• Diagnóstico en tiempo real</li>
              <li>• Control remoto del vehículo</li>
              <li>• Mantenimiento predictivo</li>
              <li>• Optimización de combustible</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">🚨 Emergencias</h4>
            <ul className="space-y-1">
              <li>• Respuesta más rápida</li>
              <li>• Datos médicos disponibles</li>
              <li>• Ubicación precisa</li>
              <li>• Historial de incidentes</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">👥 Social</h4>
            <ul className="space-y-1">
              <li>• Información de comunidad</li>
              <li>• Reportes colaborativos</li>
              <li>• Recomendaciones personalizadas</li>
              <li>• Comunicación directa</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">💼 Negocios</h4>
            <ul className="space-y-1">
              <li>• Descuentos y rewards</li>
              <li>• Facturación automática</li>
              <li>• Gestión de flotas</li>
              <li>• Reportes empresariales</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedIntegrations;