import React, { useState, useEffect } from 'react';
import { useGameification } from '../hooks/useGameification';

interface OfflineData {
  maps: { size: string; coverage: string; lastUpdate: string };
  contacts: { count: number; synced: boolean };
  history: { trips: number; size: string };
  cache: { size: string; items: number };
}

const OfflineMode: React.FC = () => {
  const { actions } = useGameification();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [offlineData, setOfflineData] = useState<OfflineData>({
    maps: { size: '45.2 MB', coverage: 'CDMX + Estado de México', lastUpdate: '2025-01-11' },
    contacts: { count: 3, synced: true },
    history: { trips: 127, size: '2.1 MB' },
    cache: { size: '12.8 MB', items: 1247 }
  });
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const downloadOfflineData = () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    actions.addXP(30, 'Iniciaste descarga offline');

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          actions.addXP(50, 'Datos offline descargados');
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  const clearOfflineData = () => {
    setOfflineData({
      maps: { size: '0 MB', coverage: 'Sin datos', lastUpdate: 'Nunca' },
      contacts: { count: 0, synced: false },
      history: { trips: 0, size: '0 MB' },
      cache: { size: '0 MB', items: 0 }
    });
    actions.addXP(15, 'Datos offline limpiados');
  };

  const getConnectionStatus = () => {
    if (isOffline) return { text: 'Sin conexión', color: 'text-red-400', icon: '📴' };
    return { text: 'Conectado', color: 'text-green-400', icon: '🌐' };
  };

  const status = getConnectionStatus();

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">📴</span>
        <div>
          <h2 className="text-xl font-bold text-white">Modo Offline</h2>
          <p className="text-gray-400">Funcionalidad sin conexión a internet</p>
        </div>
      </div>

      {/* Connection Status */}
      <div className={`mb-6 p-4 rounded-lg border ${
        isOffline ? 'bg-red-900/30 border-red-500/30' : 'bg-green-900/30 border-green-500/30'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{status.icon}</span>
          <div>
            <h3 className="font-bold text-white">Estado de Conexión</h3>
            <p className={`${status.color} font-bold`}>{status.text}</p>
          </div>
        </div>
      </div>

      {/* Offline Features */}
      <div className="mb-6">
        <h3 className="font-bold text-white mb-4">🔧 Funciones Offline Disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🚨</span>
              <div>
                <h4 className="font-bold text-white">SOS de Emergencia</h4>
                <p className="text-sm text-gray-300">Funciona sin internet</p>
              </div>
            </div>
            <div className="text-xs text-green-400">✅ Siempre disponible</div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">📞</span>
              <div>
                <h4 className="font-bold text-white">Contactos de Emergencia</h4>
                <p className="text-sm text-gray-300">Llamadas directas</p>
              </div>
            </div>
            <div className="text-xs text-green-400">✅ {offlineData.contacts.count} contactos</div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🗺️</span>
              <div>
                <h4 className="font-bold text-white">Mapas Offline</h4>
                <p className="text-sm text-gray-300">Navegación básica</p>
              </div>
            </div>
            <div className="text-xs text-yellow-400">⚠️ Requiere descarga</div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">📜</span>
              <div>
                <h4 className="font-bold text-white">Historial de Viajes</h4>
                <p className="text-sm text-gray-300">Datos guardados</p>
              </div>
            </div>
            <div className="text-xs text-green-400">✅ {offlineData.history.trips} viajes</div>
          </div>
        </div>
      </div>

      {/* Offline Data Management */}
      <div className="mb-6">
        <h3 className="font-bold text-white mb-4">💾 Gestión de Datos Offline</h3>
        
        {/* Download Progress */}
        {isDownloading && (
          <div className="mb-4 bg-blue-900/30 border border-blue-500/30 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"></div>
              <div>
                <h4 className="font-bold text-white">Descargando datos offline...</h4>
                <p className="text-blue-300 text-sm">{downloadProgress.toFixed(0)}% completado</p>
              </div>
            </div>
            <div className="bg-gray-600 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="font-bold text-white mb-3">🗺️ Mapas Offline</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Tamaño:</span>
                <span className="text-white">{offlineData.maps.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Cobertura:</span>
                <span className="text-white">{offlineData.maps.coverage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Actualizado:</span>
                <span className="text-white">{offlineData.maps.lastUpdate}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="font-bold text-white mb-3">💾 Cache Local</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Tamaño:</span>
                <span className="text-white">{offlineData.cache.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Elementos:</span>
                <span className="text-white">{offlineData.cache.items}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Historial:</span>
                <span className="text-white">{offlineData.history.size}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={downloadOfflineData}
            disabled={isDownloading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <span>📥</span>
            <span>{isDownloading ? 'Descargando...' : 'Descargar Datos'}</span>
          </button>
          
          <button
            onClick={clearOfflineData}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <span>🗑️</span>
            <span>Limpiar Cache</span>
          </button>
        </div>
      </div>

      {/* Offline Tips */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="font-bold text-white mb-3">💡 Consejos para Modo Offline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <h4 className="font-bold text-white mb-2">📱 Preparación</h4>
            <ul className="space-y-1">
              <li>• Descarga mapas antes de viajar</li>
              <li>• Sincroniza contactos de emergencia</li>
              <li>• Guarda rutas frecuentes</li>
              <li>• Mantén batería cargada</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">🚨 En Emergencias</h4>
            <ul className="space-y-1">
              <li>• SOS funciona sin internet</li>
              <li>• Usa llamadas directas</li>
              <li>• GPS básico disponible</li>
              <li>• Historial accesible</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-blue-400">
            {offlineData.maps.size}
          </div>
          <div className="text-sm text-gray-300">Mapas</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-green-400">
            {offlineData.contacts.count}
          </div>
          <div className="text-sm text-gray-300">Contactos</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-purple-400">
            {offlineData.history.trips}
          </div>
          <div className="text-sm text-gray-300">Viajes</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {isOffline ? '📴' : '🌐'}
          </div>
          <div className="text-sm text-gray-300">Estado</div>
        </div>
      </div>
    </div>
  );
};

export default OfflineMode;