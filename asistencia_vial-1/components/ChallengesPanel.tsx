import React, { useState, useEffect } from 'react';
import { useGameification } from '../hooks/useGameification';

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: number;
  progress: number;
  maxProgress: number;
  timeLeft: number; // hours
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
}

const ChallengesPanel: React.FC = () => {
  const { actions, addXP } = useGameification();
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 'daily_explorer',
      title: 'Explorador Diario',
      description: 'Visita 3 ubicaciones diferentes hoy',
      icon: '🗺️',
      reward: 100,
      progress: 0,
      maxProgress: 3,
      timeLeft: 18,
      difficulty: 'easy',
      completed: false
    },
    {
      id: 'traffic_reporter',
      title: 'Reportero del Día',
      description: 'Reporta 5 incidentes de tráfico',
      icon: '📢',
      reward: 200,
      progress: 0,
      maxProgress: 5,
      timeLeft: 12,
      difficulty: 'medium',
      completed: false
    },
    {
      id: 'helper_hero',
      title: 'Héroe Solidario',
      description: 'Ayuda a 2 conductores en problemas',
      icon: '🤝',
      reward: 300,
      progress: 0,
      maxProgress: 2,
      timeLeft: 6,
      difficulty: 'hard',
      completed: false
    },
    {
      id: 'streak_master',
      title: 'Maestro de Rachas',
      description: 'Mantén una racha de 3 días',
      icon: '🔥',
      reward: 250,
      progress: 1,
      maxProgress: 3,
      timeLeft: 48,
      difficulty: 'medium',
      completed: false
    }
  ]);

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'hard': return 'text-red-400 bg-red-400/20';
    }
  };

  const getDifficultyLabel = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Medio';
      case 'hard': return 'Difícil';
    }
  };

  const formatTimeLeft = (hours: number) => {
    if (hours < 1) return 'Menos de 1 hora';
    if (hours < 24) return `${hours}h restantes`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  };

  const completeChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => {
      if (challenge.id === challengeId && !challenge.completed) {
        addXP(challenge.reward, `Desafío completado: ${challenge.title}`);
        return { ...challenge, completed: true, progress: challenge.maxProgress };
      }
      return challenge;
    }));
  };

  const updateProgress = (challengeId: string, increment: number = 1) => {
    setChallenges(prev => prev.map(challenge => {
      if (challenge.id === challengeId && !challenge.completed) {
        const newProgress = Math.min(challenge.progress + increment, challenge.maxProgress);
        const shouldComplete = newProgress >= challenge.maxProgress;
        
        if (shouldComplete) {
          addXP(challenge.reward, `Desafío completado: ${challenge.title}`);
          return { ...challenge, progress: newProgress, completed: true };
        }
        
        return { ...challenge, progress: newProgress };
      }
      return challenge;
    }));
  };

  // Simulate challenge progress (in real app, this would be triggered by actual actions)
  const simulateProgress = (challengeId: string) => {
    updateProgress(challengeId, 1);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">⚡</span>
        <div>
          <h2 className="text-xl font-bold text-white">Desafíos Diarios</h2>
          <p className="text-gray-400">Completa desafíos para ganar XP extra</p>
        </div>
      </div>

      <div className="space-y-4">
        {challenges.map(challenge => (
          <div
            key={challenge.id}
            className={`p-4 rounded-lg border transition-all ${
              challenge.completed
                ? 'bg-green-600/20 border-green-500/50'
                : 'bg-gray-700 border-gray-600 hover:border-gray-500'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{challenge.icon}</span>
                <div>
                  <h3 className={`font-bold ${challenge.completed ? 'text-green-300' : 'text-white'}`}>
                    {challenge.title}
                  </h3>
                  <p className="text-sm text-gray-400">{challenge.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                  {getDifficultyLabel(challenge.difficulty)}
                </span>
                {challenge.completed && (
                  <span className="text-green-400 text-xl">✅</span>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Progreso</span>
                <span>{challenge.progress} / {challenge.maxProgress}</span>
              </div>
              <div className="bg-gray-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    challenge.completed 
                      ? 'bg-green-500' 
                      : 'bg-gradient-to-r from-blue-400 to-purple-500'
                  }`}
                  style={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-yellow-400 font-bold">+{challenge.reward} XP</span>
                </div>
                <div className="text-sm text-gray-400">
                  ⏰ {formatTimeLeft(challenge.timeLeft)}
                </div>
              </div>

              {!challenge.completed && (
                <button
                  onClick={() => simulateProgress(challenge.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  Simular Progreso
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Challenges Preview */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🏆</span>
          <h3 className="font-bold text-white">Desafíos Semanales</h3>
        </div>
        <p className="text-sm text-gray-300 mb-3">
          Desafíos más difíciles con recompensas mayores. Se renuevan cada lunes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-700/50 p-3 rounded">
            <div className="flex items-center gap-2 mb-1">
              <span>🌟</span>
              <span className="font-medium text-white">Maestro de la Ciudad</span>
            </div>
            <p className="text-gray-400">Visita 25 ubicaciones diferentes</p>
            <p className="text-yellow-400 font-bold">+1000 XP</p>
          </div>
          <div className="bg-gray-700/50 p-3 rounded">
            <div className="flex items-center gap-2 mb-1">
              <span>🛡️</span>
              <span className="font-medium text-white">Guardián Vial</span>
            </div>
            <p className="text-gray-400">Ayuda a 10 conductores</p>
            <p className="text-yellow-400 font-bold">+1500 XP</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengesPanel;