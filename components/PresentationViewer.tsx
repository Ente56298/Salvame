import React, { useState } from 'react';

interface Slide {
  id: number;
  title: string;
  content: React.ReactNode;
  bgColor: string;
}

const PresentationViewer: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      id: 1,
      title: "ASISTENCIA VIAL MÉXICO",
      bgColor: "bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900",
      content: (
        <div className="text-center space-y-8">
          <div className="text-8xl mb-8">🚗</div>
          <h1 className="text-6xl font-bold text-white mb-4">ASISTENCIA VIAL</h1>
          <h2 className="text-4xl text-blue-300 mb-8">ECOSISTEMA GAMIFICADO</h2>
          <div className="text-2xl text-gray-300">
            De app simple → Plataforma de $100M+ USD
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "TRANSFORMACIÓN",
      bgColor: "bg-gradient-to-br from-green-900 via-teal-900 to-blue-900",
      content: (
        <div className="grid grid-cols-2 gap-12 h-full">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-red-400 mb-8">❌ ANTES</h2>
            <div className="space-y-4 text-xl text-gray-300">
              <div>• SOS básico</div>
              <div>• Búsqueda talleres</div>
              <div>• Reportes tráfico</div>
              <div>• Historial simple</div>
            </div>
            <div className="text-2xl text-red-300 mt-8">App Simple</div>
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-green-400 mb-8">✅ DESPUÉS</h2>
            <div className="space-y-4 text-xl text-gray-300">
              <div>🎮 Sistema gamificación</div>
              <div>🏆 Competencia social</div>
              <div>🏢 Directorio 3D negocios</div>
              <div>🤖 IA contextual</div>
              <div>📊 Analytics avanzados</div>
              <div>🌐 Comunidad colaborativa</div>
            </div>
            <div className="text-2xl text-green-300 mt-8">Ecosistema Completo</div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "4 APPS SEPARADAS",
      bgColor: "bg-gradient-to-br from-purple-900 via-pink-900 to-red-900",
      content: (
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-red-800/30 p-6 rounded-xl border border-red-500/50">
            <div className="text-4xl mb-4">🚨</div>
            <h3 className="text-2xl font-bold text-white mb-2">SOS MÉXICO</h3>
            <div className="text-gray-300 mb-4">Solo emergencias</div>
            <div className="text-3xl font-bold text-green-400">$1.5M/año</div>
          </div>
          <div className="bg-purple-800/30 p-6 rounded-xl border border-purple-500/50">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold text-white mb-2">ROAD GAME</h3>
            <div className="text-gray-300 mb-4">Gamificación completa</div>
            <div className="text-3xl font-bold text-green-400">$2.5M/año</div>
          </div>
          <div className="bg-blue-800/30 p-6 rounded-xl border border-blue-500/50">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-2xl font-bold text-white mb-2">FLEET MANAGER</h3>
            <div className="text-gray-300 mb-4">Empresarial</div>
            <div className="text-3xl font-bold text-green-400">$3M/año</div>
          </div>
          <div className="bg-teal-800/30 p-6 rounded-xl border border-teal-500/50">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-2xl font-bold text-white mb-2">CITY EXPLORER</h3>
            <div className="text-gray-300 mb-4">Navegación + ads</div>
            <div className="text-3xl font-bold text-green-400">$3.3M/año</div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "GAMIFICACIÓN",
      bgColor: "bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900",
      content: (
        <div className="space-y-8">
          <h2 className="text-5xl font-bold text-center text-yellow-400 mb-8">🎮 SISTEMA DE JUEGO</h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-white mb-2">6 LOGROS</h3>
              <div className="text-gray-300">50-500 XP cada uno</div>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-white mb-2">DESAFÍOS</h3>
              <div className="text-gray-300">Diarios y semanales</div>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">🥇</div>
              <h3 className="text-2xl font-bold text-white mb-2">RANKING</h3>
              <div className="text-gray-300">Competencia social</div>
            </div>
          </div>
          <div className="bg-yellow-900/30 p-6 rounded-xl border border-yellow-500/50 text-center">
            <div className="text-3xl font-bold text-yellow-400">+60% RETENCIÓN</div>
            <div className="text-xl text-gray-300 mt-2">vs apps normales</div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "REVENUE STREAMS",
      bgColor: "bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900",
      content: (
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-center text-green-400 mb-8">💰 8 FUENTES DE INGRESOS</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-green-800/30 p-4 rounded-lg border border-green-500/50">
                <div className="text-xl font-bold text-white">B2C Apps</div>
                <div className="text-2xl text-green-400">$48M/año</div>
              </div>
              <div className="bg-blue-800/30 p-4 rounded-lg border border-blue-500/50">
                <div className="text-xl font-bold text-white">B2B Enterprise</div>
                <div className="text-2xl text-green-400">$45M/año</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-purple-800/30 p-4 rounded-lg border border-purple-500/50">
                <div className="text-xl font-bold text-white">Advertising</div>
                <div className="text-2xl text-green-400">$18M/año</div>
              </div>
              <div className="bg-orange-800/30 p-4 rounded-lg border border-orange-500/50">
                <div className="text-xl font-bold text-white">Data Analytics</div>
                <div className="text-2xl text-green-400">$12M/año</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-xl text-center">
            <div className="text-5xl font-bold text-white">$123M/AÑO</div>
            <div className="text-xl text-green-100 mt-2">Revenue Total Proyectado</div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "DIFERENCIADORES",
      bgColor: "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center text-purple-400 mb-8">🌟 VENTAJAS ÚNICAS</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-purple-800/30 p-6 rounded-xl border border-purple-500/50">
                <div className="text-3xl mb-3">🎮</div>
                <h3 className="text-xl font-bold text-white mb-2">Primera App Vial Gamificada</h3>
                <div className="text-gray-300">Del mundo. Engagement 3x superior</div>
              </div>
              <div className="bg-blue-800/30 p-6 rounded-xl border border-blue-500/50">
                <div className="text-3xl mb-3">🏢</div>
                <h3 className="text-xl font-bold text-white mb-2">Visualización 3D</h3>
                <div className="text-gray-300">Espacios comerciales únicos</div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-teal-800/30 p-6 rounded-xl border border-teal-500/50">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-xl font-bold text-white mb-2">IA Contextual</h3>
                <div className="text-gray-300">Gemini AI especializada</div>
              </div>
              <div className="bg-green-800/30 p-6 rounded-xl border border-green-500/50">
                <div className="text-3xl mb-3">🧩</div>
                <h3 className="text-xl font-bold text-white mb-2">Arquitectura Modular</h3>
                <div className="text-gray-300">4 productos del mismo código</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "PROYECCIONES",
      bgColor: "bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center text-cyan-400 mb-8">📈 CRECIMIENTO PROYECTADO</h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-3xl font-bold text-white mb-2">AÑO 1</h3>
              <div className="text-4xl font-bold text-green-400">$10.3M</div>
              <div className="text-gray-300 mt-2">México</div>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-3xl font-bold text-white mb-2">AÑO 2</h3>
              <div className="text-4xl font-bold text-green-400">$23M</div>
              <div className="text-gray-300 mt-2">Escalado</div>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-3xl font-bold text-white mb-2">AÑO 3</h3>
              <div className="text-4xl font-bold text-green-400">$92M</div>
              <div className="text-gray-300 mt-2">Internacional</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 rounded-xl text-center">
            <div className="text-3xl font-bold text-white">VALUACIÓN: $300M+ USD</div>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: "SALIDA ESTRATÉGICA",
      bgColor: "bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-900",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center text-amber-400 mb-8">🎯 POTENCIAL DE SALIDA</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white mb-4">COMPRADORES POTENCIALES</h3>
              <div className="space-y-3">
                <div className="bg-red-800/30 p-4 rounded-lg border border-red-500/50">
                  <div className="text-xl font-bold text-white">Google Maps</div>
                  <div className="text-2xl text-green-400">$500M+</div>
                </div>
                <div className="bg-purple-800/30 p-4 rounded-lg border border-purple-500/50">
                  <div className="text-xl font-bold text-white">Uber</div>
                  <div className="text-2xl text-green-400">$300M+</div>
                </div>
                <div className="bg-blue-800/30 p-4 rounded-lg border border-blue-500/50">
                  <div className="text-xl font-bold text-white">Waze</div>
                  <div className="text-2xl text-green-400">$200M+</div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white mb-4">TIMING ÓPTIMO</h3>
              <div className="space-y-3">
                <div className="bg-green-800/30 p-4 rounded-lg border border-green-500/50">
                  <div className="text-xl font-bold text-white">Año 2</div>
                  <div className="text-2xl text-green-400">$100M</div>
                </div>
                <div className="bg-blue-800/30 p-4 rounded-lg border border-blue-500/50">
                  <div className="text-xl font-bold text-white">Año 3</div>
                  <div className="text-2xl text-green-400">$400M</div>
                </div>
                <div className="bg-purple-800/30 p-4 rounded-lg border border-purple-500/50">
                  <div className="text-xl font-bold text-white">IPO</div>
                  <div className="text-2xl text-green-400">$1B+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 9,
      title: "CALL TO ACTION",
      bgColor: "bg-gradient-to-br from-red-900 via-pink-900 to-purple-900",
      content: (
        <div className="text-center space-y-8">
          <div className="text-8xl mb-8">🚀</div>
          <h1 className="text-5xl font-bold text-white mb-8">¡LISTO PARA LANZAR!</h1>
          <div className="space-y-6 text-2xl text-gray-300">
            <div>✅ Código completo y funcional</div>
            <div>✅ 4 apps listas para deploy</div>
            <div>✅ Arquitectura modular escalable</div>
            <div>✅ Diferenciación única mundial</div>
          </div>
          <div className="bg-gradient-to-r from-red-600 to-pink-600 p-8 rounded-xl">
            <div className="text-4xl font-bold text-white mb-4">PRÓXIMO PASO</div>
            <div className="text-2xl text-pink-100">Deploy inmediato → $10M+ Año 1</div>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className={`w-full h-full ${slides[currentSlide].bgColor} flex flex-col`}>
        {/* Slide Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-6xl">
            {slides[currentSlide].content}
          </div>
        </div>

        {/* Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
          <button
            onClick={prevSlide}
            className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
          >
            ←
          </button>
          
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextSlide}
            className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
          >
            →
          </button>
        </div>

        {/* Slide Counter */}
        <div className="absolute top-8 right-8 text-white/70 text-lg">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
    </div>
  );
};

export default PresentationViewer;