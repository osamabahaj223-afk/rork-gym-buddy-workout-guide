import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Exercise, Workout } from '@/types/workout';

interface ExerciseCustomization {
  sets: number;
  reps: string;
  restTime: string;
}

interface WorkoutCustomization {
  workoutId: string;
  exercises: Record<string, ExerciseCustomization>;
}

const STORAGE_KEY = '@workout_customizations';

export const [WorkoutCustomizationProvider, useWorkoutCustomization] = createContextHook(() => {
  const [customizations, setCustomizations] = useState<Record<string, WorkoutCustomization>>({});
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const loadCustomizations = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCustomizations(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load workout customizations:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadCustomizations();
  }, [loadCustomizations]);



  const updateExercise = useCallback((workoutId: string, exerciseId: string, updates: ExerciseCustomization) => {
    setCustomizations((prev) => {
      const newCustomizations = { ...prev };
      
      if (!newCustomizations[workoutId]) {
        newCustomizations[workoutId] = {
          workoutId,
          exercises: {},
        };
      }

      newCustomizations[workoutId].exercises[exerciseId] = updates;
      
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newCustomizations)).catch((error) => {
        console.error('Failed to save workout customizations:', error);
      });
      
      return newCustomizations;
    });
  }, []);

  const getCustomizedExercise = useCallback((workoutId: string, exercise: Exercise): Exercise => {
    const workoutCustomization = customizations[workoutId];
    if (!workoutCustomization) {
      return exercise;
    }

    const exerciseCustomization = workoutCustomization.exercises[exercise.id];
    if (!exerciseCustomization) {
      return exercise;
    }

    return {
      ...exercise,
      sets: exerciseCustomization.sets,
      reps: exerciseCustomization.reps,
      restTime: exerciseCustomization.restTime,
    };
  }, [customizations]);

  const getCustomizedWorkout = useCallback((workout: Workout): Workout => {
    const workoutCustomization = customizations[workout.id];
    if (!workoutCustomization) {
      return workout;
    }

    return {
      ...workout,
      exercises: workout.exercises.map(exercise => getCustomizedExercise(workout.id, exercise)),
    };
  }, [customizations, getCustomizedExercise]);

  const resetWorkout = useCallback((workoutId: string) => {
    setCustomizations((prev) => {
      const newCustomizations = { ...prev };
      delete newCustomizations[workoutId];
      
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newCustomizations)).catch((error) => {
        console.error('Failed to save workout customizations:', error);
      });
      
      return newCustomizations;
    });
  }, []);

  const hasCustomizations = useCallback((workoutId: string): boolean => {
    return !!customizations[workoutId] && Object.keys(customizations[workoutId].exercises).length > 0;
  }, [customizations]);

  return useMemo(() => ({
    customizations,
    isLoaded,
    updateExercise,
    getCustomizedExercise,
    getCustomizedWorkout,
    resetWorkout,
    hasCustomizations,
  }), [customizations, isLoaded, updateExercise, getCustomizedExercise, getCustomizedWorkout, resetWorkout, hasCustomizations]);
});
