import React, { useState, useEffect } from 'react';
import { useGameification } from '../hooks/useGameification';

interface NetworkPoint {
  id: string;
  name: string;
  type: 'wifi' | 'cellular' | 'bluetooth';
  signal: number; // 0-100
  security: 'open' | 'wep' | 'wpa' | 'wpa2' | 'wpa3';
  frequency: string; // 2.4GHz, 5GHz, etc
  channel: number;
  distance: number; // meters
  isConnected: boolean;
}

const NetworkScanner: React.FC = () => {
  const { actions } = useGameification();
  const [networks, setNetworks] = useState<NetworkPoint[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkPoint | null>(null);

  useEffect(() => {
    startScan();
  }, []);

  const startScan = () => {
    setIsScanning(true);
    actions.addXP(20, 'Iniciaste escaneo de redes');

    // Simular escaneo de redes
    setTimeout(() => {
      const mockNetworks: NetworkPoint[] = [
        {
          id: '1',
          name: 'INFINITUM_2.4G',
          type: 'wifi',
          signal: 85,
          security: 'wpa2',
          frequency: '2.4GHz',
          channel: 6,
          distance: 15,
          isConnected: true
        },
        {
          id: '2',
          name: 'Telcel_4G',
          type: 'cellular',
          signal: 92,
          security: 'wpa3',
          frequency: '1800MHz',
          channel: 1,
          distance: 200,
          isConnected: false
        },
        {
          id: '3',
          name: 'iPhone_Jorge',
          type: 'bluetooth',
          signal: 78,
          security: 'open',
          frequency: '2.4GHz',
          channel: 0,
          distance: 5,
          isConnected: false
        },
        {
          id: '4',
          name: 'STARBUCKS_WiFi',
          type: 'wifi',
          signal: 65,
          security: 'open',
          frequency: '5GHz',
          channel: 36,
          distance: 25,
          isConnected: false
        },
        {
          id: '5',
          name: 'AT&T_5G',
          type: 'cellular',
          signal: 88,
          security: 'wpa3',
          frequency: '3500MHz',
          channel: 2,
          distance: 150,
          isConnected: false
        }
      ];

      setNetworks(mockNetworks);
      setIsScanning(false);
    }, 3000);

    // Actualizar señales cada 5 segundos
    const interval = setInterval(() => {
      setNetworks(prev => prev.map(network => ({
        ...network,
        signal: Math.max(10, Math.min(100, network.signal + (Math.random() - 0.5) * 10))
      })));
    }, 5000);

    return () => clearInterval(interval);
  };

  const getNetworkIcon = (type: NetworkPoint['type']) => {
    switch (type) {
      case 'wifi': return '📶';
      case 'cellular': return '📱';
      case 'bluetooth': return '🔵';
    }
  };

  const getSignalColor = (signal: number) => {
    if (signal >= 80) return 'text-green-400';
    if (signal >= 60) return 'text-yellow-400';
    if (signal >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getSecurityIcon = (security: NetworkPoint['security']) => {
    switch (security) {
      case 'open': return '🔓';
      case 'wep': return '🔒';
      case 'wpa': return '🔐';
      case 'wpa2': return '🛡️';
      case 'wpa3': return '🔰';
    }
  };

  const handleConnect = (network: NetworkPoint) => {
    setSelectedNetwork(network);
    // Simular conexión
    setTimeout(() => {
      setNetworks(prev => prev.map(n => ({
        ...n,
        isConnected: n.id === network.id ? true : (n.type === network.type ? false : n.isConnected)
      })));
      actions.addXP(25, `Conectado a ${network.name}`);
      setSelectedNetwork(null);
    }, 2000);
  };

  const getNetworkTypeColor = (type: NetworkPoint['type']) => {
    switch (type) {
      case 'wifi': return 'bg-blue-600';
      case 'cellular': return 'bg-green-600';
      case 'bluetooth': return 'bg-purple-600';
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🌐</span>
        <div>
          <h2 className="text-xl font-bold text-white">Escáner de Redes</h2>
          <p className="text-gray-400">Puntos de acceso y conectividad disponible</p>
        </div>
      </div>

      {/* Scan Controls */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={startScan}
          disabled={isScanning}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          {isScanning ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Escaneando...</span>
            </>
          ) : (
            <>
              <span>🔍</span>
              <span>Escanear Redes</span>
            </>
          )}
        </button>

        <div className="text-sm text-gray-400">
          {networks.length} redes encontradas
        </div>
      </div>

      {/* Networks List */}
      <div className="space-y-4">
        {networks.map((network) => (
          <div key={network.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getNetworkIcon(network.type)}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white">{network.name}</h4>
                    {network.isConnected && (
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                        Conectado
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className={getNetworkTypeColor(network.type) + ' text-white px-2 py-1 rounded text-xs'}>
                      {network.type.toUpperCase()}
                    </span>
                    <span>{getSecurityIcon(network.security)} {network.security.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className={`text-lg font-bold ${getSignalColor(network.signal)}`}>
                    {network.signal}%
                  </div>
                  <div className="text-xs text-gray-400">{network.distance}m</div>
                </div>

                {!network.isConnected && network.type !== 'cellular' && (
                  <button
                    onClick={() => handleConnect(network)}
                    disabled={selectedNetwork?.id === network.id}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm"
                  >
                    {selectedNetwork?.id === network.id ? 'Conectando...' : 'Conectar'}
                  </button>
                )}
              </div>
            </div>

            {/* Signal Strength Bar */}
            <div className="mb-3">
              <div className="bg-gray-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    network.signal >= 80 ? 'bg-green-500' :
                    network.signal >= 60 ? 'bg-yellow-500' :
                    network.signal >= 40 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${network.signal}%` }}
                />
              </div>
            </div>

            {/* Network Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-white font-bold">{network.frequency}</div>
                <div className="text-gray-400">Frecuencia</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold">
                  {network.type === 'bluetooth' ? 'N/A' : `Ch ${network.channel}`}
                </div>
                <div className="text-gray-400">Canal</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold">{network.distance}m</div>
                <div className="text-gray-400">Distancia</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold">
                  {getSecurityIcon(network.security)}
                </div>
                <div className="text-gray-400">Seguridad</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Network Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-blue-400">
            {networks.filter(n => n.type === 'wifi').length}
          </div>
          <div className="text-sm text-gray-300">WiFi</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-green-400">
            {networks.filter(n => n.type === 'cellular').length}
          </div>
          <div className="text-sm text-gray-300">Cellular</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-purple-400">
            {networks.filter(n => n.type === 'bluetooth').length}
          </div>
          <div className="text-sm text-gray-300">Bluetooth</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {networks.filter(n => n.isConnected).length}
          </div>
          <div className="text-sm text-gray-300">Conectadas</div>
        </div>
      </div>

      {/* Connection Tips */}
      <div className="mt-6 bg-gray-700 p-4 rounded-lg">
        <h3 className="font-bold text-white mb-3">💡 Consejos de Conectividad</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <h4 className="font-bold text-white mb-1">📶 WiFi</h4>
            <p>Busca redes abiertas en lugares públicos. Señal &gt;60% para buena conexión.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">📱 Cellular</h4>
            <p>5G ofrece mejor velocidad. 4G es más estable en movimiento.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">🔵 Bluetooth</h4>
            <p>Ideal para compartir internet desde otro dispositivo cercano.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">🔒 Seguridad</h4>
            <p>Evita redes abiertas para datos sensibles. WPA3 es más seguro.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkScanner;