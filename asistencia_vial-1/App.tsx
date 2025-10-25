import React, { useState, useEffect } from 'react';
import type { User, LocationCoords, Part, Service, TrafficReport, Partner } from './types';
import { Feature, AssistanceType } from './types';
import { getCurrentUser, logout, login as authLogin } from './services/authService';
import { initialPartners } from './data/partnersData';
import AuthScreen from './components/AuthScreen';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SOSModal from './components/SOSModal';
import Map from './components/Map';
import FeaturePanel from './components/FeaturePanel';
import EvaluationPanel from './components/EvaluationPanel';
import AssistancePanel from './components/AssistancePanel';
import AgentChatPanel from './components/AgentChatPanel';
import ProfilePanel from './components/ProfilePanel';
import SubscriptionPanel from './components/SubscriptionPanel';
import PartnersPanel from './components/PartnersPanel';
import AdminPanel from './components/AdminPanel';
import FunctionAccessPanel from './components/FunctionAccessPanel';

const App: React.FC = () => {
    // State management
    const [user, setUser] = useState<User | null>(null);
    const [isAppLoading, setIsAppLoading] = useState(true);
    const [isSOSActive, setIsSOSActive] = useState(false);
    const [activeFeature, setActiveFeature] = useState<Feature | null>(null);
    const [activeAssistanceType, setActiveAssistanceType] = useState<AssistanceType | null>(null);
    
    // Location state
    const [location, setLocation] = useState<LocationCoords | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    
    // Feature Panel State
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<Part[] | Service[] | TrafficReport | string | null>(null);

    // Get user and location on initial load
    useEffect(() => {
        const loggedInUser = getCurrentUser();
        if (loggedInUser) {
            setUser(loggedInUser);
        }
        setIsAppLoading(false);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
                setLocationError(null);
            },
            (err) => {
                setLocationError('No se pudo obtener la ubicación. Activa los permisos de geolocalización.');
                console.error(err);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, []);

    // Handlers
    const handleLoginSuccess = (loggedInUser: User) => {
        setUser(loggedInUser);
    };

    const handleLogout = () => {
        logout();
        setUser(null);
        setActiveFeature(null);
    };

    const handleFeatureSelect = (feature: Feature) => {
        setResults(null);
        setError(null);
        setActiveFeature(feature);
    };

    const handleAssistanceSelect = (type: AssistanceType) => {
        if (user?.subscriptionStatus === 'free' && type !== AssistanceType.Mechanic) {
            setActiveFeature(Feature.Subscription);
        } else {
            setActiveAssistanceType(type);
            setActiveFeature(null); // Close the selection panel
        }
    };
    
    const handleNavigate = (feature: Feature) => {
        closeAllPanels();
        handleFeatureSelect(feature);
    };

    const handleSubscribe = () => {
        if (user) {
            const updatedUser = { ...user, subscriptionStatus: 'premium' as const };
            setUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            setActiveFeature(null);
            // In a real app, you would call a backend service here.
        }
    };
    
    const closeAllPanels = () => {
        setActiveFeature(null);
        setActiveAssistanceType(null);
        setIsSOSActive(false);
    }
    
    // Render logic
    if (isAppLoading) {
        return <div className="bg-gray-900 min-h-screen"></div>; // Or a proper loading screen
    }

    if (!user) {
        return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
    }

    const renderPanel = () => {
        const featurePanelFeatures = [Feature.Parts, Feature.Traffic, Feature.Services];
        if (featurePanelFeatures.includes(activeFeature as Feature)) {
             return (
                 <FeaturePanel
                    feature={activeFeature as Feature.Parts | Feature.Traffic | Feature.Services}
                    onClose={closeAllPanels}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    error={error}
                    setError={setError}
                    results={results}
                    setResults={setResults}
                    currentLocation={location}
                />
            );
        }

        switch (activeFeature) {
            case Feature.Evaluation:
                return <EvaluationPanel onClose={closeAllPanels} onNavigate={handleNavigate} />;
            case Feature.Assistance:
                return <AssistancePanel onClose={closeAllPanels} onSelect={handleAssistanceSelect} user={user} />;
            case Feature.Profile:
                 return <ProfilePanel user={user} onClose={closeAllPanels} onLogout={handleLogout} />;
            case Feature.Subscription:
                 return <SubscriptionPanel onClose={closeAllPanels} onSubscribe={handleSubscribe} />;
            case Feature.Partnerships:
                 return <PartnersPanel onClose={closeAllPanels} partners={initialPartners} />;
            case Feature.Admin:
                 return <AdminPanel onClose={closeAllPanels} />;
            case Feature.Functions:
                 return <FunctionAccessPanel />;
            default:
                return null;
        }
    };


    return (
        <div className="relative min-h-screen w-full bg-gray-900 text-white font-sans">
            <Map location={location} error={locationError} />
            
            <main className="relative z-40 p-4 sm:p-6 md:p-8 min-h-screen w-full flex flex-col items-center bg-black/40">
                <Header user={user} onProfileClick={() => setActiveFeature(Feature.Profile)} />
                <div className="flex-grow flex items-center justify-center w-full">
                    <Dashboard
                        user={user}
                        onFeatureSelect={handleFeatureSelect}
                        onActivateSOS={() => setIsSOSActive(true)}
                        onSubscriptionPrompt={() => setActiveFeature(Feature.Subscription)}
                    />
                </div>
            </main>
            
            {isSOSActive && <SOSModal onClose={closeAllPanels} />}
            {activeAssistanceType && <AgentChatPanel assistanceType={activeAssistanceType} onClose={closeAllPanels} />}
            {renderPanel()}
        </div>
    );
};

export default App;
