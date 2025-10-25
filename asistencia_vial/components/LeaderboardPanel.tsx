import React, { useState, useEffect } from 'react';
import { useGameification } from '../hooks/useGameification';

interface LeaderboardEntry {
  id: string;
  username: string;
  level: number;
  totalPoints: number;
  achievements: number;
  streak: number;
  avatar?: string;
}

const LeaderboardPanel: React.FC = () => {
  const { stats } = useGameification();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');

  useEffect(() => {
    // Simulate leaderboard data (in real app, fetch from API)
    const mockLeaderboard: LeaderboardEntry[] = [
      { id: '1', username: 'ConductorPro', level: 15, totalPoints: 2850, achievements: 12, streak: 25 },
      { id: '2', username: 'VialExpert', level: 12, totalPoints: 2340, achievements: 10, streak: 18 },
      { id: '3', username: 'RoadMaster', level: 11, totalPoints: 2100, achievements: 9, streak: 15 },
      { id: '4', username: 'SafeDriver', level: 10, totalPoints: 1890, achievements: 8, streak: 12 },
      { id: '5', username: 'TrafficHero', level: 9, totalPoints: 1650, achievements: 7, streak: 10 },
      // Add current user
      { 
        id: 'current', 
        username: 'Tú', 
        level: stats.level, 
        totalPoints: stats.totalPoints, 
        achievements: stats.achievements.filter(a => a.unlocked).length,
        streak: stats.streak 
      }
    ].sort((a, b) => b.totalPoints - a.totalPoints);

    setLeaderboard(mockLeaderboard);
  }, [stats, timeframe]);

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${position}`;
    }
  };

  const currentUserRank = leaderboard.findIndex(entry => entry.id === 'current') + 1;

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏆</span>
          <div>
            <h2 className="text-xl font-bold text-white">Clasificación</h2>
            <p className="text-gray-400">Compite con otros conductores</p>
          </div>
        </div>
        
        <div className="flex bg-gray-700 rounded-lg p-1">
          {(['weekly', 'monthly', 'alltime'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                timeframe === period
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {period === 'weekly' ? 'Semanal' : period === 'monthly' ? 'Mensual' : 'Histórico'}
            </button>
          ))}
        </div>
      </div>

      {/* Current User Stats */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-4 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              {stats.level}
            </div>
            <div>
              <h3 className="font-bold text-white">Tu Posición</h3>
              <p className="text-sm text-gray-300">Nivel {stats.level} • {stats.totalPoints} puntos</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-400">#{currentUserRank}</div>
            <div className="text-sm text-gray-400">de {leaderboard.length}</div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-3">
        {leaderboard.slice(0, 10).map((entry, index) => {
          const position = index + 1;
          const isCurrentUser = entry.id === 'current';
          
          return (
            <div
              key={entry.id}
              className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                isCurrentUser
                  ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-blue-500/50'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {/* Rank */}
              <div className="w-12 text-center">
                <span className="text-2xl font-bold">
                  {typeof getRankIcon(position) === 'string' && getRankIcon(position).startsWith('#') 
                    ? <span className="text-gray-400">{getRankIcon(position)}</span>
                    : getRankIcon(position)
                  }
                </span>
              </div>

              {/* Avatar */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                isCurrentUser 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                  : 'bg-gradient-to-r from-gray-500 to-gray-600'
              }`}>
                {entry.level}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h4 className={`font-bold ${isCurrentUser ? 'text-blue-300' : 'text-white'}`}>
                  {entry.username}
                </h4>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>Nivel {entry.level}</span>
                  <span>🏆 {entry.achievements} logros</span>
                  <span>🔥 {entry.streak} días</span>
                </div>
              </div>

              {/* Points */}
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-400">
                  {entry.totalPoints.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">puntos</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rewards Info */}
      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🎁</span>
          <h3 className="font-bold text-white">Recompensas Semanales</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="text-yellow-400 font-bold">🥇 1er Lugar</div>
            <div className="text-gray-300">500 puntos bonus</div>
          </div>
          <div>
            <div className="text-gray-300 font-bold">🥈 2do Lugar</div>
            <div className="text-gray-300">300 puntos bonus</div>
          </div>
          <div>
            <div className="text-orange-400 font-bold">🥉 3er Lugar</div>
            <div className="text-gray-300">200 puntos bonus</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPanel;