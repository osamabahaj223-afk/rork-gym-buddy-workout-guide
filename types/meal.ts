export type WorkoutLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
}

export interface DailyMealPlan {
  id: string;
  level: WorkoutLevel;
  totalCalories: number;
  meals: Meal[];
  waterIntake: number;
  notes: string;
}

export interface NutritionGoals {
  level: WorkoutLevel;
  calories: {
    min: number;
    max: number;
    recommended: number;
  };
  protein: number;
  carbs: number;
  fats: number;
  waterIntake: number;
  description: string;
}
