import { useState, useEffect, useRef } from 'react';

interface AccelerometerData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

export default function CrashDetection() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [crashDetected, setCrashDetected] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const accelerometerData = useRef<AccelerometerData[]>([]);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Request device motion permissions
    if (typeof DeviceMotionEvent !== 'undefined' && 'requestPermission' in DeviceMotionEvent) {
      (DeviceMotionEvent as any).requestPermission().then((response: string) => {
        if (response === 'granted') {
          startCrashDetection();
        }
      });
    } else {
      // For non-iOS devices, start immediately
      startCrashDetection();
    }

    return () => {
      stopCrashDetection();
    };
  }, []);

  const startCrashDetection = () => {
    if (!window.DeviceMotionEvent) {
      console.log('Device motion not supported');
      return;
    }

    setIsMonitoring(true);

    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      if (!event.accelerationIncludingGravity) return;

      const { x, y, z } = event.accelerationIncludingGravity;
      if (x === null || y === null || z === null) return;

      const accelerationData: AccelerometerData = {
        x: x || 0,
        y: y || 0,
        z: z || 0,
        timestamp: Date.now()
      };

      // Keep last 100 readings (about 10 seconds at 10Hz)
      accelerometerData.current.push(accelerationData);
      if (accelerometerData.current.length > 100) {
        accelerometerData.current.shift();
      }

      // Analyze for crash patterns
      analyzeCrashPattern(accelerationData);
    };

    window.addEventListener('devicemotion', handleDeviceMotion);
  };

  const stopCrashDetection = () => {
    setIsMonitoring(false);
    window.removeEventListener('devicemotion', () => {});
  };

  const analyzeCrashPattern = (currentData: AccelerometerData) => {
    if (accelerometerData.current.length < 10) return;

    // Calculate total acceleration magnitude
    const magnitude = Math.sqrt(
      currentData.x ** 2 + currentData.y ** 2 + currentData.z ** 2
    );

    // Crash detection thresholds (simplified algorithm)
    const CRASH_THRESHOLD = 25; // m/s² - significant impact
    const SUDDEN_STOP_THRESHOLD = 15; // m/s² - sudden deceleration

    // Check for sudden high acceleration (impact)
    if (magnitude > CRASH_THRESHOLD) {
      // Verify with recent data to avoid false positives
      const recentData = accelerometerData.current.slice(-5);
      const avgMagnitude = recentData.reduce((sum, data) => {
        return sum + Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
      }, 0) / recentData.length;

      if (avgMagnitude > SUDDEN_STOP_THRESHOLD) {
        triggerCrashDetection();
      }
    }
  };

  const triggerCrashDetection = () => {
    if (crashDetected) return; // Avoid multiple triggers

    console.log('🚨 CRASH DETECTED - Initiating emergency protocol');
    setCrashDetected(true);
    setCountdown(10); // 10 second countdown

    // Start countdown for auto-emergency call
    countdownInterval.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Auto-call emergency services
          initiateEmergencyCall();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Vibrate device if supported
    if (navigator.vibrate) {
      navigator.vibrate([500, 200, 500, 200, 500]);
    }

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 Accidente Detectado', {
        body: 'Llamando a emergencias en 10 segundos. Toca para cancelar.',
        icon: '/manifest.json',
        tag: 'crash-detection',
        requireInteraction: true
      });
    }
  };

  const initiateEmergencyCall = async () => {
    // Get current location
    const location = await getCurrentLocation();
    
    // Prepare crash report
    const crashReport = {
      type: 'CRASH_DETECTION',
      timestamp: new Date().toISOString(),
      location,
      accelerometerData: accelerometerData.current.slice(-20), // Last 2 seconds
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform
      }
    };

    // Store crash data
    localStorage.setItem('crash_report', JSON.stringify(crashReport));

    // Send to emergency services
    try {
      await fetch('/api/emergency-crash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(crashReport)
      });
    } catch (error) {
      console.error('Failed to send crash report:', error);
    }

    // Make emergency call
    window.location.href = 'tel:911';

    // Reset state
    setCrashDetected(false);
    setCountdown(0);
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

  const cancelEmergencyCall = () => {
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
    }
    setCrashDetected(false);
    setCountdown(0);
  };

  return (
    <>
      {/* Monitoring indicator */}
      {isMonitoring && !crashDetected && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-900 border border-green-500 rounded-full px-3 py-1 text-xs">
            <span className="text-green-400">🛡️ Detección de Accidentes Activa</span>
          </div>
        </div>
      )}

      {/* Crash detection alert */}
      {crashDetected && (
        <div className="fixed inset-0 bg-red-900 bg-opacity-95 z-50 flex items-center justify-center">
          <div className="bg-red-800 border-2 border-red-400 rounded-lg p-8 max-w-sm mx-4 text-center">
            <div className="text-6xl mb-4">🚨</div>
            <h2 className="text-2xl font-bold text-red-100 mb-4">
              ACCIDENTE DETECTADO
            </h2>
            
            <div className="text-red-200 mb-6">
              <div className="text-4xl font-bold mb-2">{countdown}</div>
              <div>Llamando a emergencias automáticamente</div>
            </div>

            <div className="space-y-3">
              <button
                onClick={cancelEmergencyCall}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg"
              >
                ❌ CANCELAR - Estoy bien
              </button>
              
              <button
                onClick={initiateEmergencyCall}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg"
              >
                📞 LLAMAR AHORA
              </button>
            </div>

            <div className="text-xs text-red-300 mt-4">
              Si no respondes, se llamará automáticamente a emergencias
            </div>
          </div>
        </div>
      )}
    </>
  );
}