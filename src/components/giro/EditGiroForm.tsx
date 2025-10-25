import React, { useState } from 'react';
import { Giro } from '../../types';

interface EditGiroFormProps {
  giro: Giro;
  onSave: (giro: Giro) => void;
  onCancel: () => void;
}

export const EditGiroForm: React.FC<EditGiroFormProps> = ({ giro, onSave, onCancel }) => {
  const [formData, setFormData] = useState(giro);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Tipo</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="autopartes">Autopartes</option>
          <option value="taller">Taller</option>
          <option value="gasolinera">Gasolinera</option>
          <option value="grua">Grúa</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Dirección</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="flex gap-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Guardar
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Cancelar
        </button>
      </div>
    </form>
  );
};