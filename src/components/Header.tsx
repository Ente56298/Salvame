import React from 'react';
import { User } from '../types';
import ProfileIcon from './icons/ProfileIcon';

interface HeaderProps {
    user: User | null;
    onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onProfileClick }) => {
    return (
        <header className="w-full text-center pb-4 sm:pb-8 relative">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                Asistente Vial <span className="text-amber-400">México</span>
            </h1>
            <p className="mt-2 text-lg text-gray-300">
                {user ? `Bienvenido, ${user.name}` : 'Su copiloto inteligente en el camino'}
            </p>
            {user && (
                <button 
                    onClick={onProfileClick} 
                    className="absolute top-0 right-0 p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                    aria-label="Abrir perfil de usuario"
                >
                    <ProfileIcon />
                </button>
            )}
        </header>
    );
};

export default Header;
