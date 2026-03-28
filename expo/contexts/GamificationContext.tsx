import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Achievement, Challenge, UserStats, WorkoutSession } from '@/types/gamification';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-workout',
    name: 'First Workout',
    description: 'Complete your first session',
    icon: '🏁',
    category: 'starter',
    unlocked: false,
    xpReward: 50,
  },
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Complete 5 workouts',
    icon: '💪',
    category: 'starter',
    unlocked: false,
    xpReward: 100,
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: '7-day streak',
    icon: '🔥',
    category: 'consistency',
    unlocked: false,
    xpReward: 150,
  },
  {
    id: 'muscle-master',
    name: 'Muscle Master',
    description: 'Train all muscle groups in a week',
    icon: '🦾',
    category: 'strength',
    unlocked: false,
    xpReward: 200,
  },
  {
    id: 'century-club',
    name: 'Century Club',
    description: '100 workouts completed',
    icon: '💯',
    category: 'milestone',
    unlocked: false,
    xpReward: 500,
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Workout before 7 AM',
    icon: '🌅',
    category: 'consistency',
    unlocked: false,
    xpReward: 75,
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Workout after 9 PM',
    icon: '🌙',
    category: 'consistency',
    unlocked: false,
    xpReward: 75,
  },
  {
    id: 'iron-will',
    name: 'Iron Will',
    description: '30-day streak',
    icon: '🏋️',
    category: 'consistency',
    unlocked: false,
    xpReward: 300,
  },
];

const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'weekly-minutes',
    name: '30-Minute Challenge',
    description: 'Complete 150 minutes this week',
    type: 'weekly',
    progress: 0,
    target: 150,
    xpReward: 200,
    active: true,
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'monthly-consistency',
    name: 'Consistency Champion',
    description: 'Workout 20 days this month',
    type: 'monthly',
    progress: 0,
    target: 20,
    xpReward: 500,
    active: true,
    endDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    ).toISOString(),
  },
];

const STORAGE_KEY = '@gym_buddy_stats';

export const [GamificationProvider, useGamification] = createContextHook(() => {
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    xpToNextLevel: 1000,
    totalWorkouts: 12,
    currentStreak: 5,
    bestStreak: 8,
    totalTime: 600,
    achievements: INITIAL_ACHIEVEMENTS,
    workoutHistory: [],
  });

  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);

  const loadStats = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUserStats((prev) => parsed.userStats || prev);
          setChallenges((prev) => parsed.challenges || prev);
        } catch (parseError) {
          console.log('Error parsing gamification stats, resetting:', parseError);
          await AsyncStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.log('Error loading stats:', error);
    }
  }, []);

  const saveStats = useCallback(async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ userStats, challenges })
      );
    } catch (error) {
      console.log('Error saving stats:', error);
    }
  }, [userStats, challenges]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    saveStats();
  }, [saveStats]);

  const addXP = useCallback((amount: number) => {
    setUserStats((prev) => {
      const newXP = prev.xp + amount;
      const levelsGained = Math.floor(newXP / prev.xpToNextLevel);
      const newLevel = prev.level + levelsGained;
      const remainingXP = newXP % prev.xpToNextLevel;

      return {
        ...prev,
        xp: remainingXP,
        level: newLevel,
        xpToNextLevel: 1000,
      };
    });
  }, []);

  const checkAchievements = useCallback(() => {
    setUserStats((prev) => {
      const updatedAchievements = prev.achievements.map((achievement) => {
        if (achievement.unlocked) return achievement;

        let shouldUnlock = false;

        switch (achievement.id) {
          case 'first-workout':
            shouldUnlock = prev.totalWorkouts >= 1;
            break;
          case 'getting-started':
            shouldUnlock = prev.totalWorkouts >= 5;
            break;
          case 'week-warrior':
            shouldUnlock = prev.currentStreak >= 7;
            break;
          case 'iron-will':
            shouldUnlock = prev.currentStreak >= 30;
            break;
          case 'century-club':
            shouldUnlock = prev.totalWorkouts >= 100;
            break;
          default:
            break;
        }

        if (shouldUnlock) {
          addXP(achievement.xpReward);
          return {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date().toISOString(),
          };
        }

        return achievement;
      });

      return {
        ...prev,
        achievements: updatedAchievements,
      };
    });
  }, [addXP]);

  const updateChallenges = useCallback((session: WorkoutSession) => {
    setChallenges((prev) =>
      prev.map((challenge) => {
        if (!challenge.active) return challenge;

        if (challenge.id === 'weekly-minutes') {
          const newProgress = challenge.progress + session.duration;
          if (newProgress >= challenge.target && challenge.progress < challenge.target) {
            addXP(challenge.xpReward);
          }
          return { ...challenge, progress: newProgress };
        }

        if (challenge.id === 'monthly-consistency') {
          const newProgress = challenge.progress + 1;
          if (newProgress >= challenge.target && challenge.progress < challenge.target) {
            addXP(challenge.xpReward);
          }
          return { ...challenge, progress: newProgress };
        }

        return challenge;
      })
    );
  }, [addXP]);

  const completeWorkout = useCallback(
    (session: WorkoutSession) => {
      const baseXP = 100;
      addXP(baseXP);

      setUserStats((prev) => ({
        ...prev,
        totalWorkouts: prev.totalWorkouts + 1,
        currentStreak: prev.currentStreak + 1,
        bestStreak: Math.max(prev.bestStreak, prev.currentStreak + 1),
        totalTime: prev.totalTime + session.duration,
        workoutHistory: [session, ...prev.workoutHistory].slice(0, 100),
      }));

      checkAchievements();
      updateChallenges(session);
    },
    [addXP, checkAchievements, updateChallenges]
  );

  const resetStreak = useCallback(() => {
    setUserStats((prev) => ({
      ...prev,
      currentStreak: 0,
    }));
  }, []);

  return useMemo(
    () => ({
      userStats,
      challenges,
      addXP,
      completeWorkout,
      resetStreak,
    }),
    [userStats, challenges, addXP, completeWorkout, resetStreak]
  );
});
