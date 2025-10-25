import React, { useState } from 'react';
import { register } from '../services/authService';
import { User } from '../types';
import SpinnerIcon from './icons/SpinnerIcon';

interface RegisterPanelProps {
    onRegisterSuccess: (user: User) => void;
    onToggleView: () => void;
}

const RegisterPanel: React.FC<RegisterPanelProps> = ({ onRegisterSuccess, onToggleView }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const newUser = await register(name, email, password);
            onRegisterSuccess(newUser);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-white text-center mb-6">Crear Cuenta</h2>
            {error && <p className="bg-red-900/50 text-red-300 text-sm text-center p-3 rounded-md mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-amber-500 focus:border-amber-500 transition"
                        placeholder="Tu nombre completo"
                    />
                </div>
                <div>
                    <label htmlFor="email_reg" className="block text-sm font-medium text-gray-300 mb-1">Correo electrónico</label>
                    <input
                        id="email_reg"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-amber-500 focus:border-amber-500 transition"
                        placeholder="ej. usuario@dominio.com"
                    />
                </div>
                <div>
                    <label htmlFor="password_reg" className="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
                    <input
                        id="password_reg"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-amber-500 focus:border-amber-500 transition"
                        placeholder="••••••••"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-amber-500 text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-amber-400 disabled:bg-amber-800 disabled:cursor-not-allowed flex items-center justify-center transition"
                >
                    {isLoading ? <SpinnerIcon className="w-5 h-5" /> : 'Registrar'}
                </button>
            </form>
            <p className="text-center text-sm text-gray-400 mt-6">
                ¿Ya tienes una cuenta?{' '}
                <button onClick={onToggleView} className="font-semibold text-amber-400 hover:underline focus:outline-none">
                    Inicia Sesión
                </button>
            </p>
        </div>
    );
};

export default RegisterPanel;
