import { useState, useEffect, useRef } from 'react';

interface SafetyCheckSession {
  id: string;
  reason: string;
  duration: number; // in minutes
  startTime: number;
  endTime: number;
  isActive: boolean;
}

export default function SafetyCheck() {
  const [activeSession, setActiveSession] = useState<SafetyCheckSession | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState(60); // default 1 hour
  const [timeRemaining, setTimeRemaining] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check for active session on load
    const saved = localStorage.getItem('active_safety_check');
    if (saved) {
      const session = JSON.parse(saved);
      const now = Date.now();
      
      if (session.endTime > now) {
        setActiveSession(session);
        setTimeRemaining(Math.floor((session.endTime - now) / 1000));
        startCountdown();
      } else {
        // Session expired, trigger emergency
        triggerEmergencyAlert(session);
      }
    }
  }, []);

  const startCountdown = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 60) {
          // Last minute warning
          showWarningNotification();
        }
        
        if (prev <= 0) {
          // Time's up - trigger emergency
          const session = JSON.parse(localStorage.getItem('active_safety_check') || '{}');
          triggerEmergencyAlert(session);
          return 0;
        }
        
        return prev - 1;
      });
    }, 1000);
  };

  const startSafetyCheck = () => {
    const now = Date.now();
    const session: SafetyCheckSession = {
      id: `safety-${now}`,
      reason,
      duration,
      startTime: now,
      endTime: now + (duration * 60 * 1000),
      isActive: true
    };

    setActiveSession(session);
    setTimeRemaining(duration * 60);
    localStorage.setItem('active_safety_check', JSON.stringify(session));
    
    startCountdown();
    setShowSetup(false);

    // Show confirmation notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🛡️ Safety Check Activado', {
        body: `Te contactaremos en ${duration} minutos si no confirmas que estás bien`,
        icon: '/manifest.json'
      });
    }
  };

  const confirmSafety = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    setActiveSession(null);
    setTimeRemaining(0);
    localStorage.removeItem('active_safety_check');

    // Show confirmation
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('✅ Safety Check Completado', {
        body: 'Has confirmado que estás seguro',
        icon: '/manifest.json'
      });
    }
  };

  const extendTime = (minutes: number) => {
    if (!activeSession) return;

    const newEndTime = activeSession.endTime + (minutes * 60 * 1000);
    const updatedSession = { ...activeSession, endTime: newEndTime };
    
    setActiveSession(updatedSession);
    setTimeRemaining(prev => prev + (minutes * 60));
    localStorage.setItem('active_safety_check', JSON.stringify(updatedSession));
  };

  const showWarningNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('⚠️ Safety Check - Último Minuto', {
        body: 'Confirma que estás bien o se activará la alerta de emergencia',
        icon: '/manifest.json',
        requireInteraction: true
      });
    }

    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  };

  const triggerEmergencyAlert = async (session: SafetyCheckSession) => {
    console.log('🚨 SAFETY CHECK EMERGENCY TRIGGERED');
    
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    // Get current location
    const location = await getCurrentLocation();
    
    // Prepare emergency data
    const emergencyData = {
      type: 'SAFETY_CHECK_TIMEOUT',
      session,
      location,
      timestamp: new Date().toISOString(),
      message: `Safety Check expirado: ${session.reason}`
    };

    // Store emergency data
    localStorage.setItem('safety_check_emergency', JSON.stringify(emergencyData));

    // Send to emergency contacts
    try {
      await fetch('/api/emergency-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `🚨 ALERTA SAFETY CHECK\n\nActividad: ${session.reason}\nTiempo expirado: ${new Date().toLocaleString()}\nUbicación: ${location ? `${location.lat}, ${location.lng}` : 'No disponible'}\n\nContactar inmediatamente.`,
          location,
          type: 'safety_check_alert'
        })
      });
    } catch (error) {
      console.error('Failed to send safety check alert:', error);
    }

    // Call emergency services
    if (confirm('🚨 SAFETY CHECK EXPIRADO\n\n¿Llamar a servicios de emergencia?')) {
      window.location.href = 'tel:911';
    }

    // Clean up
    setActiveSession(null);
    setTimeRemaining(0);
    localStorage.removeItem('active_safety_check');
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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (activeSession) {
    return (
      <div className="rocket-card p-4">
        <div className="text-center">
          <h3 className="font-semibold mb-2">🛡️ Safety Check Activo</h3>
          <div className="text-sm text-gray-400 mb-4">{activeSession.reason}</div>
          
          <div className={`text-4xl font-bold mb-4 ${timeRemaining <= 60 ? 'text-red-400 animate-pulse' : 'text-green-400'}`}>
            {formatTime(timeRemaining)}
          </div>
          
          <div className="space-y-2">
            <button
              onClick={confirmSafety}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg"
            >
              ✅ Estoy Bien
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={() => extendTime(15)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm"
              >
                +15 min
              </button>
              <button
                onClick={() => extendTime(30)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm"
              >
                +30 min
              </button>
              <button
                onClick={() => extendTime(60)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm"
              >
                +1 hora
              </button>
            </div>
          </div>
          
          {timeRemaining <= 60 && (
            <div className="mt-4 bg-red-900 border border-red-500 rounded p-2 text-red-200 text-xs">
              ⚠️ ÚLTIMO MINUTO - Confirma que estás bien o se activará la alerta de emergencia
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <div className="rocket-card p-4">
        <h3 className="font-semibold mb-4">Configurar Safety Check</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Actividad/Razón</label>
            <select 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
            >
              <option value="">Seleccionar actividad</option>
              <option value="Senderismo">Senderismo</option>
              <option value="Ciclismo">Ciclismo</option>
              <option value="Viaje por carretera">Viaje por carretera</option>
              <option value="Trabajo nocturno">Trabajo nocturno</option>
              <option value="Cita médica">Cita médica</option>
              <option value="Actividad de riesgo">Actividad de riesgo</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">Duración (minutos)</label>
            <select 
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
            >
              <option value={30}>30 minutos</option>
              <option value={60}>1 hora</option>
              <option value={120}>2 horas</option>
              <option value={180}>3 horas</option>
              <option value={240}>4 horas</option>
              <option value={480}>8 horas</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={startSafetyCheck}
              disabled={!reason}
              className="flex-1 rocket-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🛡️ Iniciar Safety Check
            </button>
            <button
              onClick={() => setShowSetup(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rocket-card p-4">
      <h3 className="font-semibold mb-2">Safety Check</h3>
      <p className="text-gray-400 text-sm mb-4">
        Configura un temporizador de seguridad. Si no confirmas que estás bien, 
        se alertará automáticamente a tus contactos de emergencia.
      </p>
      
      <button
        onClick={() => setShowSetup(true)}
        className="rocket-button w-full"
      >
        🛡️ Configurar Safety Check
      </button>
    </div>
  );
}