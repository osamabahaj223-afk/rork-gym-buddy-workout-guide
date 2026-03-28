import { ArrowLeft, Clock, Dumbbell, Edit2, RotateCcw } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { useWorkoutCustomization } from '@/contexts/WorkoutCustomizationContext';
import { WORKOUTS } from '@/mocks/workouts';
import { Exercise } from '@/types/workout';

export default function WorkoutDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { getCustomizedWorkout, updateExercise, hasCustomizations, resetWorkout } = useWorkoutCustomization();
  
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [editSets, setEditSets] = useState<string>('');
  const [editReps, setEditReps] = useState<string>('');
  const [editRest, setEditRest] = useState<string>('');

  const originalWorkout = WORKOUTS.find((w) => w.id === id);
  const workout = useMemo(() => {
    if (!originalWorkout) return undefined;
    return getCustomizedWorkout(originalWorkout);
  }, [originalWorkout, getCustomizedWorkout]);

  const openEditModal = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setEditSets(exercise.sets.toString());
    setEditReps(exercise.reps);
    setEditRest(exercise.restTime);
  };

  const saveEdit = () => {
    if (editingExercise && workout) {
      const sets = parseInt(editSets, 10);
      if (!isNaN(sets) && sets > 0 && editReps.trim() && editRest.trim()) {
        updateExercise(workout.id, editingExercise.id, {
          sets,
          reps: editReps.trim(),
          restTime: editRest.trim(),
        });
      }
      setEditingExercise(null);
    }
  };

  const handleReset = () => {
    if (workout) {
      resetWorkout(workout.id);
    }
  };

  if (!workout) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Workout not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: workout.imageUrl }}
        style={styles.heroImage}
        resizeMode="cover"
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={Colors.cardBackground} />
        </TouchableOpacity>
        {hasCustomizations(workout.id) && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <RotateCcw size={20} color={Colors.cardBackground} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.workoutHeader}>
          <View style={styles.workoutTitleRow}>
            <Text style={styles.workoutTitle}>{workout.name}</Text>
            <View
              style={[
                styles.difficultyBadge,
                {
                  backgroundColor:
                    workout.difficulty === 'beginner'
                      ? Colors.beginner + '20'
                      : workout.difficulty === 'intermediate'
                        ? Colors.intermediate + '20'
                        : Colors.advanced + '20',
                },
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  {
                    color:
                      workout.difficulty === 'beginner'
                        ? Colors.beginner
                        : workout.difficulty === 'intermediate'
                          ? Colors.intermediate
                          : Colors.advanced,
                  },
                ]}
              >
                {workout.difficulty.charAt(0).toUpperCase() +
                  workout.difficulty.slice(1)}
              </Text>
            </View>
          </View>

          <Text style={styles.workoutDescription}>{workout.description}</Text>

          <View style={styles.workoutMeta}>
            <View style={styles.metaItem}>
              <Clock size={20} color={Colors.primary} />
              <Text style={styles.metaText}>{workout.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <Dumbbell size={20} color={Colors.primary} />
              <Text style={styles.metaText}>
                {workout.exercises.length} exercises
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>Exercises</Text>

          {workout.exercises.map((exercise, index) => (
            <TouchableOpacity
              key={exercise.id}
              style={styles.exerciseCard}
              onPress={() =>
                router.push({
                  pathname: '/exercise/[id]',
                  params: { id: exercise.id, workoutId: workout.id },
                })
              }
              activeOpacity={0.7}
            >
              <View style={styles.exerciseNumber}>
                <Text style={styles.exerciseNumberText}>{index + 1}</Text>
              </View>

              <Image
                source={{ uri: exercise.gifUrl || exercise.imageUrl }}
                style={styles.exerciseImage}
                resizeMode="cover"
              />

              <View style={styles.exerciseContent}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.muscleGroup}>{exercise.muscleGroup}</Text>

                <View style={styles.exerciseDetailsRow}>
                  <View style={styles.exerciseDetails}>
                    <View style={styles.exerciseDetailItem}>
                      <Text style={styles.exerciseDetailLabel}>Sets</Text>
                      <Text style={styles.exerciseDetailValue}>
                        {exercise.sets}
                      </Text>
                    </View>
                    <View style={styles.exerciseDetailItem}>
                      <Text style={styles.exerciseDetailLabel}>Reps</Text>
                      <Text style={styles.exerciseDetailValue}>
                        {exercise.reps}
                      </Text>
                    </View>
                    <View style={styles.exerciseDetailItem}>
                      <Text style={styles.exerciseDetailLabel}>Rest</Text>
                      <Text style={styles.exerciseDetailValue}>
                        {exercise.restTime}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openEditModal(exercise)}
                    activeOpacity={0.7}
                  >
                    <Edit2 size={18} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.startButton} activeOpacity={0.8}>
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={!!editingExercise}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingExercise(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Exercise</Text>
            {editingExercise && (
              <Text style={styles.modalExerciseName}>{editingExercise.name}</Text>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Sets</Text>
              <TextInput
                style={styles.input}
                value={editSets}
                onChangeText={setEditSets}
                keyboardType="number-pad"
                placeholder="3"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Reps</Text>
              <TextInput
                style={styles.input}
                value={editReps}
                onChangeText={setEditReps}
                placeholder="8-12"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Rest Time</Text>
              <TextInput
                style={styles.input}
                value={editRest}
                onChangeText={setEditRest}
                placeholder="60 sec"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setEditingExercise(null)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonSave}
                onPress={saveEdit}
                activeOpacity={0.7}
              >
                <Text style={styles.modalButtonSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroImage: {
    width: '100%',
    height: 250,
    position: 'absolute',
    top: 0,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
    marginTop: 200,
  },
  content: {
    paddingBottom: 40,
  },
  workoutHeader: {
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    marginTop: -24,
  },
  workoutTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workoutTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  workoutDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  workoutMeta: {
    flexDirection: 'row',
    gap: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600' as const,
  },
  exercisesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  exerciseCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  exerciseNumber: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  exerciseNumberText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.cardBackground,
  },
  exerciseImage: {
    width: '100%',
    height: 150,
  },
  exerciseContent: {
    padding: 16,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  muscleGroup: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  exerciseDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: 16,
    flex: 1,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  exerciseDetailItem: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  exerciseDetailLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  exerciseDetailValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  startButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 8,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.cardBackground,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalExerciseName: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  modalButtonCancelText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  modalButtonSave: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  modalButtonSaveText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.cardBackground,
  },
});
