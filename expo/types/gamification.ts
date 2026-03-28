export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'starter' | 'consistency' | 'strength' | 'social' | 'milestone';
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'weekly' | 'monthly' | 'special';
  progress: number;
  target: number;
  xpReward: number;
  active: boolean;
  endDate: string;
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  workoutName: string;
  date: string;
  duration: number;
  exercisesCompleted: number;
  xpEarned: number;
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalWorkouts: number;
  currentStreak: number;
  bestStreak: number;
  totalTime: number;
  achievements: Achievement[];
  workoutHistory: WorkoutSession[];
}
