import React, { useState, useEffect } from 'react';
import { PublicEntity, PublicEntityType, IntegrationLevel } from '../types';
import { getPublicEntities, addPublicEntity, updatePublicEntity, deletePublicEntity } from '../services/authService';
import SpinnerIcon from './icons/SpinnerIcon';
import BuildingIcon from './icons/BuildingIcon';

const PublicManagementPanel: React.FC = () => {
    const [entities, setEntities] = useState<PublicEntity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEntity, setCurrentEntity] = useState<Partial<PublicEntity> | null>(null);

    const fetchEntities = async () => {
        setIsLoading(true);
        try {
            const fetchedEntities = await getPublicEntities();
            setEntities(fetchedEntities);
        } catch (error) {
            console.error("Failed to fetch public entities:", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchEntities();
    }, []);

    const handleCreateNew = () => {
        setCurrentEntity({
            name: '',
            type: PublicEntityType.Company,
            contactPerson: '',
            contactEmail: '',
            status: 'pending',
            integrationLevel: 'none',
            notes: ''
        });
        setIsEditing(true);
    };

    const handleEdit = (entity: PublicEntity) => {
        setCurrentEntity(entity);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setCurrentEntity(null);
    };

    const handleDelete = async (entityId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta entidad?')) {
            try {
                await deletePublicEntity(entityId);
                fetchEntities(); // Refresh list
            } catch (error) {
                console.error("Failed to delete entity:", error);
                alert("Error al eliminar la entidad.");
            }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentEntity) return;

        try {
            if (currentEntity.id) {
                await updatePublicEntity(currentEntity as PublicEntity);
            } else {
                await addPublicEntity(currentEntity as Omit<PublicEntity, 'id'>);
            }
            fetchEntities();
            handleCancel();
        } catch (error) {
            console.error("Failed to save entity:", error);
            alert("Error al guardar la entidad.");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!currentEntity) return;
        const { name, value } = e.target;
        setCurrentEntity({ ...currentEntity, [name]: value });
    };

    const renderStatusPill = (status: 'active' | 'pending' | 'inactive') => {
        const styles = {
            active: 'bg-green-500/20 text-green-300 ring-green-500/30',
            pending: 'bg-yellow-500/20 text-yellow-300 ring-yellow-500/30',
            inactive: 'bg-red-500/20 text-red-300 ring-red-500/30',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${styles[status]}`}>{status}</span>;
    };
    
    const integrationLevelMap: Record<IntegrationLevel, string> = {
        'alert_protocol': 'Protocolo de Alertas',
        'api_integration': 'Integración API',
        'data_sharing': 'Intercambio de Datos',
        'none': 'Ninguno'
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><SpinnerIcon className="w-10 h-10 text-indigo-400" /></div>;
    }

    if (isEditing && currentEntity) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-4">{currentEntity.id ? 'Editar Entidad' : 'Crear Nueva Entidad'}</h3>
                <form onSubmit={handleSave} className="space-y-4 max-w-lg mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nombre</label>
                            <input type="text" name="name" value={currentEntity.name} onChange={handleInputChange} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-300">Tipo</label>
                            <select name="type" value={currentEntity.type} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500">
                                {Object.values(PublicEntityType).map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-300">Persona de Contacto</label>
                            <input type="text" name="contactPerson" value={currentEntity.contactPerson} onChange={handleInputChange} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                         <div>
                            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-300">Email de Contacto</label>
                            <input type="email" name="contactEmail" value={currentEntity.contactEmail} onChange={handleInputChange} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                         <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-300">Estado</label>
                            <select name="status" value={currentEntity.status} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="active">Activo</option>
                                <option value="pending">Pendiente</option>
                                <option value="inactive">Inactivo</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="integrationLevel" className="block text-sm font-medium text-gray-300">Nivel de Integración</label>
                            <select name="integrationLevel" value={currentEntity.integrationLevel} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500">
                                {Object.keys(integrationLevelMap).map(key => <option key={key} value={key}>{integrationLevelMap[key as IntegrationLevel]}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-300">Notas</label>
                        <textarea name="notes" rows={3} value={currentEntity.notes || ''} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"/>
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
                <h3 className="text-lg font-bold text-white">Entidades Públicas y Corporativas</h3>
                <button onClick={handleCreateNew} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-500">
                    Añadir Entidad
                </button>
            </div>
            <div className="space-y-4">
                {entities.map(entity => (
                    <div key={entity.id} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="text-indigo-400"><BuildingIcon /></span>
                                    <h4 className="font-bold text-white text-lg">{entity.name}</h4>
                                </div>
                                <p className="text-sm text-gray-400 mt-1">{entity.type}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                {renderStatusPill(entity.status)}
                                <button onClick={() => handleEdit(entity)} className="text-sm text-indigo-400 hover:text-indigo-300">Editar</button>
                                <button onClick={() => handleDelete(entity.id)} className="text-sm text-red-400 hover:text-red-300">Eliminar</button>
                            </div>
                        </div>
                        <div className="border-t border-gray-600 mt-3 pt-3 text-sm grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                            <p className="text-gray-300"><span className="font-semibold text-gray-400">Contacto:</span> {entity.contactPerson} ({entity.contactEmail})</p>
                            <p className="text-gray-300"><span className="font-semibold text-gray-400">Integración:</span> {integrationLevelMap[entity.integrationLevel]}</p>
                            {entity.notes && <p className="text-gray-300 col-span-full"><span className="font-semibold text-gray-400">Notas:</span> {entity.notes}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PublicManagementPanel;