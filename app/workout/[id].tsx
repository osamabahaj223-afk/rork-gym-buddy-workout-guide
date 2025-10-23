import { ArrowLeft, Clock, Dumbbell } from 'lucide-react-native';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { WORKOUTS } from '@/mocks/workouts';

export default function WorkoutDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const workout = WORKOUTS.find((w) => w.id === id);

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
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.startButton} activeOpacity={0.8}>
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </ScrollView>
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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
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
  exerciseDetails: {
    flexDirection: 'row',
    gap: 16,
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
});
