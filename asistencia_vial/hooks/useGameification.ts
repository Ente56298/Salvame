import { useState, useEffect } from 'react';
import { Achievement, UserStats } from '../components/GameSystem';

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_sos',
    title: '🚨 Primera Emergencia',
    description: 'Usaste el botón SOS por primera vez',
    icon: '🚨',
    points: 50,
    unlocked: false
  },
  {
    id: 'explorer',
    title: '🗺️ Explorador',
    description: 'Visitaste 5 ubicaciones diferentes',
    icon: '🗺️',
    points: 100,
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'reporter',
    title: '📢 Reportero Vial',
    description: 'Reportaste 10 incidentes de tráfico',
    icon: '📢',
    points: 150,
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'helper',
    title: '🤝 Buen Samaritano',
    description: 'Ayudaste a otros conductores 5 veces',
    icon: '🤝',
    points: 200,
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'streak_7',
    title: '🔥 Racha Semanal',
    description: 'Usaste la app 7 días seguidos',
    icon: '🔥',
    points: 300,
    unlocked: false
  },
  {
    id: 'premium_user',
    title: '👑 Usuario Premium',
    description: 'Te suscribiste a Premium',
    icon: '👑',
    points: 500,
    unlocked: false
  }
];

export const useGameification = () => {
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('asistencia_vial_game_stats');
    return saved ? JSON.parse(saved) : {
      level: 1,
      xp: 0,
      xpToNext: 100,
      totalPoints: 0,
      streak: 0,
      achievements: ACHIEVEMENTS,
      lastActiveDate: new Date().toDateString()
    };
  });

  useEffect(() => {
    localStorage.setItem('asistencia_vial_game_stats', JSON.stringify(stats));
  }, [stats]);

  const addXP = (amount: number, reason: string) => {
    setStats(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNext: (newLevel * 100) - newXP,
        totalPoints: prev.totalPoints + amount
      };
    });

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`+${amount} XP`, {
        body: reason,
        icon: '/favicon.ico'
      });
    }
  };

  const updateAchievementProgress = (achievementId: string, progress: number) => {
    setStats(prev => ({
      ...prev,
      achievements: prev.achievements.map(achievement => {
        if (achievement.id === achievementId) {
          const newProgress = Math.min(progress, achievement.maxProgress || 1);
          const shouldUnlock = !achievement.unlocked && newProgress >= (achievement.maxProgress || 1);
          
          if (shouldUnlock) {
            addXP(achievement.points, `Logro desbloqueado: ${achievement.title}`);
          }
          
          return {
            ...achievement,
            progress: newProgress,
            unlocked: shouldUnlock || achievement.unlocked
          };
        }
        return achievement;
      })
    }));
  };

  const unlockAchievement = (achievementId: string) => {
    setStats(prev => ({
      ...prev,
      achievements: prev.achievements.map(achievement => {
        if (achievement.id === achievementId && !achievement.unlocked) {
          addXP(achievement.points, `Logro desbloqueado: ${achievement.title}`);
          return { ...achievement, unlocked: true };
        }
        return achievement;
      })
    }));
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastActive = stats.lastActiveDate;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    setStats(prev => {
      if (lastActive === today) {
        return prev; // Already counted today
      } else if (lastActive === yesterday) {
        // Continue streak
        const newStreak = prev.streak + 1;
        if (newStreak === 7) {
          unlockAchievement('streak_7');
        }
        return { ...prev, streak: newStreak, lastActiveDate: today };
      } else {
        // Reset streak
        return { ...prev, streak: 1, lastActiveDate: today };
      }
    });
  };

  // Game actions
  const actions = {
    usedSOS: () => {
      addXP(50, 'Usaste el botón SOS');
      unlockAchievement('first_sos');
    },
    
    visitedLocation: () => {
      addXP(10, 'Visitaste una nueva ubicación');
      updateAchievementProgress('explorer', (stats.achievements.find(a => a.id === 'explorer')?.progress || 0) + 1);
    },
    
    reportedTraffic: () => {
      addXP(25, 'Reportaste un incidente de tráfico');
      updateAchievementProgress('reporter', (stats.achievements.find(a => a.id === 'reporter')?.progress || 0) + 1);
    },
    
    helpedOther: () => {
      addXP(40, 'Ayudaste a otro conductor');
      updateAchievementProgress('helper', (stats.achievements.find(a => a.id === 'helper')?.progress || 0) + 1);
    },
    
    upgradedToPremium: () => {
      addXP(500, '¡Bienvenido a Premium!');
      unlockAchievement('premium_user');
    },
    
    dailyLogin: () => {
      addXP(5, 'Inicio de sesión diario');
      updateStreak();
    }
  };

  return {
    stats,
    actions,
    addXP,
    unlockAchievement,
    updateAchievementProgress
  };
};