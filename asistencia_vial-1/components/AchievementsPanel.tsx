import React from 'react';
import { Achievement } from '../components/GameSystem';
import { useGameification } from '../hooks/useGameification';

const AchievementsPanel: React.FC = () => {
  const { stats } = useGameification();

  const unlockedAchievements = stats.achievements.filter(a => a.unlocked);
  const lockedAchievements = stats.achievements.filter(a => !a.unlocked);

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🏆</span>
        <div>
          <h2 className="text-xl font-bold text-white">Logros</h2>
          <p className="text-gray-400">{unlockedAchievements.length} de {stats.achievements.length} desbloqueados</p>
        </div>
      </div>

      {/* Player Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-700 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.level}</div>
          <div className="text-sm text-gray-300">Nivel</div>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-400">{stats.totalPoints}</div>
          <div className="text-sm text-gray-300">Puntos</div>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-400">{stats.streak}</div>
          <div className="text-sm text-gray-300">Racha</div>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-400">{unlockedAchievements.length}</div>
          <div className="text-sm text-gray-300">Logros</div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Nivel {stats.level}</span>
          <span>{stats.xp} / {stats.level * 100} XP</span>
        </div>
        <div className="bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((stats.level * 100 - stats.xpToNext) / (stats.level * 100)) * 100}%` }}
          />
        </div>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">🌟 Desbloqueados</h3>
          <div className="grid gap-3">
            {unlockedAchievements.map(achievement => (
              <div key={achievement.id} className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{achievement.title}</h4>
                    <p className="text-sm text-gray-300">{achievement.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-yellow-400">+{achievement.points}</div>
                    <div className="text-xs text-gray-400">puntos</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">🔒 Por desbloquear</h3>
          <div className="grid gap-3">
            {lockedAchievements.map(achievement => (
              <div key={achievement.id} className="bg-gray-700/50 border border-gray-600 p-4 rounded-lg opacity-75">
                <div className="flex items-center gap-3">
                  <span className="text-3xl grayscale">{achievement.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-300">{achievement.title}</h4>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                    {achievement.maxProgress && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Progreso</span>
                          <span>{achievement.progress || 0} / {achievement.maxProgress}</span>
                        </div>
                        <div className="bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-gray-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((achievement.progress || 0) / achievement.maxProgress) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-400">+{achievement.points}</div>
                    <div className="text-xs text-gray-500">puntos</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsPanel;