import React, { useState } from 'react';
import { User, Feature } from '../types';
import { getEvaluationResponse, findParts, getTrafficReport, findServices } from '../services/geminiService';

interface FeaturePanelProps {
    user: User;
    selectedFeature: Feature | null;
    onBack: () => void;
}

const FeaturePanel: React.FC<FeaturePanelProps> = ({ user, selectedFeature, onBack }) => {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('Ciudad de México');

    const handleSearch = async () => {
        if (!query.trim()) return;
        
        setLoading(true);
        setResults(null);

        try {
            switch (selectedFeature) {
                case Feature.Evaluation:
                    const evaluation = await getEvaluationResponse(query);
                    setResults({ type: 'evaluation', data: evaluation });
                    break;
                case Feature.Parts:
                    const parts = await findParts(query);
                    setResults({ type: 'parts', data: parts });
                    break;
                case Feature.Traffic:
                    const traffic = await getTrafficReport(location);
                    setResults({ type: 'traffic', data: traffic });
                    break;
                case Feature.Services:
                    const services = await findServices(query, location);
                    setResults({ type: 'services', data: services });
                    break;
            }
        } catch (error) {
            setResults({ type: 'error', data: error.message });
        } finally {
            setLoading(false);
        }
    };

    const getFeatureTitle = () => {
        switch (selectedFeature) {
            case Feature.Evaluation: return '🔍 Asistente Evaluador';
            case Feature.Parts: return '🔧 Buscar Refacciones';
            case Feature.Traffic: return '🚦 Reporte de Tráfico';
            case Feature.Services: return '⛽ Servicios Cercanos';
            case Feature.Assistance: return '🛠️ Tipos de Asistencia';
            case Feature.Partnerships: return '🤝 Convenios';
            default: return 'Función';
        }
    };

    const renderResults = () => {
        if (!results) return null;

        if (results.type === 'error') {
            return (
                <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-lg">
                    <p className="text-red-300">❌ {results.data}</p>
                </div>
            );
        }

        switch (results.type) {
            case 'evaluation':
                return (
                    <div className="bg-blue-900/30 border border-blue-500/30 p-4 rounded-lg">
                        <h3 className="font-bold mb-2">📋 Evaluación</h3>
                        <div className="whitespace-pre-wrap text-sm">{results.data}</div>
                    </div>
                );
            case 'parts':
                return (
                    <div className="space-y-4">
                        <h3 className="font-bold">🔧 Refacciones Encontradas</h3>
                        {results.data.map((part: any, index: number) => (
                            <div key={index} className="bg-gray-700 p-4 rounded-lg">
                                <h4 className="font-bold text-blue-300">{part.nombre}</h4>
                                <p className="text-sm text-gray-300 mb-2">{part.descripcion}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-green-400 font-bold">${part.precio_estimado}</span>
                                    <span className="text-gray-400 text-sm">{part.proveedor_sugerido}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'traffic':
                return (
                    <div className="space-y-4">
                        <h3 className="font-bold">🚦 Reporte de Tráfico</h3>
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="font-bold mb-2">Resumen</h4>
                            <p className="text-sm">{results.data.resumen}</p>
                        </div>
                        {results.data.incidentes && results.data.incidentes.length > 0 && (
                            <div className="bg-yellow-900/30 border border-yellow-500/30 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">⚠️ Incidentes</h4>
                                <ul className="text-sm space-y-1">
                                    {results.data.incidentes.map((incident: string, index: number) => (
                                        <li key={index}>• {incident}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {results.data.rutas_alternas && results.data.rutas_alternas.length > 0 && (
                            <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">🛣️ Rutas Alternas</h4>
                                <ul className="text-sm space-y-1">
                                    {results.data.rutas_alternas.map((route: string, index: number) => (
                                        <li key={index}>• {route}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );
            case 'services':
                return (
                    <div className="space-y-4">
                        <h3 className="font-bold">⛽ Servicios Encontrados</h3>
                        {results.data.map((service: any, index: number) => (
                            <div key={index} className="bg-gray-700 p-4 rounded-lg">
                                <h4 className="font-bold text-blue-300">{service.nombre}</h4>
                                <p className="text-sm text-gray-300">{service.tipo}</p>
                                <p className="text-sm text-gray-400 mb-2">📍 {service.ubicacion_aproximada}</p>
                                {service.telefono && (
                                    <p className="text-sm text-green-400">📞 {service.telefono}</p>
                                )}
                            </div>
                        ))}
                    </div>
                );
        }
    };

    if (!selectedFeature) return null;

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={onBack}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    ← Volver
                </button>
                <h2 className="text-xl font-bold">{getFeatureTitle()}</h2>
            </div>

            {selectedFeature === Feature.Assistance && (
                <div className="space-y-4">
                    <h3 className="font-bold mb-4">🛠️ Tipos de Asistencia Disponibles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="font-bold text-blue-300 mb-2">🔧 Asistencia Mecánica</h4>
                            <p className="text-sm text-gray-300">Diagnóstico y reparación de fallas mecánicas básicas</p>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="font-bold text-red-300 mb-2">🚑 Asistencia Médica</h4>
                            <p className="text-sm text-gray-300">Primeros auxilios y emergencias médicas</p>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="font-bold text-yellow-300 mb-2">🛡️ Asistencia de Seguridad</h4>
                            <p className="text-sm text-gray-300">Protocolos de seguridad vial y personal</p>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="font-bold text-purple-300 mb-2">⚱️ Asistencia Funeraria</h4>
                            <p className="text-sm text-gray-300">Apoyo en situaciones de fatalidad</p>
                        </div>
                    </div>
                </div>
            )}

            {selectedFeature === Feature.Partnerships && (
                <div className="space-y-4">
                    <h3 className="font-bold mb-4">🤝 Convenios Activos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-lg text-center">
                            <div className="text-3xl mb-2">🏪</div>
                            <h4 className="font-bold">OXXO</h4>
                            <p className="text-sm text-gray-300">Descuentos en productos</p>
                        </div>
                        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg text-center">
                            <div className="text-3xl mb-2">⛽</div>
                            <h4 className="font-bold">PEMEX</h4>
                            <p className="text-sm text-gray-300">Puntos y descuentos</p>
                        </div>
                        <div className="bg-blue-900/30 border border-blue-500/30 p-4 rounded-lg text-center">
                            <div className="text-3xl mb-2">🔧</div>
                            <h4 className="font-bold">AutoZone</h4>
                            <p className="text-sm text-gray-300">Refacciones con descuento</p>
                        </div>
                    </div>
                </div>
            )}

            {[Feature.Evaluation, Feature.Parts, Feature.Services].includes(selectedFeature) && (
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={
                                selectedFeature === Feature.Evaluation ? "Describe el problema de tu vehículo..." :
                                selectedFeature === Feature.Parts ? "¿Qué refacción necesitas?" :
                                "¿Qué servicio buscas?"
                            }
                            className="flex-1 bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        {selectedFeature !== Feature.Evaluation && (
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Ubicación"
                                className="w-48 bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                            />
                        )}
                        <button
                            onClick={handleSearch}
                            disabled={loading || !query.trim()}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            {loading ? '⏳' : '🔍'}
                        </button>
                    </div>
                </div>
            )}

            {selectedFeature === Feature.Traffic && (
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Ubicación para reporte de tráfico"
                            className="flex-1 bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            {loading ? '⏳' : '📊'}
                        </button>
                    </div>
                </div>
            )}

            {loading && (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                    <span className="ml-3 text-gray-300">Procesando...</span>
                </div>
            )}

            {results && (
                <div className="mt-6">
                    {renderResults()}
                </div>
            )}
        </div>
    );
};

export default FeaturePanel;