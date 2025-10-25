import { useState, useEffect } from 'react';

interface Business {
  id: string;
  nombre: string;
  tipo: string;
  direccion: string;
  telefono: string;
  lat: number;
  lng: number;
  servicios: string[];
  horario: string;
  calificacion: number;
  disponible: boolean;
}

export default function BusinessDirectory() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        const response = await fetch('/src/data/talleres.json');
        const data = await response.json();
        setBusinesses(data);
      } catch (error) {
        console.error('Error loading businesses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBusinesses();
  }, []);

  const filteredBusinesses = businesses.filter(business => 
    filter === 'todos' || business.tipo === filter
  );

  if (loading) {
    return (
      <div className="rocket-card p-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rocket-card p-6">
      <h2 className="text-xl font-bold mb-4">Servicios Cercanos</h2>
      
      <div className="flex gap-2 mb-4 flex-wrap">
        {['todos', 'mecanico', 'grua', 'refacciones', 'gasolinera'].map(tipo => (
          <button
            key={tipo}
            onClick={() => setFilter(tipo)}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === tipo 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredBusinesses.map(business => (
          <div key={business.id} className="border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{business.nombre}</h3>
              <span className="text-yellow-400">★ {business.calificacion}</span>
            </div>
            
            <p className="text-gray-400 text-sm mb-2">{business.direccion}</p>
            <p className="text-gray-400 text-sm mb-2">{business.horario}</p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {business.servicios.map(servicio => (
                <span key={servicio} className="bg-gray-700 text-xs px-2 py-1 rounded">
                  {servicio}
                </span>
              ))}
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => window.open(`tel:${business.telefono}`)}
                className="rocket-button text-sm px-3 py-1"
              >
                Llamar
              </button>
              <button 
                onClick={() => window.open(`https://maps.google.com/?q=${business.lat},${business.lng}`)}
                className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1 rounded"
              >
                Ubicación
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}