import React, { useState, useEffect } from 'react';
import { offlineMapService, MapRegion } from '../services/offlineMapService';

interface OfflineMapPanelProps {
  onClose: () => void;
  currentLocation: { lat: number; lng: number } | null;
}

const OfflineMapPanel: React.FC<OfflineMapPanelProps> = ({ onClose, currentLocation }) => {
  const [regions, setRegions] = useState<MapRegion[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadRegions();
  }, []);

  const loadRegions = async () => {
    try {
      const downloadedRegions = await offlineMapService.getDownloadedRegions();
      setRegions(downloadedRegions);
    } catch (error) {
      console.error('Error loading regions:', error);
    }
  };

  const downloadCurrentArea = async () => {
    if (!currentLocation) {
      alert('Ubicación no disponible');
      return;
    }

    const regionName = prompt('Nombre para esta región:') || 'Mi área';
    const region: MapRegion = {
      id: Date.now().toString(),
      name: regionName,
      bounds: {
        north: currentLocation.lat + 0.01,
        south: currentLocation.lat - 0.01,
        east: currentLocation.lng + 0.01,
        west: currentLocation.lng - 0.01
      },
      zoomLevels: [10, 11, 12, 13, 14, 15],
      downloadedAt: new Date(),
      size: 0
    };

    setDownloading(region.id);
    setProgress(0);

    try {
      await offlineMapService.downloadRegion(region, (p) => {
        setProgress(Math.round(p * 100));
      });
      
      await loadRegions();
      alert('Región descargada exitosamente');
    } catch (error) {
      console.error('Error downloading region:', error);
      alert('Error al descargar la región');
    } finally {
      setDownloading(null);
      setProgress(0);
    }
  };

  const deleteRegion = async (regionId: string) => {
    if (!confirm('¿Eliminar esta región descargada?')) return;

    try {
      await offlineMapService.deleteRegion(regionId);
      await loadRegions();
    } catch (error) {
      console.error('Error deleting region:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Mapas Offline</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={downloadCurrentArea}
            disabled={downloading !== null || !currentLocation}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded"
          >
            {downloading ? `Descargando... ${progress}%` : 'Descargar área actual'}
          </button>

          {downloading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Regiones descargadas:</h3>
            {regions.length === 0 ? (
              <p className="text-gray-500 text-sm">No hay regiones descargadas</p>
            ) : (
              <div className="space-y-2">
                {regions.map(region => (
                  <div key={region.id} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
                    <div>
                      <div className="font-medium">{region.name}</div>
                      <div className="text-sm text-gray-500">
                        {region.size} MB • {new Date(region.downloadedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteRegion(region.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineMapPanel;