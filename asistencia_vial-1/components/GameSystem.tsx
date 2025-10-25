import React, { useState, useEffect } from 'react';
import { StarIcon } from './icons/StarIcon';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNext: number;
  totalPoints: number;
  streak: number;
  achievements: Achievement[];
}

const GameSystem: React.FC = () => {
  const [stats, setStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    xpToNext: 100,
    totalPoints: 0,
    streak: 0,
    achievements: []
  });

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  const addXP = (amount: number, reason: string) => {
    setStats(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      const leveledUp = newLevel > prev.level;
      
      if (leveledUp) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNext: (newLevel * 100) - newXP,
        totalPoints: prev.totalPoints + amount
      };
    });
  };

  const unlockAchievement = (achievement: Achievement) => {
    setStats(prev => ({
      ...prev,
      achievements: prev.achievements.map(a => 
        a.id === achievement.id ? { ...a, unlocked: true } : a
      )
    }));
    setNewAchievement(achievement);
    setTimeout(() => setNewAchievement(null), 4000);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Level Up Animation */}
      {showLevelUp && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <StarIcon className="w-6 h-6" />
            <span className="font-bold">¡Nivel {stats.level}!</span>
          </div>
        </div>
      )}

      {/* Achievement Unlock */}
      {newAchievement && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse mt-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{newAchievement.icon}</span>
            <div>
              <div className="font-bold">{newAchievement.title}</div>
              <div className="text-sm opacity-90">{newAchievement.description}</div>
            </div>
          </div>
        </div>
      )}

      {/* XP Bar */}
      <div className="bg-gray-800/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg mt-2">
        <div className="flex items-center gap-3">
          <div className="text-sm font-bold">Nivel {stats.level}</div>
          <div className="flex-1 bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((stats.level * 100 - stats.xpToNext) / (stats.level * 100)) * 100}%` }}
            />
          </div>
          <div className="text-xs">{stats.xpToNext} XP</div>
        </div>
      </div>
    </div>
  );
};

export default GameSystem;