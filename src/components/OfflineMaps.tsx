import { useState, useEffect } from 'react';

interface OfflineMap {
  id: string;
  name: string;
  area: string;
  size: string;
  downloadDate: string;
  coordinates: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export default function OfflineMaps() {
  const [offlineMaps, setOfflineMaps] = useState<OfflineMap[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showDownloadForm, setShowDownloadForm] = useState(false);
  const [mapName, setMapName] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  useEffect(() => {
    // Load offline maps from localStorage
    const saved = localStorage.getItem('offline_maps');
    if (saved) {
      setOfflineMaps(JSON.parse(saved));
    }
  }, []);

  const popularAreas = [
    { name: 'Ciudad de México Centro', coords: { north: 19.4978, south: 19.3895, east: -99.1013, west: -99.2036 } },
    { name: 'Polanco - Santa Fe', coords: { north: 19.4500, south: 19.4000, east: -99.1500, west: -99.2200 } },
    { name: 'Zona Rosa - Condesa', coords: { north: 19.4300, south: 19.4000, east: -99.1500, west: -99.1800 } },
    { name: 'Aeropuerto CDMX', coords: { north: 19.4500, south: 19.4200, east: -99.0500, west: -99.1200 } },
    { name: 'Carretera México-Toluca', coords: { north: 19.4000, south: 19.2000, east: -99.2000, west: -99.6000 } },
    { name: 'Carretera México-Puebla', coords: { north: 19.4000, south: 19.0000, east: -98.8000, west: -99.1000 } }
  ];

  const downloadOfflineMap = async (area: any) => {
    setIsDownloading(true);
    setDownloadProgress(0);

    // Simulate download process
    const downloadInterval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(downloadInterval);
          completeDownload(area);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const completeDownload = (area: any) => {
    const newMap: OfflineMap = {
      id: `map-${Date.now()}`,
      name: mapName || area.name,
      area: area.name,
      size: `${Math.floor(Math.random() * 50 + 10)} MB`,
      downloadDate: new Date().toLocaleDateString(),
      coordinates: area.coords
    };

    const updatedMaps = [...offlineMaps, newMap];
    setOfflineMaps(updatedMaps);
    localStorage.setItem('offline_maps', JSON.stringify(updatedMaps));

    // Store map data for offline use (simplified)
    localStorage.setItem(`offline_map_${newMap.id}`, JSON.stringify({
      ...newMap,
      tiles: `Cached tiles for ${area.name}`,
      roads: `Road data for ${area.name}`,
      pois: `Points of interest for ${area.name}`
    }));

    setIsDownloading(false);
    setDownloadProgress(0);
    setShowDownloadForm(false);
    setMapName('');
    setSelectedArea('');

    // Show success notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('📱 Mapa Descargado', {
        body: `${newMap.name} está disponible offline`,
        icon: '/manifest.json'
      });
    }
  };

  const deleteOfflineMap = (mapId: string) => {
    const updatedMaps = offlineMaps.filter(map => map.id !== mapId);
    setOfflineMaps(updatedMaps);
    localStorage.setItem('offline_maps', JSON.stringify(updatedMaps));
    localStorage.removeItem(`offline_map_${mapId}`);
  };

  const openOfflineMap = (map: OfflineMap) => {
    // In a real implementation, this would open the offline map viewer
    const centerLat = (map.coordinates.north + map.coordinates.south) / 2;
    const centerLng = (map.coordinates.east + map.coordinates.west) / 2;
    
    // For now, open in Google Maps (online)
    window.open(`https://maps.google.com/?q=${centerLat},${centerLng}&z=12`);
  };

  const getTotalSize = () => {
    return offlineMaps.reduce((total, map) => {
      const size = parseInt(map.size.replace(' MB', ''));
      return total + size;
    }, 0);
  };

  if (showDownloadForm) {
    return (
      <div className="rocket-card p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Descargar Mapa Offline</h3>
          <button 
            onClick={() => setShowDownloadForm(false)}
            className="text-gray-400 hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        {isDownloading ? (
          <div className="text-center">
            <div className="text-2xl mb-2">📥</div>
            <div className="text-sm text-gray-400 mb-2">Descargando mapa...</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-400">{Math.floor(downloadProgress)}%</div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Nombre del Mapa (opcional)</label>
              <input
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
                placeholder="Mi mapa personalizado"
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Área a Descargar</label>
              <div className="space-y-2">
                {popularAreas.map(area => (
                  <button
                    key={area.name}
                    onClick={() => downloadOfflineMap(area)}
                    className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded"
                  >
                    <div className="font-semibold">{area.name}</div>
                    <div className="text-xs text-gray-400">
                      ~{Math.floor(Math.random() * 40 + 10)} MB
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-900 border border-blue-500 rounded p-3 text-xs">
              💡 Los mapas offline te permiten navegar sin conexión a internet. 
              Útil para áreas remotas o emergencias.
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rocket-card p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Mapas Offline</h3>
        <button 
          onClick={() => setShowDownloadForm(true)}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          📥 Descargar
        </button>
      </div>

      {offlineMaps.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🗺️</div>
          <div className="text-gray-400 mb-4">No hay mapas offline descargados</div>
          <button
            onClick={() => setShowDownloadForm(true)}
            className="rocket-button"
          >
            📥 Descargar Primer Mapa
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-xs text-gray-400 mb-3">
            {offlineMaps.length} mapa(s) • {getTotalSize()} MB total
          </div>

          {offlineMaps.map(map => (
            <div key={map.id} className="bg-gray-800 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold">{map.name}</div>
                  <div className="text-xs text-gray-400">{map.area}</div>
                </div>
                <div className="text-xs text-gray-400">{map.size}</div>
              </div>
              
              <div className="text-xs text-gray-500 mb-3">
                Descargado: {map.downloadDate}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => openOfflineMap(map)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm"
                >
                  🗺️ Abrir Mapa
                </button>
                <button
                  onClick={() => deleteOfflineMap(map.id)}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 bg-orange-900 border border-orange-500 rounded p-2 text-xs">
        ⚠️ Los mapas offline consumen espacio de almacenamiento. 
        Actualiza regularmente para tener la información más reciente.
      </div>
    </div>
  );
}