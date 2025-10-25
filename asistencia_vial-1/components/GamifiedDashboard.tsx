import React, { useState, useEffect } from 'react';
import Map from './Map';
import SOSModal from './SOSModal';
import ProfilePanel from './ProfilePanel';
import AssistancePanel from './AssistancePanel';
import TrafficReportPanel from './TrafficReportPanel';
import TravelHistoryPanel from './TravelHistoryPanel';
import AchievementsPanel from './AchievementsPanel';
import LeaderboardPanel from './LeaderboardPanel';
import Tutorial from './Tutorial';
import Router from './Router';
import GameSystem from './GameSystem';
import { useGameification } from '../hooks/useGameification';
import { showNotification } from '../utils/notifications';

const GamifiedDashboard: React.FC = () => {
  const [showSOS, setShowSOS] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isFirstTime, setIsFirstTime] = useState(false);
  const { actions } = useGameification();

  useEffect(() => {
    const hasVisited = localStorage.getItem('asistencia_vial_visited');
    if (!hasVisited) {
      setIsFirstTime(true);
      setShowTutorial(true);
      localStorage.setItem('asistencia_vial_visited', 'true');
    } else {
      actions.dailyLogin();
    }

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [actions]);

  const handleSOSClick = () => {
    setShowSOS(true);
    actions.usedSOS();
    showNotification('SOS activado', 'Enviando ubicación a servicios de emergencia...');
  };

  const handleServiceSearch = () => {
    setCurrentView('assistance');
    actions.visitedLocation();
  };

  const handleTrafficReport = () => {
    setCurrentView('traffic');
    actions.reportedTraffic();
  };

  const renderContent = () => {
    switch (currentView) {
      case 'profile':
        return <ProfilePanel />;
      case 'assistance':
        return <AssistancePanel />;
      case 'traffic':
        return <TrafficReportPanel />;
      case 'history':
        return <TravelHistoryPanel />;
      case 'achievements':
        return <AchievementsPanel />;
      case 'leaderboard':
        return <LeaderboardPanel />;
      default:
        return (
          <div className="space-y-6">
            <Map />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={handleSOSClick}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-6 px-4 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🚨 SOS
              </button>
              <button
                onClick={handleServiceSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-4 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🔧 Servicios
              </button>
              <button
                onClick={handleTrafficReport}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 px-4 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🚦 Tráfico
              </button>
              <button
                onClick={() => setCurrentView('achievements')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 px-4 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🏆 Logros
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Router currentView={currentView} onViewChange={setCurrentView}>
        <div className="container mx-auto px-4 py-6">
          {renderContent()}
        </div>
      </Router>
      
      {showSOS && <SOSModal onClose={() => setShowSOS(false)} />}
      {showTutorial && <Tutorial onComplete={() => setShowTutorial(false)} />}
      <GameSystem />
    </div>
  );
};

export default GamifiedDashboard;