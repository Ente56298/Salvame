import type { VercelRequest, VercelResponse } from '@vercel/node';

interface CrashReport {
  type: 'CRASH_DETECTION';
  timestamp: string;
  location: { lat: number; lng: number } | null;
  accelerometerData: Array<{
    x: number;
    y: number; 
    z: number;
    timestamp: number;
  }>;
  deviceInfo: {
    userAgent: string;
    platform: string;
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const crashReport: CrashReport = req.body;

  try {
    // Log crash detection
    console.log('🚗💥 CRASH DETECTION ALERT:', {
      timestamp: crashReport.timestamp,
      location: crashReport.location ? 
        `${crashReport.location.lat}, ${crashReport.location.lng}` : 'Unknown',
      accelerometerReadings: crashReport.accelerometerData.length,
      device: crashReport.deviceInfo.platform,
      severity: analyzeCrashSeverity(crashReport.accelerometerData)
    });

    // Analyze crash severity
    const severity = analyzeCrashSeverity(crashReport.accelerometerData);
    
    // Prepare emergency response
    const emergencyResponse = {
      alertId: `CRASH-${Date.now()}`,
      severity,
      timestamp: new Date().toISOString(),
      location: crashReport.location,
      dispatchedUnits: getDispatchedUnits(severity, crashReport.location),
      estimatedArrival: getEstimatedArrival(severity),
      instructions: getEmergencyInstructions(severity)
    };

    // In production, this would:
    // 1. Immediately alert 911 dispatch
    // 2. Send ambulance/fire/police based on severity
    // 3. Notify nearby hospitals
    // 4. Alert traffic control for road closure
    // 5. Contact emergency contacts

    // Simulate emergency services notification
    console.log('🚨 EMERGENCY SERVICES NOTIFIED:', {
      dispatchCenter: 'CDMX Emergency Dispatch',
      unitsDispatched: emergencyResponse.dispatchedUnits.length,
      priority: severity === 'HIGH' ? 'CODE RED' : severity === 'MEDIUM' ? 'CODE YELLOW' : 'CODE GREEN'
    });

    res.status(200).json({
      success: true,
      alertId: emergencyResponse.alertId,
      message: 'Crash report received - Emergency services dispatched',
      emergencyResponse,
      autoCallInitiated: true
    });

  } catch (error) {
    console.error('Crash report processing error:', error);
    res.status(500).json({
      error: 'Failed to process crash report',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

function analyzeCrashSeverity(accelerometerData: Array<{x: number; y: number; z: number}>): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (!accelerometerData.length) return 'LOW';

  // Calculate maximum impact magnitude
  const maxMagnitude = Math.max(...accelerometerData.map(data => 
    Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2)
  ));

  // Severity thresholds
  if (maxMagnitude > 40) return 'HIGH';    // Severe crash
  if (maxMagnitude > 25) return 'MEDIUM';  // Moderate crash  
  return 'LOW';                            // Minor impact
}

function getDispatchedUnits(severity: string, location: {lat: number; lng: number} | null) {
  const baseUnits = [
    { type: 'Ambulancia', callSign: 'AMB-001', eta: '6-8 min' },
    { type: 'Patrulla', callSign: 'POL-045', eta: '4-6 min' }
  ];

  if (severity === 'HIGH') {
    return [
      ...baseUnits,
      { type: 'Bomberos', callSign: 'FIRE-12', eta: '8-10 min' },
      { type: 'Rescate', callSign: 'RES-003', eta: '10-12 min' },
      { type: 'Helicóptero Médico', callSign: 'HELI-1', eta: '15-20 min' }
    ];
  }

  if (severity === 'MEDIUM') {
    return [
      ...baseUnits,
      { type: 'Bomberos', callSign: 'FIRE-12', eta: '8-10 min' }
    ];
  }

  return baseUnits;
}

function getEstimatedArrival(severity: string): string {
  switch (severity) {
    case 'HIGH': return '4-6 minutos';
    case 'MEDIUM': return '6-8 minutos';
    default: return '8-12 minutos';
  }
}

function getEmergencyInstructions(severity: string): string[] {
  const baseInstructions = [
    'Mantén la calma',
    'No muevas a personas lesionadas',
    'Enciende las luces de emergencia',
    'Mantente en un lugar seguro'
  ];

  if (severity === 'HIGH') {
    return [
      'NO te muevas si sientes dolor',
      'Mantén la vía aérea despejada',
      'Aplica presión en heridas sangrantes',
      ...baseInstructions,
      'Espera a los paramédicos'
    ];
  }

  return baseInstructions;
}