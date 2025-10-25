import { useState, useEffect } from 'react'
import './rocket-theme.css'
import BusinessDirectory from './components/BusinessDirectory'
import OfflineSOSButton from './components/OfflineSOSButton'
import SimpleMap from './components/SimpleMap'
import EmergencySync from './components/EmergencySync'
import RealTimeTracking from './components/RealTimeTracking'
import CrashDetection from './components/CrashDetection'
import MedicalInfo from './components/MedicalInfo'
import SafetyCheck from './components/SafetyCheck'
import OfflineMaps from './components/OfflineMaps'
import MexicanCompliance from './components/MexicanCompliance'
import EmergencyAlerts from './components/EmergencyAlerts'
import VehicleTelemetry from './components/VehicleTelemetry'
import InsuranceAssistance from './components/InsuranceAssistance'
import FleetManagement from './components/FleetManagement'
import MultiServicesHub from './components/MultiServicesHub'
import IntelligentAssistant from './components/IntelligentAssistant'
import MultiAgentSystem from './components/MultiAgentSystem'

function App() {
  const [activeView, setActiveView] = useState('home');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error('Location error:', error)
      );
    }

    // Monitor online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleServiceClick = (service: string) => {
    if (service === 'Mecánico' || service === 'Refacciones') {
      setActiveView('directory');
    } else {
      alert(`Solicitando servicio: ${service}`);
    }
  };

  return (
    <div className="rocket-app">
      <header className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 glass-panel rounded-full px-6 py-3 mb-8">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              isOnline ? 'bg-green-400' : 'bg-red-400'
            }`}></div>
            <span className="text-sm font-medium">
              {isOnline ? 'Sistema Operativo' : 'Modo Offline'}
            </span>
            {userLocation && (
              <span className="text-xs text-gray-400">
                📍 {userLocation.lat.toFixed(2)}, {userLocation.lng.toFixed(2)}
              </span>
            )}
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            Asistencia Vial
            <br />
            <span className="metric-number">México</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Plataforma de emergencias viales construida con tecnología moderna. 
            Respuesta instantánea, análisis en tiempo real, disponibilidad 24/7.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <div className="status-indicator">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              99.9% Uptime
            </div>
            <div className="status-indicator">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              &lt; 100ms Response
            </div>
            <div className="status-indicator">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              ISO 27001
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div className="rocket-card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center neon-glow">
                <span className="text-2xl">🆘</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">SOS Emergencia</h2>
                <p className="text-gray-400 text-sm">Respuesta inmediata</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">Activar protocolo de emergencia inmediato</p>
            <button 
              onClick={() => alert('SOS activado desde botón flotante')}
              className="rocket-button w-full"
            >
              Ver SOS Flotante
            </button>
          </div>

          <div className="rocket-card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🔧</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Mecánico</h2>
                <p className="text-gray-400 text-sm">Asistencia técnica</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">Solicitar asistencia mecánica especializada</p>
            <button 
              onClick={() => handleServiceClick('Mecánico')}
              className="rocket-button w-full"
            >
              Solicitar
            </button>
          </div>

          <div className="rocket-card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🚛</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Grúa</h2>
                <p className="text-gray-400 text-sm">Servicio de remolque</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">Servicio de grúa y remolque 24/7</p>
            <button 
              onClick={() => handleServiceClick('Grúa')}
              className="rocket-button w-full"
            >
              Solicitar
            </button>
          </div>

          <div className="rocket-card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🚑</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Médico</h2>
                <p className="text-gray-400 text-sm">Emergencia médica</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">Asistencia médica de emergencia</p>
            <button 
              onClick={() => handleServiceClick('Médico')}
              className="rocket-button w-full"
            >
              Solicitar
            </button>
          </div>

          <div className="rocket-card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Seguridad</h2>
                <p className="text-gray-400 text-sm">Configuración personal</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">Información médica y contactos de emergencia</p>
            <button 
              onClick={() => setActiveView('safety')}
              className="rocket-button w-full"
            >
              Configurar
            </button>
          </div>

          <div className="rocket-card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🚦</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Tráfico</h2>
                <p className="text-gray-400 text-sm">Tiempo real</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">Reportes de tráfico en tiempo real</p>
            <button 
              onClick={() => setActiveView('map')}
              className="rocket-button w-full"
            >
              Ver Mapa
            </button>
          </div>

        </div>

        {activeView === 'directory' && (
          <div className="mt-8">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => setActiveView('home')}
                className="text-blue-400 hover:text-blue-300"
              >
                ← Volver
              </button>
              <h2 className="text-2xl font-bold">Servicios Disponibles</h2>
            </div>
            <BusinessDirectory />
          </div>
        )}

        {activeView === 'map' && (
          <div className="mt-8">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => setActiveView('home')}
                className="text-blue-400 hover:text-blue-300"
              >
                ← Volver
              </button>
              <h2 className="text-2xl font-bold">Mapa de Servicios</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SimpleMap userLocation={userLocation} />
              <RealTimeTracking />
            </div>
          </div>
        )}

        {activeView === 'safety' && (
          <div className="mt-8">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => setActiveView('home')}
                className="text-blue-400 hover:text-blue-300"
              >
                ← Volver
              </button>
              <h2 className="text-2xl font-bold">Configuración de Seguridad</h2>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <MedicalInfo />
                <SafetyCheck />
                <OfflineMaps />
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <VehicleTelemetry />
                <InsuranceAssistance />
              </div>
              
              <FleetManagement />
              
              <MultiServicesHub />
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <IntelligentAssistant />
                <MultiAgentSystem />
              </div>
            </div>
          </div>
        )}

        <footer className="mt-16 text-center text-gray-400">
          <div className="glass-panel rounded-2xl p-8 max-w-2xl mx-auto">
            <p className="mb-2">© 2024 Asistencia Vial México - Todos los derechos reservados</p>
            <p className="text-sm">Versión 2.0.0 - Sistema operativo con tecnología Rocket</p>
            <div className="flex justify-center gap-4 mt-4">
              <div className="status-indicator">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Todos los sistemas operativos
              </div>
            </div>
          </div>
        </footer>
      </main>
      
      <OfflineSOSButton />
      <EmergencySync />
      <CrashDetection />
      <MexicanCompliance />
      <EmergencyAlerts />
    </div>
  )
}

export default App