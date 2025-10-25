import { useEffect, useState } from 'react';

export default function EmergencySync() {
  const [pendingEmergencies, setPendingEmergencies] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Monitor network status
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingEmergencies();
    };
    
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for pending emergencies on load
    checkPendingEmergencies();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkPendingEmergencies = () => {
    const pending = localStorage.getItem('pending_emergency_alert');
    const satellite = localStorage.getItem('satellite_emergency_queue');
    
    const emergencies = [];
    if (pending) emergencies.push(JSON.parse(pending));
    if (satellite) emergencies.push(JSON.parse(satellite));
    
    setPendingEmergencies(emergencies);
  };

  const syncPendingEmergencies = async () => {
    const pending = localStorage.getItem('pending_emergency_alert');
    const satellite = localStorage.getItem('satellite_emergency_queue');

    if (pending) {
      try {
        const emergencyData = JSON.parse(pending);
        
        await fetch('/api/emergency-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...emergencyData,
            delayed: true,
            syncedAt: new Date().toISOString()
          })
        });

        localStorage.removeItem('pending_emergency_alert');
        
        // Show success notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('✅ Emergencia Sincronizada', {
            body: 'Los datos de emergencia se enviaron exitosamente',
            icon: '/manifest.json'
          });
        }
        
      } catch (error) {
        console.error('Failed to sync emergency:', error);
      }
    }

    if (satellite) {
      try {
        const satelliteData = JSON.parse(satellite);
        
        // Simulate satellite sync
        console.log('📡 Syncing satellite emergency data:', satelliteData);
        
        localStorage.removeItem('satellite_emergency_queue');
        
      } catch (error) {
        console.error('Failed to sync satellite data:', error);
      }
    }

    checkPendingEmergencies();
  };

  if (!pendingEmergencies.length) return null;

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-orange-900 border border-orange-500 rounded-lg p-3 max-w-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-orange-400">⚠️</span>
          <span className="text-orange-100 font-semibold text-sm">
            Emergencias Pendientes
          </span>
        </div>
        
        <div className="text-xs text-orange-200">
          {pendingEmergencies.length} alerta(s) esperando conexión
        </div>
        
        {isOnline && (
          <div className="mt-2">
            <button
              onClick={syncPendingEmergencies}
              className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1 rounded"
            >
              Sincronizar Ahora
            </button>
          </div>
        )}
        
        {!isOnline && (
          <div className="text-xs text-orange-300 mt-1">
            📡 Esperando conexión...
          </div>
        )}
      </div>
    </div>
  );
}