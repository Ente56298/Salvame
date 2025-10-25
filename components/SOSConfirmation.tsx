import React from 'react';

interface SOSConfirmationProps {
  location: { lat: number; lng: number; address?: string };
  vehicle?: { make: string; model: string; year: string; licensePlate: string };
  emergencyContacts?: { name: string; phone: string }[];
  onConfirm: () => void;
  onCancel: () => void;
}

export const SOSConfirmation: React.FC<SOSConfirmationProps> = ({
  location,
  vehicle,
  emergencyContacts,
  onConfirm,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="text-red-600 text-6xl mb-4">🚨</div>
          <h2 className="text-2xl font-bold text-red-600">ALERTA SOS</h2>
          <p className="text-gray-600 mt-2">Confirma el envío de la alerta de emergencia</p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">📍 Ubicación Actual</h3>
            <p className="text-sm text-gray-600">
              {location.address || `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`}
            </p>
            <div className="mt-2 bg-gray-200 h-20 rounded flex items-center justify-center text-gray-500">
              Mapa de ubicación
            </div>
          </div>

          {vehicle && (vehicle.make || vehicle.model) && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🚗 Información del Vehículo</h3>
              <p className="text-sm">
                {vehicle.make} {vehicle.model} {vehicle.year}
              </p>
              {vehicle.licensePlate && (
                <p className="text-sm font-mono">Placas: {vehicle.licensePlate}</p>
              )}
            </div>
          )}

          {emergencyContacts && emergencyContacts.some(c => c.phone) && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">📞 Contactos de Emergencia</h3>
              {emergencyContacts
                .filter(contact => contact.phone)
                .map((contact, index) => (
                  <p key={index} className="text-sm">
                    {contact.name || 'Contacto'}: {contact.phone}
                  </p>
                ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-bold"
          >
            ENVIAR ALERTA
          </button>
        </div>
      </div>
    </div>
  );
};