import React, { useState, useEffect } from 'react';

const PartnerDashboard: React.FC = () => {
    const [activeRequests, setActiveRequests] = useState([
        { id: 1, user: "María González", location: "Polanco, CDMX", issue: "Batería descargada", eta: "8 min", price: "$450", status: "pending" },
        { id: 2, user: "Carlos Ruiz", location: "Roma Norte", issue: "Llanta ponchada", eta: "12 min", price: "$320", status: "accepted" },
        { id: 3, user: "Ana López", location: "Condesa", issue: "Motor no enciende", eta: "15 min", price: "$680", status: "in_progress" }
    ]);

    const [stats] = useState({
        todayEarnings: 2340,
        completedServices: 8,
        rating: 4.8,
        responseTime: "3.2 min"
    });

    const handleAcceptRequest = (id: number) => {
        setActiveRequests(prev => 
            prev.map(req => 
                req.id === id ? { ...req, status: "accepted" } : req
            )
        );
    };

    const handleCompleteService = (id: number) => {
        setActiveRequests(prev => 
            prev.map(req => 
                req.id === id ? { ...req, status: "completed" } : req
            )
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500';
            case 'accepted': return 'bg-blue-500';
            case 'in_progress': return 'bg-green-500';
            case 'completed': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Pendiente';
            case 'accepted': return 'Aceptado';
            case 'in_progress': return 'En progreso';
            case 'completed': return 'Completado';
            default: return 'Desconocido';
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Panel Socio</h1>
                        <p className="text-gray-400">Juan Pérez - Mecánico Certificado</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <div className="text-green-400 font-bold">🟢 En línea</div>
                            <div className="text-sm text-gray-400">Disponible para servicios</div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-800 rounded-xl p-4">
                        <div className="text-2xl font-bold text-green-400">${stats.todayEarnings}</div>
                        <div className="text-sm text-gray-400">Ganancias Hoy</div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-4">
                        <div className="text-2xl font-bold text-blue-400">{stats.completedServices}</div>
                        <div className="text-sm text-gray-400">Servicios Hoy</div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-4">
                        <div className="text-2xl font-bold text-yellow-400">⭐ {stats.rating}</div>
                        <div className="text-sm text-gray-400">Rating</div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-4">
                        <div className="text-2xl font-bold text-purple-400">{stats.responseTime}</div>
                        <div className="text-sm text-gray-400">Tiempo Respuesta</div>
                    </div>
                </div>

                {/* Active Requests */}
                <div className="bg-gray-800 rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4">Solicitudes Activas</h2>
                    <div className="space-y-4">
                        {activeRequests.map((request) => (
                            <div key={request.id} className="bg-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-white font-bold">
                                                {request.user.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-bold">{request.user}</div>
                                            <div className="text-sm text-gray-400">📍 {request.location}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-green-400">{request.price}</div>
                                        <div className="text-sm text-gray-400">ETA: {request.eta}</div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="text-sm text-gray-300 mb-1">Problema:</div>
                                    <div className="font-semibold">{request.issue}</div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(request.status)}`}></div>
                                        <span className="text-sm">{getStatusText(request.status)}</span>
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                        {request.status === 'pending' && (
                                            <>
                                                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">
                                                    Rechazar
                                                </button>
                                                <button 
                                                    onClick={() => handleAcceptRequest(request.id)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                                                >
                                                    Aceptar
                                                </button>
                                            </>
                                        )}
                                        {request.status === 'accepted' && (
                                            <button 
                                                onClick={() => handleCompleteService(request.id)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                                            >
                                                Iniciar Servicio
                                            </button>
                                        )}
                                        {request.status === 'in_progress' && (
                                            <button 
                                                onClick={() => handleCompleteService(request.id)}
                                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
                                            >
                                                Completar
                                            </button>
                                        )}
                                        <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm">
                                            📞 Llamar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl font-semibold">
                        🟢 Disponible
                    </button>
                    <button className="bg-yellow-600 hover:bg-yellow-700 text-white p-4 rounded-xl font-semibold">
                        ⏸️ Pausa
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-semibold">
                        📊 Reportes
                    </button>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl font-semibold">
                        ⚙️ Configuración
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PartnerDashboard;