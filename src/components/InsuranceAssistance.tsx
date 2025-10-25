import { useState, useEffect } from 'react';

interface InsurancePolicy {
  policyNumber: string;
  insurer: string;
  coverage: string[];
  expiryDate: string;
  assistanceIncluded: boolean;
}

interface AssistanceService {
  id: string;
  name: string;
  description: string;
  available: boolean;
  estimatedTime: string;
  cost: string;
}

export default function InsuranceAssistance() {
  const [policy, setPolicy] = useState<InsurancePolicy | null>(null);
  const [services, setServices] = useState<AssistanceService[]>([]);
  const [activeRequest, setActiveRequest] = useState<string | null>(null);

  useEffect(() => {
    // Load insurance policy data
    const savedPolicy = localStorage.getItem('insurance_policy');
    if (savedPolicy) {
      setPolicy(JSON.parse(savedPolicy));
    } else {
      // Mock insurance data for demo
      const mockPolicy: InsurancePolicy = {
        policyNumber: 'POL-MX-2024-789456',
        insurer: 'Seguros BBVA',
        coverage: ['Responsabilidad Civil', 'Daños Materiales', 'Robo Total', 'Asistencia Vial'],
        expiryDate: '2025-06-15',
        assistanceIncluded: true
      };
      setPolicy(mockPolicy);
    }

    // Load available services
    const assistanceServices: AssistanceService[] = [
      {
        id: 'towing',
        name: 'Servicio de Grúa',
        description: 'Remolque hasta 50km incluido en póliza',
        available: true,
        estimatedTime: '20-30 min',
        cost: 'Incluido'
      },
      {
        id: 'tire-change',
        name: 'Cambio de Llanta',
        description: 'Instalación de llanta de refacción',
        available: true,
        estimatedTime: '15-20 min',
        cost: 'Incluido'
      },
      {
        id: 'fuel-delivery',
        name: 'Suministro de Gasolina',
        description: 'Entrega de 5 litros de combustible',
        available: true,
        estimatedTime: '25-35 min',
        cost: 'Incluido'
      },
      {
        id: 'battery-jump',
        name: 'Paso de Corriente',
        description: 'Arranque por batería descargada',
        available: true,
        estimatedTime: '15-25 min',
        cost: 'Incluido'
      },
      {
        id: 'lockout',
        name: 'Apertura de Vehículo',
        description: 'Apertura por llaves olvidadas',
        available: true,
        estimatedTime: '20-30 min',
        cost: 'Incluido'
      },
      {
        id: 'taxi-service',
        name: 'Taxi de Emergencia',
        description: 'Transporte alternativo hasta 200 pesos',
        available: true,
        estimatedTime: '10-15 min',
        cost: 'Incluido'
      }
    ];

    setServices(assistanceServices);
  }, []);

  const requestService = async (serviceId: string) => {
    if (!policy) {
      alert('No se encontró información de póliza de seguro');
      return;
    }

    setActiveRequest(serviceId);
    
    const service = services.find(s => s.id === serviceId);
    const location = await getCurrentLocation();

    const assistanceRequest = {
      policyNumber: policy.policyNumber,
      insurer: policy.insurer,
      serviceType: serviceId,
      serviceName: service?.name,
      location,
      timestamp: new Date().toISOString(),
      customerPhone: '+52 55 1234 5678', // Would be from user profile
      vehicleInfo: 'Nissan Sentra 2023' // Would be from vehicle data
    };

    try {
      // Send request to insurance company API
      await fetch('/api/insurance-assistance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assistanceRequest)
      });

      // Show confirmation
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`🚗 Asistencia Solicitada`, {
          body: `${service?.name} - Tiempo estimado: ${service?.estimatedTime}`,
          icon: '/manifest.json'
        });
      }

      alert(`✅ Solicitud enviada a ${policy.insurer}\n\nServicio: ${service?.name}\nTiempo estimado: ${service?.estimatedTime}\nFolio: AST-${Date.now()}`);

    } catch (error) {
      console.error('Insurance assistance request failed:', error);
      alert('Error al solicitar asistencia. Intente nuevamente.');
    } finally {
      setActiveRequest(null);
    }
  };

  const getCurrentLocation = (): Promise<{lat: number, lng: number} | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  };

  const callInsuranceDirectly = () => {
    const insuranceNumbers: {[key: string]: string} = {
      'Seguros BBVA': '8001234567',
      'GNP Seguros': '8007654321',
      'Qualitas': '8001122334',
      'AXA Seguros': '8005566778',
      'Mapfre': '8009988776'
    };

    const number = policy ? insuranceNumbers[policy.insurer] || '911' : '911';
    window.open(`tel:${number}`);
  };

  if (!policy) {
    return (
      <div className="rocket-card p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">🛡️</div>
          <h3 className="font-semibold mb-2">Configurar Seguro</h3>
          <p className="text-gray-400 text-sm mb-4">
            Agregue su información de póliza para acceder a servicios de asistencia vial
          </p>
          <button className="rocket-button">
            Agregar Póliza
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Policy Info */}
      <div className="rocket-card p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Póliza de Seguro</h3>
          <div className="text-xs text-green-400">✅ Activa</div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-400">Aseguradora</div>
              <div className="font-semibold">{policy.insurer}</div>
            </div>
            <div>
              <div className="text-gray-400">Póliza</div>
              <div className="font-semibold">{policy.policyNumber}</div>
            </div>
          </div>

          <div>
            <div className="text-gray-400 mb-1">Coberturas</div>
            <div className="flex flex-wrap gap-1">
              {policy.coverage.map(coverage => (
                <span key={coverage} className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs">
                  {coverage}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-700">
            <div>
              <div className="text-gray-400">Vigencia</div>
              <div className="text-sm">{new Date(policy.expiryDate).toLocaleDateString()}</div>
            </div>
            <button
              onClick={callInsuranceDirectly}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
            >
              📞 Llamar Aseguradora
            </button>
          </div>
        </div>
      </div>

      {/* Assistance Services */}
      <div className="rocket-card p-4">
        <h3 className="font-semibold mb-4">Servicios de Asistencia Vial</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {services.map(service => (
            <div key={service.id} className="bg-gray-800 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="font-semibold text-sm">{service.name}</div>
                <span className="text-xs text-green-400">{service.cost}</span>
              </div>
              
              <p className="text-xs text-gray-400 mb-2">{service.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">⏱️ {service.estimatedTime}</span>
                <button
                  onClick={() => requestService(service.id)}
                  disabled={activeRequest === service.id || !service.available}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-xs px-3 py-1 rounded"
                >
                  {activeRequest === service.id ? 'Solicitando...' : 'Solicitar'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-blue-900 border border-blue-500 rounded p-3 text-xs">
          <div className="font-semibold text-blue-200 mb-1">ℹ️ Información Importante</div>
          <div className="text-blue-100">
            • Los servicios están incluidos en su póliza<br/>
            • Disponible 24/7 en territorio nacional<br/>
            • Tiempo de respuesta puede variar según ubicación<br/>
            • Conserve su número de folio para seguimiento
          </div>
        </div>
      </div>
    </div>
  );
}