import type { VercelRequest, VercelResponse } from '@vercel/node';

interface MultiServiceRequest {
  id: string;
  serviceId: string;
  serviceName: string;
  provider: string;
  location: { lat: number; lng: number } | null;
  timestamp: string;
  status: string;
  estimatedTime: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const request: MultiServiceRequest = req.body;

  try {
    console.log('🛠️ MULTISERVICE REQUEST:', {
      requestId: request.id,
      service: request.serviceName,
      provider: request.provider,
      location: request.location ? 
        `${request.location.lat}, ${request.location.lng}` : 'Unknown',
      timestamp: request.timestamp
    });

    // Route to appropriate service provider based on service type
    const providerResponse = await routeToProvider(request);

    // Simulate integration with Mexican service providers
    const response = {
      requestId: request.id,
      status: 'CONFIRMED',
      provider: providerResponse.provider,
      technician: providerResponse.technician,
      estimatedArrival: providerResponse.estimatedArrival,
      contactNumber: providerResponse.contactNumber,
      trackingCode: `TRACK-${Date.now()}`,
      instructions: getServiceInstructions(request.serviceId),
      cost: providerResponse.cost,
      timestamp: new Date().toISOString()
    };

    // In production, this would:
    // 1. Integrate with MAS Servicios API
    // 2. Connect to Ángeles Verdes system
    // 3. Coordinate with insurance companies
    // 4. Send SMS notifications to customer
    // 5. Update real-time tracking system

    res.status(200).json({
      success: true,
      message: 'Multiservice request processed successfully',
      data: response
    });

  } catch (error) {
    console.error('Multiservice request error:', error);
    res.status(500).json({
      error: 'Failed to process service request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function routeToProvider(request: MultiServiceRequest) {
  const serviceRouting: {[key: string]: any} = {
    // Vial Services
    'grua': {
      provider: 'Ángeles Verdes',
      technician: 'Técnico AV-001',
      estimatedArrival: '20-30 minutos',
      contactNumber: '078',
      cost: 'Gratuito'
    },
    'combustible': {
      provider: 'Pemex Delivery',
      technician: 'Operador PD-045',
      estimatedArrival: '25-35 minutos',
      contactNumber: '+52 55 1234 5678',
      cost: 'Costo del combustible'
    },
    'llanta': {
      provider: 'Llantas Express',
      technician: 'Técnico LE-023',
      estimatedArrival: '15-20 minutos',
      contactNumber: '+52 55 2345 6789',
      cost: 'Incluido en póliza'
    },
    
    // Medical Services
    'ambulancia': {
      provider: 'Cruz Roja Mexicana',
      technician: 'Paramédico CR-112',
      estimatedArrival: '8-15 minutos',
      contactNumber: '065',
      cost: 'Según tarifa oficial'
    },
    'orientacion': {
      provider: 'Telemedicina MX',
      technician: 'Dr. García',
      estimatedArrival: 'Inmediato',
      contactNumber: '+52 55 3456 7890',
      cost: 'Incluido'
    },
    
    // Home Services
    'plomeria': {
      provider: 'Plomeros 24h',
      technician: 'Plomero P-089',
      estimatedArrival: '30-60 minutos',
      contactNumber: '+52 55 4567 8901',
      cost: 'Desde $300 MXN'
    },
    'electricidad': {
      provider: 'Electricistas Express',
      technician: 'Electricista E-156',
      estimatedArrival: '45-90 minutos',
      contactNumber: '+52 55 5678 9012',
      cost: 'Desde $400 MXN'
    },
    'cerrajeria': {
      provider: 'Cerrajeros CDMX',
      technician: 'Cerrajero C-234',
      estimatedArrival: '20-40 minutos',
      contactNumber: '+52 55 6789 0123',
      cost: 'Desde $250 MXN'
    },
    
    // Legal Services
    'orientacion-legal': {
      provider: 'Bufete Jurídico MX',
      technician: 'Lic. Martínez',
      estimatedArrival: 'Inmediato',
      contactNumber: '+52 55 7890 1234',
      cost: 'Incluido'
    },
    
    // Pet Services
    'veterinario': {
      provider: 'Veterinaria 24h',
      technician: 'Dr. Veterinario V-067',
      estimatedArrival: '30-45 minutos',
      contactNumber: '+52 55 8901 2345',
      cost: 'Desde $500 MXN'
    },
    
    // Technology Services
    'soporte-remoto': {
      provider: 'TechSupport MX',
      technician: 'Técnico TS-445',
      estimatedArrival: 'Inmediato',
      contactNumber: '+52 55 9012 3456',
      cost: 'Incluido'
    }
  };

  return serviceRouting[request.serviceId] || {
    provider: 'Proveedor General',
    technician: 'Técnico disponible',
    estimatedArrival: '30-60 minutos',
    contactNumber: '911',
    cost: 'Por cotizar'
  };
}

function getServiceInstructions(serviceId: string): string[] {
  const instructions: {[key: string]: string[]} = {
    'grua': [
      'Manténgase en lugar seguro',
      'Encienda luces de emergencia',
      'Tenga listos documentos del vehículo',
      'Espere al técnico en lugar visible'
    ],
    'plomeria': [
      'Cierre la llave de paso principal',
      'Retire objetos de valor del área',
      'Tenga listo acceso al área afectada',
      'Prepare toallas para secar'
    ],
    'electricidad': [
      'Desconecte el interruptor principal',
      'No toque cables expuestos',
      'Mantenga el área despejada',
      'Tenga linterna disponible'
    ],
    'ambulancia': [
      'Mantenga la calma',
      'No mueva al paciente',
      'Tenga listos documentos médicos',
      'Mantenga vía libre para ambulancia'
    ],
    'veterinario': [
      'Mantenga a la mascota calmada',
      'Tenga lista cartilla de vacunación',
      'Prepare transportadora si es necesario',
      'No administre medicamentos'
    ]
  };

  return instructions[serviceId] || [
    'Manténgase en lugar seguro',
    'Tenga listos documentos necesarios',
    'Espere al técnico especializado'
  ];
}