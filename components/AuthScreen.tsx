import React, { useState } from 'react';
import LoginPanel from './LoginPanel';
import RegisterPanel from './RegisterPanel';
import { User } from '../types';

interface AuthScreenProps {
    onLoginSuccess: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
    const [showLogin, setShowLogin] = useState(true);

    const toggleView = () => setShowLogin(!showLogin);

    return (
        <div className="relative min-h-screen w-full bg-gray-900 text-white font-sans flex flex-col items-center justify-center p-4">
             <div 
                className="absolute inset-0 bg-cover bg-center opacity-20" 
                style={{backgroundImage: "url('https://picsum.photos/seed/mexico-auth/1920/1080')"}}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/80 to-gray-900"></div>

            <div className="relative z-10 w-full max-w-md">
                 <header className="w-full text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                        Asistente Vial <span className="text-amber-400">México</span>
                    </h1>
                    <p className="mt-2 text-lg text-gray-300">Su copiloto inteligente en el camino</p>
                </header>

                {showLogin ? (
                    <LoginPanel onLoginSuccess={onLoginSuccess} onToggleView={toggleView} />
                ) : (
                    <RegisterPanel onRegisterSuccess={onLoginSuccess} onToggleView={toggleView} />
                )}
            </div>
        </div>
    );
};

export default AuthScreen;
