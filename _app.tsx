
import React, { useState, useEffect } from 'react';
import type { User, LocationCoords, Part, Service, TrafficReport, Theme } from './types';
import { Feature, AssistanceType } from './types';
import { getCurrentUser, logout } from './services/authService';
import { initialPartners } from './data/partnersData';
import LandingScreen from './components/LandingScreen';
import Sidebar from './components/Sidebar';
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
import ExplorePanel from './components/ExplorePanel';
import BusinessDirectoryPanel from './components/BusinessDirectoryPanel';
import BusinessManagementPanel from './components/BusinessManagementPanel';


const App: React.FC = () => {
    // State management
    const [user, setUser] = useState<User | null>(null);
    const [isAppLoading, setIsAppLoading] = useState(true);
    const [isSOSActive, setIsSOSActive] = useState(false);
    const [activeFeature, setActiveFeature] = useState<Feature | null>(null);
    const [activeAssistanceType, setActiveAssistanceType] = useState<AssistanceType | null>(null);
    const [theme, setTheme] = useState<Theme>('dark');
    
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

        // Theme initialization
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme) {
            setTheme(savedTheme);
        }

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

     // Effect to apply theme changes
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Handlers
    const handleLoginSuccess = (loggedInUser: User) => {
        setUser(loggedInUser);
    };

    const handleLogout = () => {
        logout();
        setUser(null);
        setActiveFeature(null);
    };

    const handleFeatureSelect = (feature: Feature | null) => {
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
        return <div className="bg-white dark:bg-gray-900 min-h-screen"></div>; // Or a proper loading screen
    }

    if (!user) {
        return <LandingScreen onLoginSuccess={handleLoginSuccess} />;
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
                 return <ProfilePanel user={user} onClose={closeAllPanels} onLogout={handleLogout} theme={theme} onThemeChange={setTheme} />;
            case Feature.Subscription:
                 return <SubscriptionPanel onClose={closeAllPanels} onSubscribe={handleSubscribe} />;
            case Feature.Partnerships:
                 return <PartnersPanel onClose={closeAllPanels} partners={initialPartners} />;
            case Feature.Admin:
                 return <AdminPanel onClose={closeAllPanels} />;
            case Feature.Explore:
                 return <ExplorePanel onClose={closeAllPanels} />;
            case Feature.Businesses:
                 return <BusinessDirectoryPanel onClose={closeAllPanels} />;
            case Feature.BUSINESS_MANAGEMENT:
                 return user.businessId ? <BusinessManagementPanel user={user} onClose={closeAllPanels} /> : null;
            default:
                return null;
        }
    };


    return (
        <div className="relative min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-sans">
            <Map location={location} error={locationError} theme={theme} />
            
            <Sidebar
                user={user}
                activeFeature={activeFeature}
                onFeatureSelect={handleFeatureSelect}
                onActivateSOS={() => setIsSOSActive(true)}
                onProfileClick={() => setActiveFeature(Feature.Profile)}
            />
            
            {isSOSActive && <SOSModal onClose={closeAllPanels} />}
            {activeAssistanceType && <AgentChatPanel assistanceType={activeAssistanceType} onClose={closeAllPanels} />}
            {renderPanel()}
        </div>
    );
};

export default App;
