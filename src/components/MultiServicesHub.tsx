// Arquitecto: DIOS | Implementador: Jorge Hernández
// Migrado de F:\TEST_ASISTENCIA_VIAL - Hub de Multiservicios
import { useState, useEffect } from 'react';

interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  services: Service[];
  available24h: boolean;
}

interface Service {
  id: string;
  name: string;
  description: string;
  provider: string;
  estimatedTime: string;
  cost: string;
  phone?: string;
  coverage: 'NACIONAL' | 'CDMX' | 'REGIONAL';
}

export default function MultiServicesHub() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('vial');
  const [requestHistory, setRequestHistory] = useState<any[]>([]);

  useEffect(() => {
    const multiservicesData: ServiceCategory[] = [
      {
        id: 'vial',
        name: 'Asistencia Vial',
        icon: '🚗',
        description: 'Servicios de emergencia y mantenimiento vehicular',
        available24h: true,
        services: [
          { id: 'grua', name: 'Servicio de Grúa', description: 'Remolque hasta 50km', provider: 'Ángeles Verdes', estimatedTime: '20-30 min', cost: 'Gratuito', phone: '078', coverage: 'NACIONAL' },
          { id: 'combustible', name: 'Suministro Gasolina', description: 'Entrega 5L combustible', provider: 'Pemex Delivery', estimatedTime: '25-35 min', cost: 'Costo combustible', coverage: 'NACIONAL' },
          { id: 'llanta', name: 'Cambio de Llanta', description: 'Instalación refacción', provider: 'Técnicos Certificados', estimatedTime: '15-20 min', cost: 'Incluido', coverage: 'NACIONAL' },
          { id: 'bateria', name: 'Paso de Corriente', description: 'Arranque batería', provider: 'Ángeles Verdes', estimatedTime: '15-25 min', cost: 'Gratuito', phone: '078', coverage: 'NACIONAL' }
        ]
      },
      {
        id: 'medica',
        name: 'Asistencia Médica',
        icon: '🏥',
        description: 'Servicios de salud y emergencias médicas',
        available24h: true,
        services: [
          { id: 'ambulancia', name: 'Ambulancia', description: 'Traslado médico emergencia', provider: 'Cruz Roja', estimatedTime: '8-15 min', cost: 'Según tarifa', phone: '065', coverage: 'NACIONAL' },
          { id: 'orientacion', name: 'Orientación Médica', description: 'Consulta telefónica 24h', provider: 'Médicos Certificados', estimatedTime: 'Inmediato', cost: 'Incluido', coverage: 'NACIONAL' },
          { id: 'medicamentos', name: 'Entrega Medicamentos', description: 'Delivery medicinas urgentes', provider: 'Farmacias Ahorro', estimatedTime: '30-45 min', cost: 'Costo medicamento', coverage: 'CDMX' }
        ]
      },
      {
        id: 'hogar',
        name: 'Asistencia Hogar',
        icon: '🏠',
        description: 'Servicios de emergencia doméstica',
        available24h: true,
        services: [
          { id: 'plomeria', name: 'Plomería Emergencia', description: 'Reparación fugas', provider: 'Técnicos Certificados', estimatedTime: '30-60 min', cost: 'Desde $300', coverage: 'CDMX' },
          { id: 'electricidad', name: 'Electricidad', description: 'Reparación fallas eléctricas', provider: 'Electricistas', estimatedTime: '45-90 min', cost: 'Desde $400', coverage: 'CDMX' },
          { id: 'cerrajeria', name: 'Cerrajería', description: 'Apertura puertas', provider: 'Cerrajeros 24h', estimatedTime: '20-40 min', cost: 'Desde $250', coverage: 'CDMX' },
          { id: 'vidrieria', name: 'Vidriería', description: 'Reparación cristales', provider: 'Vidrieros', estimatedTime: '60-120 min', cost: 'Según tamaño', coverage: 'CDMX' }
        ]
      },
      {
        id: 'legal',
        name: 'Asistencia Legal',
        icon: '⚖️',
        description: 'Orientación jurídica',
        available24h: false,
        services: [
          { id: 'orientacion-legal', name: 'Orientación Telefónica', description: 'Consulta legal inmediata', provider: 'Abogados', estimatedTime: 'Inmediato', cost: 'Incluido', coverage: 'NACIONAL' },
          { id: 'accidentes', name: 'Asistencia Accidentes', description: 'Representación siniestros', provider: 'Despacho Jurídico', estimatedTime: '30-60 min', cost: 'Incluido', coverage: 'NACIONAL' },
          { id: 'tramites', name: 'Gestión Trámites', description: 'Apoyo documentación', provider: 'Gestores', estimatedTime: '1-3 días', cost: 'Según trámite', coverage: 'NACIONAL' }
        ]
      },
      {
        id: 'mascotas',
        name: 'Asistencia Mascotas',
        icon: '🐕',
        description: 'Servicios veterinarios emergencia',
        available24h: true,
        services: [
          { id: 'veterinario', name: 'Veterinario Emergencia', description: 'Atención médica urgente', provider: 'Clínicas Veterinarias', estimatedTime: '30-45 min', cost: 'Desde $500', coverage: 'CDMX' },
          { id: 'traslado-mascota', name: 'Traslado Mascotas', description: 'Transporte clínica', provider: 'Pet Ambulance', estimatedTime: '20-30 min', cost: 'Desde $200', coverage: 'CDMX' }
        ]
      },
      {
        id: 'tecnologia',
        name: 'Asistencia Tecnológica',
        icon: '💻',
        description: 'Soporte técnico dispositivos',
        available24h: false,
        services: [
          { id: 'soporte-remoto', name: 'Soporte Remoto', description: 'Asistencia videollamada', provider: 'Técnicos', estimatedTime: 'Inmediato', cost: 'Incluido', coverage: 'NACIONAL' },
          { id: 'reparacion-domicilio', name: 'Reparación Domicilio', description: 'Técnico en casa', provider: 'Servicio Técnico', estimatedTime: '2-4 horas', cost: 'Desde $300', coverage: 'CDMX' }
        ]
      }
    ];

    setCategories(multiservicesData);
  }, []);

  const requestService = async (service: Service) => {
    const serviceRequest = {
      id: `REQ-${Date.now()}`,
      serviceId: service.id,
      serviceName: service.name,
      provider: service.provider,
      timestamp: new Date().toISOString(),
      status: 'REQUESTED',
      estimatedTime: service.estimatedTime
    };

    setRequestHistory(prev => [serviceRequest, ...prev]);

    try {
      await fetch('/api/multiservice-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceRequest)
      });

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`🛠️ Servicio Solicitado`, {
          body: `${service.name} - ${service.estimatedTime}`,
          icon: '/manifest.json'
        });
      }

      alert(`✅ Servicio solicitado\n\n${service.name}\nProveedor: ${service.provider}\nTiempo: ${service.estimatedTime}\nFolio: ${serviceRequest.id}`);
    } catch (error) {
      alert('Error al solicitar servicio.');
    }
  };

  const callProvider = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const activeServices = categories.find(cat => cat.id === activeCategory)?.services || [];

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold mb-2 text-white">🛠️ Multiservicios</h2>
          <p className="text-gray-400 text-sm">Plataforma integral 24/7</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(category => (
            <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${activeCategory === category.id ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
              {category.available24h && <span className="text-xs bg-green-600 px-1 rounded">24h</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-4">
        {categories.find(cat => cat.id === activeCategory) && (
          <>
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2 text-white">{categories.find(cat => cat.id === activeCategory)?.icon} {categories.find(cat => cat.id === activeCategory)?.name}</h3>
              <p className="text-gray-400 text-sm">{categories.find(cat => cat.id === activeCategory)?.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeServices.map(service => (
                <div key={service.id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-white">{service.name}</h4>
                      <p className="text-sm text-gray-400">{service.description}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${service.coverage === 'NACIONAL' ? 'bg-green-600' : service.coverage === 'CDMX' ? 'bg-blue-600' : 'bg-yellow-600'}`}>{service.coverage}</span>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between text-gray-300">
                      <span className="text-gray-400">Proveedor:</span>
                      <span>{service.provider}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span className="text-gray-400">Tiempo:</span>
                      <span>{service.estimatedTime}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span className="text-gray-400">Costo:</span>
                      <span className={service.cost.includes('Gratuito') || service.cost.includes('Incluido') ? 'text-green-400' : ''}>{service.cost}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => requestService(service)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium">🛠️ Solicitar</button>
                    {service.phone && <button onClick={() => callProvider(service.phone!)} className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-sm">📞</button>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="bg-gray-900 rounded-lg p-4">
        <h3 className="font-semibold mb-4 text-white">🚨 Números Emergencia</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Emergencias', number: '911', icon: '🚨' },
            { name: 'Ángeles Verdes', number: '078', icon: '🚗' },
            { name: 'Cruz Roja', number: '065', icon: '🏥' },
            { name: 'CAPUFE', number: '074', icon: '🛣️' }
          ].map(emergency => (
            <button key={emergency.number} onClick={() => callProvider(emergency.number)} className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg text-center">
              <div className="text-2xl mb-1">{emergency.icon}</div>
              <div className="text-sm font-semibold">{emergency.name}</div>
              <div className="text-xs">{emergency.number}</div>
            </button>
          ))}
        </div>
      </div>

      {requestHistory.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="font-semibold mb-4 text-white">📋 Historial</h3>
          <div className="space-y-2">
            {requestHistory.slice(0, 3).map(request => (
              <div key={request.id} className="bg-gray-800 rounded p-3 text-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-white">{request.serviceName}</div>
                    <div className="text-gray-400">{request.provider}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400">{request.status}</div>
                    <div className="text-xs text-gray-400">{new Date(request.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
