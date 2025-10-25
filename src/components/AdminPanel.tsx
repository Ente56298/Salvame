import React, { useState } from 'react';
import UsersIcon from './icons/UsersIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import BuildingIcon from './icons/BuildingIcon';
import LandmarkIcon from './icons/LandmarkIcon';
import GiroManagementPanel from './GiroManagementPanel';
import PublicManagementPanel from './PublicManagementPanel';
import PublicAreaManagementPanel from './PublicAreaManagementPanel';
import { User } from '../types';
import { getUsers, updateUserSubscription } from '../services/authService';

interface AdminPanelProps {
    onClose: () => void;
}

type AdminTab = 'users' | 'giros' | 'public' | 'areas';

const UserManagementPanel: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [updateError, setUpdateError] = useState<string | null>(null); // New state for error handling

    React.useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const fetchedUsers = await getUsers();
                setUsers(fetchedUsers);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
            setLoading(false);
        };
        fetchUsers();
    }, []);
    
    const handleSubscriptionChange = async (userId: string, newStatus: 'free' | 'premium') => {
        // Clear previous error state for this user when a change is attempted
        if (updateError === userId) {
            setUpdateError(null);
        }
        
        const originalUsers = [...users];
        
        // Optimistic UI update
        setUsers(currentUsers => 
            currentUsers.map(u => u.id === userId ? { ...u, subscriptionStatus: newStatus } : u)
        );

        try {
            await updateUserSubscription(userId, newStatus);
        } catch (error) {
            console.error("Failed to update subscription:", error);
            setUsers(originalUsers); // Revert on failure
            setUpdateError(userId); // Set specific user error
            // Automatically clear the error message after 3 seconds for better UX
            setTimeout(() => {
                setUpdateError(currentErrorId => currentErrorId === userId ? null : currentErrorId);
            }, 3000);
        }
    };

    if (loading) return <div className="text-center text-gray-400">Cargando usuarios...</div>;

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-white mb-4">Administrar Usuarios</h3>
            <div className="space-y-3">
                {users.map(user => (
                    <div key={user.id} className="bg-gray-700 p-3 rounded-md flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-200">{user.name}</p>
                            <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                             {updateError === user.id && (
                                <span className="text-xs text-red-400 animate-pulse">Error</span>
                            )}
                            {user.subscriptionStatus === 'admin' ? (
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-indigo-500 text-white`}>
                                    {user.subscriptionStatus}
                                </span>
                            ) : (
                                <select
                                    value={user.subscriptionStatus}
                                    onChange={(e) => handleSubscriptionChange(user.id, e.target.value as 'free' | 'premium')}
                                    className={`rounded-full px-2 py-1 text-xs font-semibold border-0 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-700 ${
                                        updateError === user.id 
                                            ? 'ring-2 ring-red-500' 
                                            : 'focus:ring-indigo-400'
                                    } ${
                                        user.subscriptionStatus === 'premium' ? 'bg-amber-500 text-black' : 'bg-gray-500 text-white'
                                    }`}
                                >
                                    <option value="free">free</option>
                                    <option value="premium">premium</option>
                                </select>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('users');

    const TabButton: React.FC<{ tab: AdminTab; label: string; icon: React.ReactNode }> = ({ tab, label, icon }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center p-3 font-semibold transition-colors duration-200 border-b-4 ${
                activeTab === tab 
                ? 'border-indigo-500 text-white' 
                : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
            }`}
        >
            <div className="w-5 h-5 mr-2">{icon}</div>
            {label}
        </button>
    );

    const renderContent = () => {
        switch(activeTab) {
            case 'users':
                return <UserManagementPanel />;
            case 'giros':
                return <GiroManagementPanel />;
            case 'public':
                return <PublicManagementPanel />;
            case 'areas':
                return <PublicAreaManagementPanel />;
            default:
                return null;
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-40 p-4">
            <div className="relative w-full max-w-4xl h-[90vh] bg-gray-900/80 border border-indigo-500/30 rounded-2xl shadow-2xl flex flex-col">
                <header className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-indigo-400">Panel de Administración</h2>
                    <button onClick={onClose} className="bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-600 transition-colors">&times;</button>
                </header>
                
                <nav className="flex border-b border-gray-700">
                    <TabButton tab="users" label="Usuarios" icon={<UsersIcon />} />
                    <TabButton tab="giros" label="Giros de Negocio" icon={<BriefcaseIcon />} />
                    <TabButton tab="public" label="Gestión Pública" icon={<BuildingIcon />} />
                    <TabButton tab="areas" label="Áreas Públicas" icon={<LandmarkIcon />} />
                </nav>

                <main className="p-6 flex-grow overflow-y-auto">
                   {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;