import React, { useState, useEffect } from 'react';
import { PublicArea, PublicAreaType } from '../types';
import { getPublicAreas, addPublicArea, updatePublicArea, deletePublicArea } from '../services/authService';
import SpinnerIcon from './icons/SpinnerIcon';
import LandmarkIcon from './icons/LandmarkIcon';

const PublicAreaManagementPanel: React.FC = () => {
    const [areas, setAreas] = useState<PublicArea[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentArea, setCurrentArea] = useState<Partial<PublicArea> | null>(null);

    const fetchAreas = async () => {
        setIsLoading(true);
        try {
            const fetchedAreas = await getPublicAreas();
            setAreas(fetchedAreas);
        } catch (error) {
            console.error("Failed to fetch public areas:", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchAreas();
    }, []);

    const handleCreateNew = () => {
        setCurrentArea({
            name: '',
            type: PublicAreaType.Park,
            description: '',
            address: '',
            hasEntryFee: false,
        });
        setIsEditing(true);
    };

    const handleEdit = (area: PublicArea) => {
        setCurrentArea(area);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setCurrentArea(null);
    };

    const handleDelete = async (areaId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta área?')) {
            try {
                await deletePublicArea(areaId);
                fetchAreas(); // Refresh list
            } catch (error) {
                console.error("Failed to delete area:", error);
                alert("Error al eliminar el área.");
            }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentArea) return;

        try {
            if (currentArea.id) {
                await updatePublicArea(currentArea as PublicArea);
            } else {
                await addPublicArea(currentArea as Omit<PublicArea, 'id'>);
            }
            fetchAreas();
            handleCancel();
        } catch (error) {
            console.error("Failed to save area:", error);
            alert("Error al guardar el área.");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!currentArea) return;
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
             const { checked } = e.target as HTMLInputElement;
             setCurrentArea({ ...currentArea, [name]: checked });
        } else {
             setCurrentArea({ ...currentArea, [name]: value });
        }
    };
    
    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><SpinnerIcon className="w-10 h-10 text-indigo-400" /></div>;
    }

    if (isEditing && currentArea) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-4">{currentArea.id ? 'Editar Área Pública' : 'Crear Nueva Área Pública'}</h3>
                <form onSubmit={handleSave} className="space-y-4 max-w-lg mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nombre</label>
                            <input type="text" name="name" value={currentArea.name} onChange={handleInputChange} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-300">Tipo</label>
                            <select name="type" value={currentArea.type} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500">
                                {Object.values(PublicAreaType).map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-300">Dirección</label>
                        <input type="text" name="address" value={currentArea.address} onChange={handleInputChange} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Descripción</label>
                        <textarea name="description" rows={3} value={currentArea.description || ''} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" name="hasEntryFee" id="hasEntryFee" checked={currentArea.hasEntryFee || false} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 border-gray-500 rounded bg-gray-700 focus:ring-indigo-500" />
                        <label htmlFor="hasEntryFee" className="ml-2 block text-sm text-gray-300">¿Tiene costo de entrada?</label>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={handleCancel} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-500">Cancelar</button>
                        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-500">Guardar</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Administrar Áreas Públicas</h3>
                <button onClick={handleCreateNew} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-500">
                    Añadir Área
                </button>
            </div>
            <div className="space-y-4">
                {areas.map(area => (
                    <div key={area.id} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                             <div>
                                <div className="flex items-center gap-3">
                                    <span className="text-indigo-400"><LandmarkIcon /></span>
                                    <h4 className="font-bold text-white text-lg">{area.name}</h4>
                                </div>
                                <p className="text-sm text-gray-400 mt-1">{area.type}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${area.hasEntryFee ? 'bg-amber-500/20 text-amber-300 ring-amber-500/30' : 'bg-green-500/20 text-green-300 ring-green-500/30'}`}>
                                    {area.hasEntryFee ? 'Con Costo' : 'Gratuito'}
                                </span>
                                <button onClick={() => handleEdit(area)} className="text-sm text-indigo-400 hover:text-indigo-300">Editar</button>
                                <button onClick={() => handleDelete(area.id)} className="text-sm text-red-400 hover:text-red-300">Eliminar</button>
                            </div>
                        </div>
                        <div className="border-t border-gray-600 mt-3 pt-3 text-sm space-y-2">
                             <p className="text-gray-300"><span className="font-semibold text-gray-400">Dirección:</span> {area.address}</p>
                             <p className="text-gray-300"><span className="font-semibold text-gray-400">Descripción:</span> {area.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PublicAreaManagementPanel;