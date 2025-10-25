import React, { useState, useEffect } from 'react';

interface Vehicle {
  make: string;
  model: string;
  year: string;
  licensePlate: string;
}

interface VehicleProfileProps {
  onVehicleChange: (vehicle: Vehicle) => void;
}

export const VehicleProfile: React.FC<VehicleProfileProps> = ({ onVehicleChange }) => {
  const [vehicle, setVehicle] = useState<Vehicle>(() => {
    const saved = localStorage.getItem('vehicleProfile');
    return saved ? JSON.parse(saved) : {
      make: '',
      model: '',
      year: '',
      licensePlate: ''
    };
  });

  useEffect(() => {
    localStorage.setItem('vehicleProfile', JSON.stringify(vehicle));
    onVehicleChange(vehicle);
  }, [vehicle, onVehicleChange]);

  const updateField = (field: keyof Vehicle, value: string) => {
    setVehicle(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Perfil del Vehículo</h3>
      <p className="text-sm text-gray-600">Esta información se incluirá automáticamente en alertas SOS y solicitudes de servicio</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Marca</label>
          <input
            type="text"
            value={vehicle.make}
            onChange={(e) => updateField('make', e.target.value)}
            placeholder="Ej: Toyota, Ford, Nissan"
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Modelo</label>
          <input
            type="text"
            value={vehicle.model}
            onChange={(e) => updateField('model', e.target.value)}
            placeholder="Ej: Corolla, Focus, Sentra"
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Año</label>
          <input
            type="text"
            value={vehicle.year}
            onChange={(e) => updateField('year', e.target.value)}
            placeholder="Ej: 2020"
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Placas</label>
          <input
            type="text"
            value={vehicle.licensePlate}
            onChange={(e) => updateField('licensePlate', e.target.value.toUpperCase())}
            placeholder="Ej: ABC-123-D"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
};