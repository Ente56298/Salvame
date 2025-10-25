import type { VercelRequest, VercelResponse } from '@vercel/node';

interface LocationUpdate {
  lat: number;
  lng: number;
  timestamp: string;
  accuracy: number;
  altitude?: number;
  speed?: number;
  batteryLevel: number;
}

interface TrackingData {
  location: LocationUpdate;
  emergencyContacts: Array<{name: string; phone: string; email?: string}>;
  sessionId: string;
  deviceInfo: {
    userAgent: string;
    platform: string;
    language: string;
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const trackingData: TrackingData = req.body;

  try {
    // Log emergency tracking data
    console.log('🚨 EMERGENCY TRACKING UPDATE:', {
      sessionId: trackingData.sessionId,
      timestamp: trackingData.location.timestamp,
      coordinates: `${trackingData.location.lat}, ${trackingData.location.lng}`,
      accuracy: `${trackingData.location.accuracy}m`,
      batteryLevel: `${trackingData.location.batteryLevel}%`,
      altitude: trackingData.location.altitude ? `${trackingData.location.altitude}m` : 'N/A',
      speed: trackingData.location.speed ? `${(trackingData.location.speed * 3.6).toFixed(1)} km/h` : 'N/A',
      emergencyContacts: trackingData.emergencyContacts.length,
      device: trackingData.deviceInfo.platform
    });

    // In production, this would:
    // 1. Store in emergency services database
    // 2. Forward to 911 dispatch centers
    // 3. Send to emergency contacts via SMS/email
    // 4. Integrate with rescue coordination centers

    // Simulate emergency services integration
    const emergencyResponse = {
      received: true,
      timestamp: new Date().toISOString(),
      trackingId: `TRACK-${trackingData.sessionId}`,
      dispatchCenter: 'CDMX Emergency Services',
      estimatedResponseTime: '8-12 minutes',
      nearestUnits: [
        {
          type: 'Ambulancia',
          callSign: 'AMB-001',
          eta: '8 min',
          distance: '2.3 km'
        },
        {
          type: 'Patrulla',
          callSign: 'POL-045', 
          eta: '6 min',
          distance: '1.8 km'
        }
      ]
    };

    // Store tracking session (in production, use proper database)
    const trackingSession = {
      ...trackingData,
      emergencyResponse,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    // Simulate real-time updates to emergency contacts
    if (trackingData.emergencyContacts.length > 0) {
      console.log('📱 Sending location updates to emergency contacts:', 
        trackingData.emergencyContacts.map(c => c.name).join(', ')
      );
    }

    res.status(200).json({
      success: true,
      trackingId: emergencyResponse.trackingId,
      message: 'Location update received by emergency services',
      emergencyResponse,
      nextUpdateExpected: new Date(Date.now() + 30000).toISOString() // 30 seconds
    });

  } catch (error) {
    console.error('Emergency tracking error:', error);
    res.status(500).json({
      error: 'Failed to process tracking update',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}