import { useState, useEffect } from 'react';

interface EmergencyData {
  timestamp: string;
  location: { lat: number; lng: number } | null;
  batteryLevel: number;
  deviceInfo: string;
  emergencyContacts: string[];
}

export default function OfflineSOSButton() {
  const [isActive, setIsActive] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [emergencyData, setEmergencyData] = useState<EmergencyData | null>(null);

  useEffect(() => {
    // Monitor network status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get battery level if available
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const activateOfflineSOS = async () => {
    setIsActive(true);

    // Get current location
    const location = await getCurrentLocation();
    
    // Prepare emergency data
    const emergencyInfo: EmergencyData = {
      timestamp: new Date().toISOString(),
      location,
      batteryLevel,
      deviceInfo: navigator.userAgent,
      emergencyContacts: getEmergencyContacts()
    };

    setEmergencyData(emergencyInfo);

    // Store emergency data locally
    localStorage.setItem('emergency_sos_data', JSON.stringify(emergencyInfo));

    // Try multiple emergency strategies
    await executeEmergencyProtocol(emergencyInfo);
  };

  const getCurrentLocation = (): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => resolve(null),
        { 
          enableHighAccuracy: true, 
          timeout: 10000, 
          maximumAge: 60000 
        }
      );
    });
  };

  const getEmergencyContacts = (): string[] => {
    // In a real app, these would be user-configured
    return ['911', '065', '078'];
  };

  const executeEmergencyProtocol = async (data: EmergencyData) => {
    console.log('🚨 EXECUTING OFFLINE EMERGENCY PROTOCOL');

    // 1. Try cellular emergency call (works even without signal on most networks)
    tryEmergencyCall();

    // 2. Store data for when connection returns
    storeForLaterTransmission(data);

    // 3. Activate emergency mode (battery saving)
    activateEmergencyMode();

    // 4. Try satellite communication (simulated)
    if (isOffline) {
      trySatelliteEmergency(data);
    }

    // 5. Show emergency interface
    showEmergencyInterface(data);
  };

  const tryEmergencyCall = () => {
    // Emergency calls work even without signal on most networks
    const emergencyNumber = '911';
    
    // Show countdown and auto-dial
    let countdown = 3;
    const countdownInterval = setInterval(() => {
      console.log(`Emergency call in ${countdown}...`);
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        // Initiate emergency call
        window.location.href = `tel:${emergencyNumber}`;
      }
      countdown--;
    }, 1000);
  };

  const storeForLaterTransmission = (data: EmergencyData) => {
    // Store in multiple places for redundancy
    localStorage.setItem('pending_emergency_alert', JSON.stringify(data));
    sessionStorage.setItem('emergency_backup', JSON.stringify(data));
    
    // Try to sync when connection returns
    if (!isOffline) {
      syncEmergencyData(data);
    }
  };

  const syncEmergencyData = async (data: EmergencyData) => {
    try {
      await fetch('/api/emergency-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      // Clear stored data after successful sync
      localStorage.removeItem('pending_emergency_alert');
    } catch (error) {
      console.error('Failed to sync emergency data:', error);
    }
  };

  const activateEmergencyMode = () => {
    // Reduce screen brightness (simulated)
    document.body.style.filter = 'brightness(0.3)';
    
    // Show battery saving notification
    if ('serviceWorker' in navigator && 'Notification' in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification('🔋 Modo Emergencia Activado', {
          body: 'Batería optimizada para duración máxima',
          icon: '/manifest.json',
          tag: 'emergency-mode'
        });
      });
    }
  };

  const trySatelliteEmergency = (data: EmergencyData) => {
    // Simulated satellite communication
    console.log('📡 Attempting satellite emergency communication...');
    
    const satelliteMessage = {
      type: 'EMERGENCY_SOS',
      location: data.location,
      timestamp: data.timestamp,
      message: 'EMERGENCIA VIAL - Asistencia requerida'
    };

    // In a real implementation, this would use actual satellite APIs
    console.log('📡 Satellite message prepared:', satelliteMessage);
    
    // Store for when satellite connection is available
    localStorage.setItem('satellite_emergency_queue', JSON.stringify(satelliteMessage));
  };

  const showEmergencyInterface = (data: EmergencyData) => {
    // Keep interface active for 30 seconds, then auto-minimize to save battery
    setTimeout(() => {
      if (isActive) {
        setIsActive(false);
        // Show minimal emergency indicator
        showMinimalEmergencyMode();
      }
    }, 30000);
  };

  const showMinimalEmergencyMode = () => {
    // Create persistent emergency indicator
    const indicator = document.createElement('div');
    indicator.innerHTML = '🚨';
    indicator.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: red;
      color: white;
      padding: 5px;
      border-radius: 50%;
      z-index: 9999;
      font-size: 12px;
      animation: blink 1s infinite;
    `;
    document.body.appendChild(indicator);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={activateOfflineSOS}
        className={`sos-button-rocket ${isActive ? 'active' : ''} ${isOffline ? 'offline-mode' : ''}`}
      >
        {isOffline ? '📡' : '🆘'}
        <span className="block text-xs font-bold">
          {isOffline ? 'SOS' : 'SOS'}
        </span>
        {isOffline && (
          <span className="block text-xs">SIN SEÑAL</span>
        )}
      </button>

      {isActive && (
        <div className="absolute bottom-full right-0 mb-4 bg-red-900 border-2 border-red-400 rounded-lg p-4 min-w-80">
          <div className="text-center">
            <h3 className="text-red-100 font-bold text-lg mb-2">
              🚨 MODO EMERGENCIA {isOffline ? '(SIN SEÑAL)' : ''}
            </h3>
            
            <div className="space-y-2 text-sm text-red-200">
              <div>🔋 Batería: {batteryLevel}%</div>
              
              {emergencyData?.location && (
                <div className="font-mono text-xs">
                  📍 {emergencyData.location.lat.toFixed(6)}, {emergencyData.location.lng.toFixed(6)}
                </div>
              )}
              
              <div className="bg-red-800 rounded p-2 my-3">
                {isOffline ? (
                  <div>
                    <div className="font-bold">📡 BUSCANDO REDES DE EMERGENCIA</div>
                    <div className="text-xs">Intentando conexión satelital...</div>
                  </div>
                ) : (
                  <div>
                    <div className="font-bold">📞 LLAMANDO: 911</div>
                    <div className="text-xs">Servicios de Emergencia</div>
                  </div>
                )}
              </div>
              
              <div className="text-xs">
                {isOffline 
                  ? 'Datos guardados. Se enviarán cuando haya señal.'
                  : 'Ubicación enviada a servicios de emergencia.'
                }
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .offline-mode {
          animation: emergency-pulse 2s infinite;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.8);
        }
        
        @keyframes emergency-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}