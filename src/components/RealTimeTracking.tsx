import { useState, useEffect, useRef } from 'react';

interface LocationUpdate {
  lat: number;
  lng: number;
  timestamp: string;
  accuracy: number;
  altitude?: number;
  speed?: number;
  batteryLevel: number;
}

interface EmergencyContact {
  name: string;
  phone: string;
  email?: string;
}

export default function RealTimeTracking() {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationUpdate | null>(null);
  const [locationHistory, setLocationHistory] = useState<LocationUpdate[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    // Get battery level
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }

    // Load emergency contacts from localStorage
    const savedContacts = localStorage.getItem('emergency_contacts');
    if (savedContacts) {
      setEmergencyContacts(JSON.parse(savedContacts));
    } else {
      // Default emergency contacts
      setEmergencyContacts([
        { name: 'Emergencias', phone: '911' },
        { name: 'Cruz Roja', phone: '065' },
        { name: 'Ángeles Verdes', phone: '078' }
      ]);
    }

    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  const startRealTimeTracking = () => {
    if (!navigator.geolocation) {
      alert('Geolocalización no disponible en este dispositivo');
      return;
    }

    setIsTracking(true);
    
    // High accuracy tracking for emergency situations
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const locationUpdate: LocationUpdate = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: new Date().toISOString(),
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude || undefined,
          speed: position.coords.speed || undefined,
          batteryLevel
        };

        setCurrentLocation(locationUpdate);
        setLocationHistory(prev => [...prev.slice(-50), locationUpdate]); // Keep last 50 locations

        // Send location update to emergency services and contacts
        sendLocationUpdate(locationUpdate);
      },
      (error) => {
        console.error('Location error:', error);
        // Try to use cached location or IP-based location
        tryFallbackLocation();
      },
      options
    );
  };

  const stopRealTimeTracking = () => {
    setIsTracking(false);
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  };

  const sendLocationUpdate = async (location: LocationUpdate) => {
    // Store locally first (for offline scenarios)
    const trackingData = {
      location,
      emergencyContacts,
      sessionId: Date.now().toString(),
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language
      }
    };

    localStorage.setItem('active_tracking_session', JSON.stringify(trackingData));

    // Try to send to emergency services API
    try {
      await fetch('/api/emergency-tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trackingData)
      });
    } catch (error) {
      console.error('Failed to send tracking update:', error);
      // Store for later sync when connection returns
      const pendingUpdates = JSON.parse(localStorage.getItem('pending_tracking_updates') || '[]');
      pendingUpdates.push(trackingData);
      localStorage.setItem('pending_tracking_updates', JSON.stringify(pendingUpdates));
    }

    // Send SMS updates to emergency contacts (every 2 minutes)
    if (locationHistory.length % 24 === 0) { // Assuming updates every 5 seconds
      sendSMSLocationUpdate(location);
    }
  };

  const sendSMSLocationUpdate = async (location: LocationUpdate) => {
    const message = `🚨 SEGUIMIENTO EMERGENCIA
📍 Ubicación: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}
🕐 Hora: ${new Date(location.timestamp).toLocaleString()}
🔋 Batería: ${location.batteryLevel}%
📏 Precisión: ${location.accuracy}m
🗺️ Ver: https://maps.google.com/?q=${location.lat},${location.lng}`;

    try {
      await fetch('/api/emergency-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          location,
          type: 'tracking_update',
          contacts: emergencyContacts
        })
      });
    } catch (error) {
      console.error('Failed to send SMS update:', error);
    }
  };

  const tryFallbackLocation = async () => {
    // Try IP-based location as fallback
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      const fallbackLocation: LocationUpdate = {
        lat: data.latitude,
        lng: data.longitude,
        timestamp: new Date().toISOString(),
        accuracy: 10000, // Low accuracy for IP-based location
        batteryLevel
      };

      setCurrentLocation(fallbackLocation);
      sendLocationUpdate(fallbackLocation);
    } catch (error) {
      console.error('Fallback location failed:', error);
    }
  };

  const shareLocationWithContacts = () => {
    if (!currentLocation) return;

    const shareUrl = `https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`;
    const shareText = `🚨 Mi ubicación de emergencia: ${shareUrl}`;

    if (navigator.share) {
      navigator.share({
        title: 'Ubicación de Emergencia',
        text: shareText,
        url: shareUrl
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Ubicación copiada al portapapeles');
    }
  };

  const activateEmergencyMode = () => {
    startRealTimeTracking();
    
    // Enable emergency location sharing (ELS) simulation
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification('🚨 Seguimiento de Emergencia Activado', {
          body: 'Tu ubicación se está compartiendo con servicios de emergencia',
          icon: '/manifest.json',
          tag: 'emergency-tracking',
          requireInteraction: true,
          actions: [
            { action: 'stop', title: 'Detener Seguimiento' },
            { action: 'share', title: 'Compartir Ubicación' }
          ]
        });
      });
    }
  };

  return (
    <div className="rocket-card p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Seguimiento en Tiempo Real</h3>
        <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
      </div>

      {currentLocation && (
        <div className="bg-gray-800 rounded-lg p-3 mb-4 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>📍 Lat: {currentLocation.lat.toFixed(6)}</div>
            <div>📍 Lng: {currentLocation.lng.toFixed(6)}</div>
            <div>🎯 Precisión: {currentLocation.accuracy}m</div>
            <div>🔋 Batería: {currentLocation.batteryLevel}%</div>
            {currentLocation.altitude && (
              <div>⛰️ Altitud: {currentLocation.altitude.toFixed(0)}m</div>
            )}
            {currentLocation.speed && (
              <div>🚗 Velocidad: {(currentLocation.speed * 3.6).toFixed(1)} km/h</div>
            )}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Última actualización: {new Date(currentLocation.timestamp).toLocaleTimeString()}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {!isTracking ? (
          <button
            onClick={activateEmergencyMode}
            className="rocket-button w-full"
          >
            🚨 Activar Seguimiento de Emergencia
          </button>
        ) : (
          <button
            onClick={stopRealTimeTracking}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded w-full"
          >
            🛑 Detener Seguimiento
          </button>
        )}

        {currentLocation && (
          <button
            onClick={shareLocationWithContacts}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full"
          >
            📤 Compartir Ubicación
          </button>
        )}
      </div>

      {isTracking && (
        <div className="mt-4 text-xs text-gray-400">
          <div>📡 Actualizaciones enviadas: {locationHistory.length}</div>
          <div>⏱️ Tiempo activo: {Math.floor(locationHistory.length * 5 / 60)} min</div>
          <div className="text-orange-400 mt-2">
            ⚠️ El seguimiento consume batería. Úsalo solo en emergencias.
          </div>
        </div>
      )}
    </div>
  );
}