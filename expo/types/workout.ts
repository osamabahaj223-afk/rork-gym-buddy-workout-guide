export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restTime: string;
  muscleGroup: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  imageUrl: string;
  gifUrl?: string;
  bodyPart?: string;
  equipment?: string;
  target?: string;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
  imageUrl: string;
}

export interface GymBuddy {
  id: string;
  name: string;
  avatarUrl: string;
  workoutsCompleted: number;
  joinedDate: string;
  status: 'online' | 'offline';
}
