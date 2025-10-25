import React from 'react';

interface Service {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
  phone?: string;
}

interface ServiceNavigationPromptProps {
  service: Service;
  onNavigate: () => void;
  onCancel: () => void;
}

export const ServiceNavigationPrompt: React.FC<ServiceNavigationPromptProps> = ({
  service,
  onNavigate,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">🗺️</div>
          <h2 className="text-xl font-bold">Navegar al Servicio</h2>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-lg">{service.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{service.address}</p>
          {service.phone && (
            <p className="text-sm text-blue-600 mt-1">{service.phone}</p>
          )}
          <div className="mt-2">
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
              {service.type}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-6 text-center">
          ¿Deseas que el mapa te muestre la ruta hacia este servicio?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={onNavigate}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Navegar
          </button>
        </div>
      </div>
    </div>
  );
};