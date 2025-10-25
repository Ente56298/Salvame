import React, { useState, useEffect } from 'react';
import type { Part, Service, TrafficReport, LocationCoords } from '../types';
import { Feature } from '../types';
import { findParts, getTrafficReport, findServices } from '../services/geminiService';
import SpinnerIcon from './icons/SpinnerIcon';

interface EnhancedFeaturePanelProps {
    feature: Feature;
    onClose: () => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    results: Part[] | Service[] | TrafficReport | string | null;
    setResults: (results: any) => void;
    currentLocation: LocationCoords | null;
    onShowOnMap?: (services: Service[]) => void;
}

const EnhancedFeaturePanel: React.FC<EnhancedFeaturePanelProps> = ({
    feature,
    onClose,
    isLoading,
    setIsLoading,
    error,
    setError,
    results,
    setResults,
    currentLocation,
    onShowOnMap
}) => {
    const [query, setQuery] = useState('');
    const [locationInput, setLocationInput] = useState('Obteniendo ubicación...');
    const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
    const [providerFilter, setProviderFilter] = useState<string>('all');

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

    const getFilteredParts = () => {
        if (!Array.isArray(results) || feature !== Feature.Parts) return [];
        
        let filtered = results as Part[];
        
        if (priceFilter !== 'all') {
            filtered = filtered.filter(part => {
                const price = part.precio_estimado;
                switch (priceFilter) {
                    case 'low': return price < 500;
                    case 'medium': return price >= 500 && price < 2000;
                    case 'high': return price >= 2000;
                    default: return true;
                }
            });
        }
        
        if (providerFilter !== 'all') {
            filtered = filtered.filter(part => part.proveedor_sugerido === providerFilter);
        }
        
        return filtered;
    };

    const getUniqueProviders = () => {
        if (!Array.isArray(results) || feature !== Feature.Parts) return [];
        return [...new Set((results as Part[]).map(part => part.proveedor_sugerido))];
    };

    const renderTrafficReport = (report: TrafficReport) => (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-6 rounded-xl border border-blue-500/30">
                <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-2xl">📊</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-blue-300">Resumen General</h3>
                        <p className="text-blue-200 text-sm">Estado actual del tráfico</p>
                    </div>
                </div>
                <p className="text-gray-200 leading-relaxed">{report.resumen}</p>
            </div>

            {report.incidentes?.length > 0 && (
                <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 p-6 rounded-xl border border-red-500/30">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-red-300">Incidentes Activos</h3>
                            <p className="text-red-200 text-sm">{report.incidentes.length} reportes</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {report.incidentes.map((incident, i) => (
                            <div key={i} className="bg-red-800/30 p-3 rounded-lg border-l-4 border-red-400">
                                <p className="text-gray-200">{incident}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {report.rutas_alternas?.length > 0 && (
                <div className="bg-gradient-to-r from-green-900/50 to-teal-900/50 p-6 rounded-xl border border-green-500/30">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                            <span className="text-2xl">🛣️</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-green-300">Rutas Alternas</h3>
                            <p className="text-green-200 text-sm">Opciones recomendadas</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {report.rutas_alternas.map((route, i) => (
                            <div key={i} className="bg-green-800/30 p-3 rounded-lg border-l-4 border-green-400">
                                <p className="text-gray-200">{route}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const renderResults = () => {
        if (!results) return null;

        if (feature === Feature.Parts && Array.isArray(results)) {
            const filteredParts = getFilteredParts();
            return (
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-3 mb-4">
                        <select
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(e.target.value as any)}
                            className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
                        >
                            <option value="all">Todos los precios</option>
                            <option value="low">Económico (&lt;$500)</option>
                            <option value="medium">Medio ($500-$2000)</option>
                            <option value="high">Premium (&gt;$2000)</option>
                        </select>
                        
                        <select
                            value={providerFilter}
                            onChange={(e) => setProviderFilter(e.target.value)}
                            className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
                        >
                            <option value="all">Todos los proveedores</option>
                            {getUniqueProviders().map(provider => (
                                <option key={provider} value={provider}>{provider}</option>
                            ))}
                        </select>
                    </div>

                    {filteredParts.map((part, index) => (
                        <div key={index} className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-xl border border-amber-500/30">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-amber-400 text-lg">{part.nombre}</h3>
                                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                    ${part.precio_estimado.toFixed(2)}
                                </span>
                            </div>
                            <p className="text-gray-300 mb-3">{part.descripcion}</p>
                            <div className="flex justify-between items-center">
                                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                                    {part.proveedor_sugerido}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (feature === Feature.Services && Array.isArray(results)) {
            return (
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-amber-400">Servicios Encontrados</h3>
                        {onShowOnMap && (
                            <button
                                onClick={() => onShowOnMap(results as Service[])}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                            >
                                📍 Ver en Mapa
                            </button>
                        )}
                    </div>
                    
                    {(results as Service[]).map((service, index) => (
                        <div key={index} className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-xl border border-blue-500/30">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-white">🏪</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-blue-400 text-lg">{service.nombre}</h3>
                                        <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                                            {service.tipo}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-300 mb-2">📍 {service.ubicacion_aproximada}</p>
                            {service.telefono && (
                                <p className="text-green-400 font-semibold">📞 {service.telefono}</p>
                            )}
                        </div>
                    ))}
                </div>
            );
        }
        
        if (feature === Feature.Traffic && typeof results === 'object' && 'resumen' in results) {
            return renderTrafficReport(results as TrafficReport);
        }

        return null;
    };

    const getTitle = () => {
        switch (feature) {
            case Feature.Parts: return "🔧 Buscador de Refacciones";
            case Feature.Traffic: return "🚦 Reporte de Tráfico";
            case Feature.Services: return "🏪 Localizador de Servicios";
            default: return "Asistente Vial";
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-40 p-4">
            <div className="relative w-full max-w-4xl h-[90vh] bg-gray-900/90 border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col">
                <header className="p-6 border-b border-gray-700 flex justify-between items-center bg-gradient-to-r from-gray-800 to-gray-700 rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-amber-400">{getTitle()}</h2>
                    <button 
                        onClick={onClose} 
                        className="bg-gray-700 hover:bg-gray-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                    >
                        ✕
                    </button>
                </header>

                <div className="p-6 flex-grow overflow-y-auto custom-scrollbar">
                    {isLoading && (
                        <div className="flex flex-col justify-center items-center h-full">
                            <SpinnerIcon className="w-16 h-16 text-amber-400 mb-4" />
                            <p className="text-gray-300">Buscando información...</p>
                        </div>
                    )}
                    {error && (
                        <div className="text-center text-red-400 p-6 bg-red-900/50 rounded-xl border border-red-500/30">
                            <div className="text-4xl mb-4">⚠️</div>
                            <p className="text-lg font-semibold mb-2">Error</p>
                            <p>{error}</p>
                        </div>
                    )}
                    {!isLoading && !error && renderResults()}
                </div>

                <footer className="p-6 border-t border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700 rounded-b-2xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-300 block mb-2">📍 Ubicación Actual</label>
                            <input 
                                type="text"
                                value={locationInput}
                                onChange={(e) => setLocationInput(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                placeholder="Ej: Carretera México-Puebla km 90"
                            />
                        </div>

                        {feature !== Feature.Traffic && (
                            <div>
                                <label className="text-sm font-medium text-gray-300 block mb-2">
                                    {feature === Feature.Parts ? "🔧 ¿Qué refacción necesitas?" : "🏪 ¿Qué servicio buscas?"}
                                </label>
                                <div className="flex gap-3">
                                    <input 
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="flex-grow bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                        placeholder={feature === Feature.Parts ? "Ej: balatas para Tsuru 2010" : "Ej: Gasolinera o Taller mecánico"}
                                    />
                                    <button 
                                        type="submit" 
                                        className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-3 px-6 rounded-lg disabled:bg-amber-800 disabled:cursor-not-allowed transition-colors" 
                                        disabled={isLoading}
                                    >
                                        🔍 Buscar
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {feature === Feature.Traffic && (
                            <button 
                                type="submit" 
                                className="w-full bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-3 px-6 rounded-lg disabled:bg-amber-800 disabled:cursor-not-allowed transition-colors" 
                                disabled={isLoading}
                            >
                                📊 Obtener Reporte
                            </button>
                        )}
                    </form>
                </footer>
            </div>
        </div>
    );
};

export default EnhancedFeaturePanel;