import React, { useState, useEffect } from 'react';
import type { Part, Service, TrafficReport, LocationCoords } from '../types';
import { Feature } from '../types';
import { findParts, getTrafficReport, findServices } from '../services/geminiService';
import SpinnerIcon from './icons/SpinnerIcon';

interface FeaturePanelProps {
    feature: Feature;
    onClose: () => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    results: Part[] | Service[] | TrafficReport | string | null;
    setResults: (results: any) => void;
    currentLocation: LocationCoords | null;
}

const FeaturePanel: React.FC<FeaturePanelProps> = ({
    feature,
    onClose,
    isLoading,
    setIsLoading,
    error,
    setError,
    results,
    setResults,
    currentLocation
}) => {
    const [query, setQuery] = useState('');
    const [locationInput, setLocationInput] = useState('Obteniendo ubicación...');

    useEffect(() => {
        if (currentLocation) {
            setLocationInput(`Lat: ${currentLocation.lat.toFixed(5)}, Lon: ${currentLocation.lon.toFixed(5)}`);
        } else {
            setLocationInput('No se pudo obtener la ubicación.');
        }
    }, [currentLocation]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((feature !== Feature.Traffic && !query) || !locationInput) return;

        setIsLoading(true);
        setError(null);
        setResults(null);

        try {
            let response;
            switch (feature) {
                case Feature.Parts:
                    response = await findParts(query);
                    break;
                case Feature.Traffic:
                    response = await getTrafficReport(locationInput);
                    break;
                case Feature.Services:
                    response = await findServices(query, locationInput);
                    break;
            }
            setResults(response);
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error inesperado.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const getTitle = () => {
        switch (feature) {
            case Feature.Parts: return "Buscador de Refacciones";
            case Feature.Traffic: return "Reporte de Tráfico";
            case Feature.Services: return "Localizador de Servicios";
            default: return "Asistente Vial";
        }
    };

    const getInputPlaceholder = () => {
        switch (feature) {
            case Feature.Parts: return "Ej: balatas para Tsuru 2010";
            case Feature.Services: return "Ej: Gasolinera o Taller mecánico";
            default: return "";
        }
    }

    const renderResults = () => {
        if (!results) return null;

        if (feature === Feature.Parts && Array.isArray(results)) {
            return (
                <div className="space-y-4">
                    {(results as Part[]).map((part, index) => (
                        <div key={index} className="bg-gray-800 p-4 rounded-lg">
                            <h3 className="font-bold text-amber-400">{part.nombre}</h3>
                            <p className="text-sm text-gray-300">{part.descripcion}</p>
                            <p className="text-sm mt-2">Proveedor: <span className="font-semibold">{part.proveedor_sugerido}</span></p>
                            <p className="text-sm">Precio Est: <span className="font-semibold">${part.precio_estimado.toFixed(2)} MXN</span></p>
                        </div>
                    ))}
                </div>
            );
        }

        if (feature === Feature.Services && Array.isArray(results)) {
            return (
                <div className="space-y-4">
                    {(results as Service[]).map((service, index) => (
                        <div key={index} className="bg-gray-800 p-4 rounded-lg">
                            <h3 className="font-bold text-amber-400">{service.nombre} ({service.tipo})</h3>
                            <p className="text-sm text-gray-300">Ubicación: {service.ubicacion_aproximada}</p>
                            {service.telefono && <p className="text-sm mt-2">Teléfono: <span className="font-semibold">{service.telefono}</span></p>}
                        </div>
                    ))}
                </div>
            );
        }
        
        if (feature === Feature.Traffic && typeof results === 'object' && 'resumen' in results) {
            const report = results as TrafficReport;
            return (
                <div className="space-y-4 text-sm">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-bold text-amber-400 mb-2">Resumen General</h3>
                        <p>{report.resumen}</p>
                    </div>
                    {report.incidentes?.length > 0 && (
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <h3 className="font-bold text-amber-400 mb-2">Incidentes Reportados</h3>
                            <ul className="list-disc list-inside space-y-1">
                                {report.incidentes.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    )}
                     {report.rutas_alternas?.length > 0 && (
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <h3 className="font-bold text-amber-400 mb-2">Rutas Alternas</h3>
                             <ul className="list-disc list-inside space-y-1">
                                {report.rutas_alternas.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            );
        }

        return null;
    };

    const isTrafficFeature = feature === Feature.Traffic;
    const backdropClass = isTrafficFeature
        ? "fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-40 p-4"
        : "fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-40 p-4";


    return (
        <div className={backdropClass}>
            <div className="relative w-full max-w-2xl h-[90vh] bg-gray-900/80 border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col">
                <header className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-amber-400">{getTitle()}</h2>
                    <button onClick={onClose} className="bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-600 transition-colors">&times;</button>
                </header>

                <div className="p-4 flex-grow overflow-y-auto">
                    {isLoading && <div className="flex justify-center items-center h-full"><SpinnerIcon className="w-12 h-12" /></div>}
                    {error && <div className="text-center text-red-400 p-4 bg-red-900/50 rounded-lg">{error}</div>}
                    {!isLoading && !error && renderResults()}
                </div>

                <footer className="p-4 border-t border-gray-700 bg-gray-900/50">
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="text-sm font-medium text-gray-300 block mb-1">Ubicación Actual</label>
                             <input 
                                type="text"
                                value={locationInput}
                                onChange={(e) => setLocationInput(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-amber-500 focus:border-amber-500"
                                placeholder="Ej: Carretera México-Puebla km 90"
                            />
                        </div>

                       {feature !== Feature.Traffic && (
                            <div>
                                 <label className="text-sm font-medium text-gray-300 block mb-1">
                                    {feature === Feature.Parts ? "¿Qué refacción necesitas?" : "¿Qué servicio buscas?"}
                                 </label>
                                 <div className="flex gap-2">
                                     <input 
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-amber-500 focus:border-amber-500"
                                        placeholder={getInputPlaceholder()}
                                    />
                                    <button type="submit" className="bg-amber-500 text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-amber-400 disabled:bg-amber-800" disabled={isLoading}>
                                        Buscar
                                    </button>
                                 </div>
                            </div>
                       )}
                        {feature === Feature.Traffic && (
                           <button type="submit" className="w-full bg-amber-500 text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-amber-400 disabled:bg-amber-800" disabled={isLoading}>
                                Obtener Reporte
                            </button>
                        )}
                    </form>
                </footer>
            </div>
        </div>
    );
};

export default FeaturePanel;