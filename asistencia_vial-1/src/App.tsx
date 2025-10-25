import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🚨 Asistencia Vial México</h1>
        <p className="text-xl mb-8">SOS y asistencia vial en tiempo real</p>
        <div className="space-y-4">
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg">
            🚨 SOS EMERGENCIA
          </button>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              🔧 Talleres
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              🗺️ Mapa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;