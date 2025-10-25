import React from 'react';
import { User } from '../types';

interface ProfilePanelProps {
    user: User;
    onClose: () => void;
    onLogout: () => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ user, onClose, onLogout }) => {
    
    const getSubscriptionPill = () => {
        switch (user.subscriptionStatus) {
            case 'premium':
                return <span className="text-lg font-semibold text-amber-400">Premium</span>;
            case 'admin':
                return <span className="text-lg font-semibold text-indigo-400">Administrador</span>;
            default:
                return <span className="text-lg font-semibold text-gray-300">Gratuita</span>;
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-md bg-gray-900/80 border border-gray-700 rounded-2xl shadow-2xl flex flex-col">
                <header className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Perfil de Usuario</h2>
                    <button onClick={onClose} className="bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-600 transition-colors" aria-label="Cerrar">&times;</button>
                </header>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-sm text-gray-400">Nombre</label>
                        <p className="text-lg text-white">{user.name}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">Correo Electrónico</label>
                        <p className="text-lg text-white">{user.email}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">Estado de Suscripción</label>
                        {getSubscriptionPill()}
                    </div>
                </div>
                <footer className="p-4 mt-4 border-t border-gray-700">
                    <button
                        onClick={onLogout}
                        className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-500 transition-colors"
                    >
                        Cerrar Sesión
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ProfilePanel;
