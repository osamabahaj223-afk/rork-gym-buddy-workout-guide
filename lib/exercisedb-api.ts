const EXERCISEDB_BASE_URL = 'https://exercisedb.p.rapidapi.com';

export interface ExerciseDBExercise {
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  id: string;
  name: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
}

const exerciseNameMap: Record<string, string> = {
  'Push-ups': 'push-up',
  'Lat Pulldown': 'lat pulldown',
  'Lunges': 'lunge',
  'Plank': 'plank',
  'Barbell Bench Press': 'barbell bench press',
  'Cable Rows': 'cable row',
  'Lateral Raises': 'dumbbell lateral raise',
  'Barbell Curls': 'barbell curl',
  'Tricep Pushdown': 'cable pushdown',
  'Leg Press': 'leg press',
  'Romanian Deadlift': 'barbell romanian deadlift',
  'Calf Raises': 'standing calf raise',
  'Barbell Squats': 'barbell squat',
  'Pull-ups': 'pull-up',
  'Incline Dumbbell Press': 'incline dumbbell press',
  'Face Pulls': 'cable face pull',
  'Barbell Rows': 'barbell bent over row',
  'Crunches': 'crunch',
  'Russian Twists': 'russian twist',
  'Mountain Climbers': 'mountain climber',
  'Burpees': 'burpee',
  'Deadlift': 'barbell deadlift',
  'Overhead Press': 'barbell overhead press',
  'Tricep Dips': 'dip',
  'Cable Crossover': 'cable crossover',
  'Dumbbell Flyes': 'dumbbell fly',
  'Hammer Curls': 'dumbbell hammer curl',
  'Arnold Press': 'dumbbell arnold press',
  'Hanging Leg Raises': 'hanging leg raise',
};

const exerciseCache: Record<string, ExerciseDBExercise> = {};

export async function searchExerciseByName(exerciseName: string): Promise<ExerciseDBExercise | null> {
  if (exerciseCache[exerciseName]) {
    return exerciseCache[exerciseName];
  }

  const searchName = exerciseNameMap[exerciseName] || exerciseName.toLowerCase();
  
  try {
    const response = await fetch(`${EXERCISEDB_BASE_URL}/exercises/name/${encodeURIComponent(searchName)}?limit=1`);
    
    if (!response.ok) {
      console.log(`ExerciseDB API error for "${exerciseName}": ${response.status}`);
      return null;
    }
    
    const data: ExerciseDBExercise[] = await response.json();
    
    if (data && data.length > 0) {
      exerciseCache[exerciseName] = data[0];
      return data[0];
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to fetch exercise "${exerciseName}":`, error);
    return null;
  }
}

export async function getExerciseById(id: string): Promise<ExerciseDBExercise | null> {
  if (exerciseCache[id]) {
    return exerciseCache[id];
  }

  try {
    const response = await fetch(`${EXERCISEDB_BASE_URL}/exercises/exercise/${id}`);
    
    if (!response.ok) {
      console.log(`ExerciseDB API error for ID "${id}": ${response.status}`);
      return null;
    }
    
    const data: ExerciseDBExercise = await response.json();
    
    if (data) {
      exerciseCache[id] = data;
      return data;
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to fetch exercise ID "${id}":`, error);
    return null;
  }
}

export function getExerciseGifUrl(exerciseId: string): string {
  return `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${exerciseId.padStart(4, '0')}.gif`;
}

export function getExerciseImageUrl(exerciseId: string): string {
  return `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${exerciseId.padStart(4, '0')}.jpg`;
}
