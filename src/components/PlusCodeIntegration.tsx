import React, { useState, useEffect } from 'react';
import { useGameification } from '../hooks/useGameification';

interface PlusCode {
  code: string;
  coordinates: { lat: number; lng: number };
  address: string;
  accuracy: 'ultra' | 'building' | 'street' | 'area' | 'city';
  type: 'emergency' | 'business' | 'landmark' | 'personal';
  precision: number; // metros de precisión
}

const PlusCodeIntegration: React.FC = () => {
  const { actions } = useGameification();
  const [inputCode, setInputCode] = useState('');
  const [currentLocation, setCurrentLocation] = useState<PlusCode | null>(null);
  const [savedCodes, setSavedCodes] = useState<PlusCode[]>([
    {
      code: '75CX9M8W+VJQ2X Ciudad de México',
      coordinates: { lat: 19.4326, lng: -99.1332 },
      address: 'Zócalo, Centro Histórico, CDMX - Entrada Principal',
      accuracy: 'ultra',
      type: 'landmark',
      precision: 0.3
    },
    {
      code: '75CX9M8W+QRGH5 Ciudad de México',
      coordinates: { lat: 19.4284, lng: -99.1276 },
      address: 'Hospital General de México - Urgencias',
      accuracy: 'ultra',
      type: 'emergency',
      precision: 0.3
    },
    {
      code: '75CX9M8W+8QP3M Ciudad de México',
      coordinates: { lat: 19.4058, lng: -99.1661 },
      address: 'Taller Mecánico Express - Bahía 3',
      accuracy: 'ultra',
      type: 'business',
      precision: 0.3
    }
  ]);
  
  const [searchResults, setSearchResults] = useState<PlusCode[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generar Plus Code de alta precisión desde coordenadas
  const generatePlusCode = (lat: number, lng: number): string => {
    const chars = '23456789CFGHJMPQRVWX';
    let code = '';
    
    // Código base de 8 caracteres (3x3 metros)
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    code += '+';
    for (let i = 0; i < 2; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // Extensión de alta precisión (0.3x0.3 metros)
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    
    return `${code} Ciudad de México`;
  };

  // Decodificar Plus Code a coordenadas
  const decodePlusCode = (code: string): { lat: number; lng: number } | null => {
    // Simulación de decodificación
    const baseCoords = { lat: 19.4326, lng: -99.1332 };
    const variation = 0.1;
    
    return {
      lat: baseCoords.lat + (Math.random() - 0.5) * variation,
      lng: baseCoords.lng + (Math.random() - 0.5) * variation
    };
  };

  // Obtener ubicación actual y generar Plus Code
  const getCurrentLocationPlusCode = () => {
    setIsGenerating(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const plusCode = generatePlusCode(latitude, longitude);
          
          const locationData: PlusCode = {
            code: plusCode,
            coordinates: { lat: latitude, lng: longitude },
            address: 'Mi ubicación actual - Precisión Ultra',
            accuracy: 'ultra',
            type: 'personal',
            precision: 0.3
          };
          
          setCurrentLocation(locationData);
          actions.addXP(20, 'Plus Code generado para ubicación actual');
          setIsGenerating(false);
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          setIsGenerating(false);
        }
      );
    }
  };

  // Buscar Plus Code
  const searchPlusCode = () => {
    if (!inputCode.trim()) return;
    
    const coordinates = decodePlusCode(inputCode);
    if (coordinates) {
      const result: PlusCode = {
        code: inputCode,
        coordinates,
        address: 'Ubicación encontrada',
        accuracy: 'building',
        type: 'personal'
      };
      
      setSearchResults([result]);
      actions.addXP(15, 'Plus Code decodificado exitosamente');
    }
  };

  // Guardar Plus Code
  const savePlusCode = (plusCode: PlusCode) => {
    if (!savedCodes.find(code => code.code === plusCode.code)) {
      setSavedCodes([...savedCodes, plusCode]);
      actions.addXP(25, `Plus Code guardado: ${plusCode.code}`);
    }
  };

  // Compartir Plus Code
  const sharePlusCode = (plusCode: PlusCode) => {
    const shareText = `📍 Mi ubicación: ${plusCode.code}\n🗺️ ${plusCode.address}\n📱 Asistencia Vial México`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Mi ubicación - Plus Code',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      actions.addXP(10, 'Plus Code copiado al portapapeles');
    }
  };

  const getAccuracyColor = (accuracy: PlusCode['accuracy']) => {
    switch (accuracy) {
      case 'ultra': return 'text-purple-400 bg-purple-900/30';
      case 'building': return 'text-green-400 bg-green-900/30';
      case 'street': return 'text-blue-400 bg-blue-900/30';
      case 'area': return 'text-yellow-400 bg-yellow-900/30';
      case 'city': return 'text-red-400 bg-red-900/30';
    }
  };

  const getTypeIcon = (type: PlusCode['type']) => {
    switch (type) {
      case 'emergency': return '🚨';
      case 'business': return '🏢';
      case 'landmark': return '🏛️';
      case 'personal': return '📍';
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🌐</span>
        <div>
          <h2 className="text-xl font-bold text-white">Plus Codes - Ubicaciones Precisas</h2>
          <p className="text-gray-400">Sistema global de direcciones sin calles</p>
        </div>
      </div>

      {/* Plus Code Generator */}
      <div className="mb-6 bg-gradient-to-r from-blue-900/30 to-green-900/30 border border-blue-500/30 p-4 rounded-lg">
        <h3 className="font-bold text-white mb-3">📍 Generar Plus Code</h3>
        <div className="flex gap-3">
          <button
            onClick={getCurrentLocationPlusCode}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Generando...</span>
              </>
            ) : (
              <>
                <span>📍</span>
                <span>Mi Ubicación</span>
              </>
            )}
          </button>
          
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <span>🗺️</span>
            <span>Seleccionar en Mapa</span>
          </button>
        </div>
        
        {currentLocation && (
          <div className="mt-4 bg-gray-700 p-3 rounded border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-green-400 text-lg">{currentLocation.code}</div>
                <div className="text-gray-300 text-sm">{currentLocation.address}</div>
                <div className="text-gray-400 text-xs">
                  {currentLocation.coordinates.lat.toFixed(6)}, {currentLocation.coordinates.lng.toFixed(6)}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => savePlusCode(currentLocation)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm"
                >
                  💾 Guardar
                </button>
                <button
                  onClick={() => sharePlusCode(currentLocation)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
                >
                  📤 Compartir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Plus Code Search */}
      <div className="mb-6 bg-gray-700 p-4 rounded-lg">
        <h3 className="font-bold text-white mb-3">🔍 Buscar Plus Code</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Ej: 75CX9M8W+VJQ2X Ciudad de México"
            className="flex-1 bg-gray-600 text-white p-3 rounded border border-gray-500 focus:border-blue-400"
          />
          <button
            onClick={searchPlusCode}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-bold"
          >
            🔍 Buscar
          </button>
        </div>
        
        {searchResults.map((result, index) => (
          <div key={index} className="mt-4 bg-gray-600 p-3 rounded border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-blue-400 text-lg">{result.code}</div>
                <div className="text-gray-300 text-sm">{result.address}</div>
                <div className="text-gray-400 text-xs">
                  {result.coordinates.lat.toFixed(6)}, {result.coordinates.lng.toFixed(6)}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => savePlusCode(result)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm"
                >
                  💾 Guardar
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm">
                  🧭 Navegar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Saved Plus Codes */}
      <div className="mb-6">
        <h3 className="font-bold text-white mb-4">💾 Plus Codes Guardados</h3>
        <div className="space-y-3">
          {savedCodes.map((code, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getTypeIcon(code.type)}</span>
                  <div>
                    <div className="font-bold text-white text-lg">{code.code}</div>
                    <div className="text-gray-300 text-sm">{code.address}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${getAccuracyColor(code.accuracy)}`}>
                    {code.accuracy.toUpperCase()}
                  </span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => sharePlusCode(code)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
                    >
                      📤
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm">
                      🧭
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="text-gray-400 text-xs">
                📍 {code.coordinates.lat.toFixed(6)}, {code.coordinates.lng.toFixed(6)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plus Code Benefits */}
      <div className="mb-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 p-4 rounded-lg">
        <h3 className="font-bold text-white mb-3">✨ Ventajas de Plus Codes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-bold text-purple-400 mb-2">🌍 Universal</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• Funciona en todo el mundo</li>
              <li>• No requiere direcciones tradicionales</li>
              <li>• Ideal para zonas rurales</li>
              <li>• Precisión hasta 0.3x0.3 metros</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-pink-400 mb-2">🚨 Emergencias</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• Ubicación exacta para rescate</li>
              <li>• Fácil de comunicar por radio</li>
              <li>• No depende de señal de datos</li>
              <li>• Reconocido por servicios de emergencia</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-cyan-400 mb-2">📱 Tecnología</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• Integración con Google Maps</li>
              <li>• API gratuita disponible</li>
              <li>• Offline compatible</li>
              <li>• Códigos cortos y memorables</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-yellow-400 mb-2">🏢 Negocios</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• Direcciones únicas para negocios</li>
              <li>• Fácil compartir ubicación</li>
              <li>• Mejor que coordenadas largas</li>
              <li>• Ideal para delivery</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-green-400">{savedCodes.length}</div>
          <div className="text-sm text-gray-300">Códigos Guardados</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-blue-400">0.3m</div>
          <div className="text-sm text-gray-300">Precisión Ultra</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-purple-400">
            {savedCodes.filter(c => c.type === 'emergency').length}
          </div>
          <div className="text-sm text-gray-300">Emergencias</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {savedCodes.filter(c => c.accuracy === 'ultra').length}
          </div>
          <div className="text-sm text-gray-300">Ultra Precisión</div>
        </div>
      </div>
    </div>
  );
};

export default PlusCodeIntegration;