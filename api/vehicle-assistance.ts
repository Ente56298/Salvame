import type { VercelRequest, VercelResponse } from '@vercel/node';

interface VehicleAssistanceRequest {
  vehicleData?: any;
  alertType: string;
  location: string;
  timestamp: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const request: VehicleAssistanceRequest = req.body;

  try {
    console.log('🚗 VEHICLE ASSISTANCE REQUEST:', {
      alertType: request.alertType,
      urgency: request.urgency,
      timestamp: request.timestamp,
      location: request.location,
      vehicleInfo: request.vehicleData ? 
        `${request.vehicleData.year} ${request.vehicleData.make} ${request.vehicleData.model}` : 
        'Unknown vehicle'
    });

    // Determine assistance type and dispatch appropriate service
    const assistanceType = getAssistanceType(request.alertType);
    const dispatchedServices = dispatchServices(assistanceType, request.urgency);

    // Simulate integration with Mexican roadside assistance providers
    const response = {
      requestId: `ASSIST-${Date.now()}`,
      status: 'DISPATCHED',
      assistanceType,
      dispatchedServices,
      estimatedArrival: getEstimatedArrival(request.urgency),
      contactNumber: '078', // Ángeles Verdes
      instructions: getInstructions(assistanceType),
      timestamp: new Date().toISOString()
    };

    // In production, this would:
    // 1. Contact nearest service providers
    // 2. Send SMS/push notifications to user
    // 3. Update real-time tracking system
    // 4. Integrate with insurance companies
    // 5. Coordinate with traffic authorities if needed

    res.status(200).json({
      success: true,
      message: 'Vehicle assistance dispatched successfully',
      data: response
    });

  } catch (error) {
    console.error('Vehicle assistance error:', error);
    res.status(500).json({
      error: 'Failed to process assistance request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

function getAssistanceType(alertType: string): string {
  switch (alertType.toLowerCase()) {
    case 'fuel-low':
    case 'warning':
      return 'FUEL_DELIVERY';
    case 'tire-pressure':
    case 'critical':
      return 'TIRE_SERVICE';
    case 'diagnostic-codes':
      return 'MECHANICAL_DIAGNOSIS';
    case 'battery':
      return 'BATTERY_JUMP';
    default:
      return 'GENERAL_ASSISTANCE';
  }
}

function dispatchServices(assistanceType: string, urgency: string) {
  const baseServices = [
    {
      provider: 'Ángeles Verdes',
      service: 'Asistencia Vial Gratuita',
      phone: '078',
      eta: '20-30 min'
    }
  ];

  if (urgency === 'HIGH') {
    baseServices.push({
      provider: 'Grúas Express CDMX',
      service: 'Servicio de Emergencia',
      phone: '+52 55 2345 6789',
      eta: '15-20 min'
    });
  }

  switch (assistanceType) {
    case 'FUEL_DELIVERY':
      baseServices.push({
        provider: 'Pemex Delivery',
        service: 'Entrega de Combustible',
        phone: '+52 55 1234 5678',
        eta: '25-35 min'
      });
      break;
    
    case 'TIRE_SERVICE':
      baseServices.push({
        provider: 'Llantas y Servicios',
        service: 'Cambio de Llanta',
        phone: '+52 55 3456 7890',
        eta: '20-25 min'
      });
      break;
    
    case 'MECHANICAL_DIAGNOSIS':
      baseServices.push({
        provider: 'Taller Móvil Express',
        service: 'Diagnóstico Mecánico',
        phone: '+52 55 4567 8901',
        eta: '30-40 min'
      });
      break;
  }

  return baseServices;
}

function getEstimatedArrival(urgency: string): string {
  switch (urgency) {
    case 'HIGH': return '15-20 minutos';
    case 'MEDIUM': return '20-30 minutos';
    default: return '30-45 minutos';
  }
}

function getInstructions(assistanceType: string): string[] {
  const baseInstructions = [
    'Manténgase en un lugar seguro',
    'Encienda las luces de emergencia',
    'Coloque triángulos de seguridad si es posible'
  ];

  switch (assistanceType) {
    case 'FUEL_DELIVERY':
      return [
        ...baseInstructions,
        'Tenga listo su tanque de combustible',
        'Prepare identificación y documentos del vehículo'
      ];
    
    case 'TIRE_SERVICE':
      return [
        ...baseInstructions,
        'Localice la llanta de refacción',
        'Tenga listos los documentos del vehículo',
        'Manténgase alejado del tráfico'
      ];
    
    case 'BATTERY_JUMP':
      return [
        ...baseInstructions,
        'No intente arrancar el vehículo repetidamente',
        'Mantenga el capó cerrado hasta que llegue la asistencia'
      ];
    
    default:
      return baseInstructions;
  }
}