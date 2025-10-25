import React, { useState } from 'react';
import { Giro } from '../types';
import { initialGiros } from '../data/giroTemplates';
import BriefcaseIcon from './icons/BriefcaseIcon';
import CubeIcon from './icons/CubeIcon';
import Giro3DViewPanel from './Giro3DViewPanel';

const GiroManagementPanel: React.FC = () => {
    const [giros, setGiros] = useState<Giro[]>(initialGiros);
    const [selectedGiro, setSelectedGiro] = useState<Giro | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [viewingGiro3D, setViewingGiro3D] = useState<Giro | null>(null);

    const handleSelectGiro = (giro: Giro) => {
        setSelectedGiro({ ...giro }); // Create a copy to edit
        setIsEditing(true);
    };

    const handleCreateNew = () => {
        setSelectedGiro({ id: `new_${Date.now()}`, name: '', prompt: '' });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setSelectedGiro(null);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedGiro) return;

        if (selectedGiro.id.startsWith('new_')) {
            // It's a new giro
            setGiros([...giros, { ...selectedGiro, id: String(giros.length + 1 + Date.now()) }]);
        } else {
            // It's an existing giro
            setGiros(giros.map(g => g.id === selectedGiro.id ? selectedGiro : g));
        }
        handleCancel();
    };
    
    const handleDelete = (giroId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este giro?')) {
            setGiros(giros.filter(g => g.id !== giroId));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!selectedGiro) return;
        const { name, value } = e.target;
        setSelectedGiro({ ...selectedGiro, [name]: value });
    };

    if (isEditing && selectedGiro) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-4">
                    {selectedGiro.id.startsWith('new_') ? 'Crear Nuevo Giro' : 'Editar Giro'}
                </h3>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nombre del Giro</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={selectedGiro.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300">System Prompt (Instrucción para la IA)</label>
                        <textarea
                            id="prompt"
                            name="prompt"
                            rows={8}
                            value={selectedGiro.prompt}
                            onChange={handleInputChange}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={handleCancel} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-500">
                            Cancelar
                        </button>
                        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-500">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        );
    }
    
    return (
        <>
            <div className="bg-gray-800 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">Administrar Giros de Negocio</h3>
                    <button onClick={handleCreateNew} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-500">
                        Crear Nuevo
                    </button>
                </div>
                <div className="space-y-3">
                    {giros.map(giro => (
                        <div key={giro.id} className="bg-gray-700 p-3 rounded-md flex justify-between items-center">
                            <div className="flex items-center">
                                <BriefcaseIcon />
                                <span className="ml-3 font-medium text-gray-200">{giro.name}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                {giro.floorPlan && (
                                    <button 
                                        onClick={() => setViewingGiro3D(giro)} 
                                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-1 px-3 rounded-md text-xs flex items-center gap-1 transition-colors"
                                    >
                                        <CubeIcon /> Vista 3D
                                    </button>
                                )}
                                <button onClick={() => handleSelectGiro(giro)} className="text-sm text-indigo-400 hover:text-indigo-300">Editar</button>
                                <button onClick={() => handleDelete(giro.id)} className="text-sm text-red-400 hover:text-red-300">Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {viewingGiro3D && (
                <Giro3DViewPanel giro={viewingGiro3D} onClose={() => setViewingGiro3D(null)} />
            )}
        </>
    );
};

export default GiroManagementPanel;