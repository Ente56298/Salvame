import React from 'react';
import { Giro } from '../../types';
import { CubeIcon } from '../icons/CubeIcon';
import { WrenchIcon } from '../icons/WrenchIcon';

interface GiroListViewProps {
  giros: Giro[];
  onEdit: (giro: Giro) => void;
  onView3D: (giro: Giro) => void;
  onDelete: (id: string) => void;
}

export const GiroListView: React.FC<GiroListViewProps> = ({ giros, onEdit, onView3D, onDelete }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Giros Registrados</h3>
      
      {giros.length === 0 ? (
        <p className="text-gray-500">No hay giros registrados</p>
      ) : (
        <div className="grid gap-4">
          {giros.map((giro) => (
            <div key={giro.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-lg">{giro.name}</h4>
                  <p className="text-sm text-gray-600 capitalize">{giro.type}</p>
                  <p className="text-sm text-gray-500">{giro.address}</p>
                  {giro.phone && <p className="text-sm text-blue-600">{giro.phone}</p>}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(giro)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Editar"
                  >
                    <WrenchIcon className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => onView3D(giro)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded"
                    title="Ver en 3D"
                  >
                    <CubeIcon className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => onDelete(giro.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Eliminar"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};