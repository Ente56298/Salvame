import React, { useState, useEffect } from 'react';
import { useGameification } from '../hooks/useGameification';

interface MapRegion {
  id: string;
  name: string;
  area: string;
  size: string;
  coverage: string;
  priority: 'high' | 'medium' | 'low';
  downloaded: boolean;
  downloading: boolean;
  progress: number;
  lastUpdate: string;
  features: string[];
}

interface OfflineMapData {
  roads: { primary: number; secondary: number; local: number };
  pois: { gas: number; repair: number; hospital: number; police: number };
  traffic: { realTime: boolean; historical: boolean };
  navigation: { routing: boolean; voice: boolean };
}

const OfflineMapDownloader: React.FC = () => {
  const { actions } = useGameification();
  const [regions, setRegions] = useState<MapRegion[]>([
    {
      id: 'cdmx-centro',
      name: 'CDMX Centro',
      area: 'Cuauhtémoc, Miguel Hidalgo, Benito Juárez',
      size: '125 MB',
      coverage: '95% calles mapeadas',
      priority: 'high',
      downloaded: true,
      downloading: false,
      progress: 100,
      lastUpdate: '2025-01-10',
      features: ['Navegación', 'POIs', 'Tráfico histórico', 'Rutas optimizadas']
    },
    {
      id: 'cdmx-norte',
      name: 'CDMX Norte',
      area: 'Gustavo A. Madero, Azcapotzalco, Tlalnepantla',
      size: '89 MB',
      coverage: '92% calles mapeadas',
      priority: 'high',
      downloaded: false,
      downloading: false,
      progress: 0,
      lastUpdate: '2025-01-08',
      features: ['Navegación', 'POIs', 'Talleres verificados']
    },
    {
      id: 'estado-mexico',
      name: 'Estado de México',
      area: 'Naucalpan, Ecatepec, Nezahualcóyotl',
      size: '156 MB',
      coverage: '88% calles mapeadas',
      priority: 'medium',
      downloaded: false,
      downloading: false,
      progress: 0,
      lastUpdate: '2025-01-05',
      features: ['Navegación básica', 'POIs principales']
    },
    {
      id: 'carreteras-federales',
      name: 'Carreteras Federales',
      area: 'México-Puebla, México-Querétaro, México-Cuernavaca',
      size: '67 MB',
      coverage: '100% autopistas',
      priority: 'high',
      downloaded: false,
      downloading: false,
      progress: 0,
      lastUpdate: '2025-01-09',
      features: ['Navegación', 'Casetas', 'Servicios carretera']
    },
    {
      id: 'puebla-centro',
      name: 'Puebla Centro',
      area: 'Centro histórico, Angelópolis, San Andrés Cholula',
      size: '78 MB',
      coverage: '90% calles mapeadas',
      priority: 'low',
      downloaded: false,
      downloading: false,
      progress: 0,
      lastUpdate: '2025-01-07',
      features: ['Navegación', 'POIs turísticos']
    }
  ]);

  const [totalStorage, setTotalStorage] = useState({
    used: 125,
    available: 2048,
    total: 2173
  });

  const downloadRegion = async (regionId: string) => {
    setRegions(prev => prev.map(region => 
      region.id === regionId 
        ? { ...region, downloading: true, progress: 0 }
        : region
    ));

    actions.addXP(30, `Iniciaste descarga: ${regions.find(r => r.id === regionId)?.name}`);

    // Simular descarga progresiva
    const interval = setInterval(() => {
      setRegions(prev => prev.map(region => {
        if (region.id === regionId && region.downloading) {
          const newProgress = Math.min(region.progress + Math.random() * 15, 100);
          
          if (newProgress >= 100) {
            clearInterval(interval);
            actions.addXP(100, `Mapa descargado: ${region.name}`);
            
            // Actualizar storage
            const regionSize = parseInt(region.size);
            setTotalStorage(prev => ({
              ...prev,
              used: prev.used + regionSize
            }));
            
            return {
              ...region,
              downloaded: true,
              downloading: false,
              progress: 100,
              lastUpdate: new Date().toISOString().split('T')[0]
            };
          }
          
          return { ...region, progress: newProgress };
        }
        return region;
      }));
    }, 500);
  };

  const deleteRegion = (regionId: string) => {
    const region = regions.find(r => r.id === regionId);
    if (region && region.downloaded) {
      const regionSize = parseInt(region.size);
      
      setRegions(prev => prev.map(r => 
        r.id === regionId 
          ? { ...r, downloaded: false, progress: 0 }
          : r
      ));
      
      setTotalStorage(prev => ({
        ...prev,
        used: prev.used - regionSize
      }));
      
      actions.addXP(15, `Mapa eliminado: ${region.name}`);
    }
  };

  const getPriorityColor = (priority: MapRegion['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-900/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30';
      case 'low': return 'text-green-400 bg-green-900/30';
    }
  };

  const getStoragePercentage = () => (totalStorage.used / totalStorage.total) * 100;

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🗺️</span>
        <div>
          <h2 className="text-xl font-bold text-white">Descarga de Mapas Offline</h2>
          <p className="text-gray-400">Información precisa sin conexión a internet</p>
        </div>
      </div>

      {/* Storage Overview */}
      <div className="mb-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 p-4 rounded-lg">
        <h3 className="font-bold text-white mb-3">💾 Almacenamiento Local</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{totalStorage.used} MB</div>
            <div className="text-sm text-gray-300">Usado</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{totalStorage.available} MB</div>
            <div className="text-sm text-gray-300">Disponible</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{totalStorage.total} MB</div>
            <div className="text-sm text-gray-300">Total</div>
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-full h-4 mb-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${getStoragePercentage()}%` }}
          />
        </div>
        <div className="text-center text-sm text-gray-300">
          {getStoragePercentage().toFixed(1)}% del almacenamiento utilizado
        </div>
      </div>

      {/* Coordinate Download */}
      <div className="mb-6 bg-gray-700 p-4 rounded-lg">
        <h3 className="font-bold text-white mb-3">📍 Descarga por Coordenadas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Latitud</label>
            <input
              type="number"
              step="0.000001"
              placeholder="19.432608"
              className="w-full bg-gray-600 text-white p-3 rounded border border-gray-500 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Longitud</label>
            <input
              type="number"
              step="0.000001"
              placeholder="-99.133209"
              className="w-full bg-gray-600 text-white p-3 rounded border border-gray-500 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Radio (km)</label>
            <select className="w-full bg-gray-600 text-white p-3 rounded border border-gray-500">
              <option value="5">5 km (15 MB)</option>
              <option value="10">10 km (45 MB)</option>
              <option value="25">25 km (120 MB)</option>
              <option value="50">50 km (280 MB)</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded font-bold">
              📥 Descargar Área
            </button>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm">
            📍 Usar Ubicación Actual
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm">
            🗺️ Seleccionar en Mapa
          </button>
        </div>
      </div>

      {/* Map Regions */}
      <div className="space-y-4 mb-6">
        <h3 className="font-bold text-white mb-4">🌍 Regiones Predefinidas</h3>
        
        {regions.map((region) => (
          <div key={region.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${
                  region.downloaded ? 'bg-green-500' : 
                  region.downloading ? 'bg-yellow-500 animate-pulse' : 
                  'bg-gray-500'
                }`} />
                <div>
                  <h4 className="font-bold text-white text-lg">{region.name}</h4>
                  <p className="text-gray-300 text-sm">{region.area}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(region.priority)}`}>
                  {region.priority.toUpperCase()}
                </span>
                
                {region.downloaded ? (
                  <button
                    onClick={() => deleteRegion(region.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    🗑️ Eliminar
                  </button>
                ) : region.downloading ? (
                  <div className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm">
                    ⏳ Descargando...
                  </div>
                ) : (
                  <button
                    onClick={() => downloadRegion(region.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    📥 Descargar
                  </button>
                )}
              </div>
            </div>
            
            {/* Download Progress */}
            {region.downloading && (
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-300 mb-1">
                  <span>Descargando...</span>
                  <span>{region.progress.toFixed(0)}%</span>
                </div>
                <div className="bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${region.progress}%` }}
                  />
                </div>
              </div>
            )}
            
            {/* Region Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
              <div>
                <span className="text-gray-400">Tamaño:</span>
                <span className="text-white ml-2 font-bold">{region.size}</span>
              </div>
              <div>
                <span className="text-gray-400">Cobertura:</span>
                <span className="text-white ml-2 font-bold">{region.coverage}</span>
              </div>
              <div>
                <span className="text-gray-400">Actualizado:</span>
                <span className="text-white ml-2 font-bold">{region.lastUpdate}</span>
              </div>
              <div>
                <span className="text-gray-400">Estado:</span>
                <span className={`ml-2 font-bold ${
                  region.downloaded ? 'text-green-400' : 
                  region.downloading ? 'text-yellow-400' : 
                  'text-gray-400'
                }`}>
                  {region.downloaded ? 'Descargado' : 
                   region.downloading ? 'Descargando' : 
                   'No descargado'}
                </span>
              </div>
            </div>
            
            {/* Features */}
            <div className="mb-3">
              <h5 className="font-bold text-white text-sm mb-2">✨ Características:</h5>
              <div className="flex flex-wrap gap-2">
                {region.features.map((feature, index) => (
                  <span key={index} className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Offline Features */}
      <div className="mb-6 bg-gray-700 p-4 rounded-lg">
        <h3 className="font-bold text-white mb-3">🔧 Funciones Offline Disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-bold text-cyan-400 mb-2">🗺️ Navegación</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• Rutas optimizadas sin internet</li>
              <li>• Navegación turn-by-turn</li>
              <li>• Recálculo automático de rutas</li>
              <li>• Estimación de tiempo precisa</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-green-400 mb-2">📍 Puntos de Interés</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• Gasolineras y servicios</li>
              <li>• Talleres mecánicos verificados</li>
              <li>• Hospitales y emergencias</li>
              <li>• Hoteles y restaurantes</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-purple-400 mb-2">🚦 Información de Tráfico</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• Patrones históricos de tráfico</li>
              <li>• Horarios de mayor congestión</li>
              <li>• Rutas alternativas sugeridas</li>
              <li>• Estimaciones de tiempo ajustadas</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-yellow-400 mb-2">🔍 Búsqueda Local</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• Búsqueda por nombre o categoría</li>
              <li>• Filtros por distancia</li>
              <li>• Información de contacto</li>
              <li>• Horarios de atención</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Custom Downloads */}
      <div className="mb-6 bg-gray-700 p-4 rounded-lg">
        <h3 className="font-bold text-white mb-3">🎯 Descargas Personalizadas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-gray-600 p-3 rounded">
            <h4 className="font-bold text-cyan-400 mb-2">📍 Área Personalizada</h4>
            <p className="text-gray-300 text-sm mb-2">Centro: 19.4326, -99.1332</p>
            <p className="text-gray-300 text-sm mb-2">Radio: 10 km (45 MB)</p>
            <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded text-sm">
              📥 Descargar
            </button>
          </div>
          <div className="bg-gray-600 p-3 rounded">
            <h4 className="font-bold text-green-400 mb-2">🏠 Mi Ubicación</h4>
            <p className="text-gray-300 text-sm mb-2">Detectando GPS...</p>
            <p className="text-gray-300 text-sm mb-2">Radio: 5 km (15 MB)</p>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm">
              📍 Auto-descargar
            </button>
          </div>
          <div className="bg-gray-600 p-3 rounded">
            <h4 className="font-bold text-purple-400 mb-2">🛣️ Ruta Planificada</h4>
            <p className="text-gray-300 text-sm mb-2">CDMX → Puebla</p>
            <p className="text-gray-300 text-sm mb-2">Corredor: 25 km (120 MB)</p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm">
              🛣️ Descargar Ruta
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => {
            regions.filter(r => !r.downloaded && !r.downloading && r.priority === 'high')
              .forEach(r => downloadRegion(r.id));
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span>⚡</span>
          <span>Descargar Prioritarios</span>
        </button>
        
        <button
          onClick={() => {
            regions.filter(r => r.downloaded).forEach(r => deleteRegion(r.id));
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span>🗑️</span>
          <span>Limpiar Todo</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-green-400">
            {regions.filter(r => r.downloaded).length}
          </div>
          <div className="text-sm text-gray-300">Descargados</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-blue-400">
            {regions.length}
          </div>
          <div className="text-sm text-gray-300">Disponibles</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-purple-400">
            {totalStorage.used}MB
          </div>
          <div className="text-sm text-gray-300">Almacenado</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {regions.filter(r => r.priority === 'high').length}
          </div>
          <div className="text-sm text-gray-300">Prioritarios</div>
        </div>
      </div>
    </div>
  );
};

export default OfflineMapDownloader;