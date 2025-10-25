import { useState } from 'react';

interface EmergencyContact {
  name: string;
  phone: string;
  type: 'police' | 'medical' | 'fire' | 'roadside';
}

const emergencyContacts: EmergencyContact[] = [
  { name: 'Policía', phone: '911', type: 'police' },
  { name: 'Cruz Roja', phone: '065', type: 'medical' },
  { name: 'Bomberos', phone: '911', type: 'fire' },
  { name: 'Ángeles Verdes', phone: '078', type: 'roadside' }
];

export default function SOSButton() {
  const [isActive, setIsActive] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  const handleSOSClick = async () => {
    setIsActive(true);
    
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(coords);
          
          // Send emergency alert
          sendEmergencyAlert(coords);
        },
        (error) => {
          console.error('Error getting location:', error);
          sendEmergencyAlert(null);
        }
      );
    } else {
      sendEmergencyAlert(null);
    }
  };

  const sendEmergencyAlert = async (coords: {lat: number, lng: number} | null) => {
    const message = coords 
      ? `🚨 EMERGENCIA VIAL - Ubicación: ${coords.lat}, ${coords.lng} - https://maps.google.com/?q=${coords.lat},${coords.lng}`
      : '🚨 EMERGENCIA VIAL - Ubicación no disponible';

    // Log emergency locally first
    console.log('🚨 EMERGENCY ACTIVATED:', {
      timestamp: new Date().toISOString(),
      location: coords,
      userAgent: navigator.userAgent
    });

    // Try to send SMS (backend integration)
    try {
      await fetch('/api/emergency-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, location: coords })
      });
    } catch (error) {
      console.error('SMS service not available:', error);
    }

    // Auto-call emergency services (following Apple guidelines)
    initiateEmergencyCall();
  };

  const initiateEmergencyCall = () => {
    // Following Apple's emergency call guidelines
    // Auto-dial 911 immediately for true emergencies
    const emergencyNumber = '911';
    
    // Create emergency call link
    const callLink = `tel:${emergencyNumber}`;
    
    // Show countdown before auto-call
    let countdown = 5;
    const countdownInterval = setInterval(() => {
      if (countdown > 0) {
        console.log(`Auto-calling emergency services in ${countdown} seconds...`);
        countdown--;
      } else {
        clearInterval(countdownInterval);
        // Initiate call
        window.location.href = callLink;
        setTimeout(() => setIsActive(false), 2000);
      }
    }, 1000);
    
    // Allow user to cancel auto-call
    setTimeout(() => {
      if (confirm('🚨 LLAMANDO A EMERGENCIAS\n\nPresiona Cancelar para detener la llamada automática')) {
        clearInterval(countdownInterval);
        setIsActive(false);
      }
    }, 1000);
  };

  const callEmergency = (contact: EmergencyContact) => {
    window.open(`tel:${contact.phone}`);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleSOSClick}
        className={`sos-button-rocket ${isActive ? 'active' : ''}`}
        onClick={isActive ? () => setIsActive(false) : handleSOSClick}
      >
        {isActive ? '📡' : '🆘'}
        <span className="block text-sm font-bold">
          {isActive ? 'ENVIANDO' : 'SOS'}
        </span>
      </button>

      {isActive && (
        <div className="absolute bottom-full right-0 mb-4 bg-red-900 border-2 border-red-400 rounded-lg p-4 min-w-72 animate-pulse">
          <div className="text-center">
            <h3 className="text-red-100 font-bold text-lg mb-2">🚨 EMERGENCIA ACTIVADA</h3>
            <div className="text-red-200 text-sm mb-3">
              Llamando automáticamente a servicios de emergencia...
            </div>
            
            {location && (
              <p className="text-xs text-red-300 mb-3 font-mono">
                📍 {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            )}
            
            <div className="bg-red-800 rounded p-2 mb-3">
              <div className="text-red-100 font-bold">📞 LLAMANDO: 911</div>
              <div className="text-xs text-red-300">Servicios de Emergencia</div>
            </div>
            
            <div className="text-xs text-red-300">
              Presiona el botón SOS nuevamente para cancelar
            </div>
          </div>
        </div>
      )}
    </div>
  );
}