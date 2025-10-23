import { ArrowLeft, CheckCircle2, Package } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { WORKOUTS } from '@/mocks/workouts';
import type { Exercise } from '@/types/workout';

export default function ExerciseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{
    id: string;
    workoutId?: string;
  }>();
  const insets = useSafeAreaInsets();

  const [completedSets, setCompletedSets] = useState<number[]>([]);
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [imageError, setImageError] = useState<boolean>(false);
  const [gifLoading, setGifLoading] = useState<boolean>(true);
  const [gifError, setGifError] = useState<boolean>(false);

  let exercise: Exercise | undefined;

  for (const workout of WORKOUTS) {
    const found = workout.exercises.find((e) => e.id === id);
    if (found) {
      exercise = found;
      break;
    }
  }

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Exercise not found</Text>
      </View>
    );
  }

  const toggleSet = (setNumber: number) => {
    if (completedSets.includes(setNumber)) {
      setCompletedSets(completedSets.filter((s) => s !== setNumber));
    } else {
      setCompletedSets([...completedSets, setNumber]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.heroImageContainer}>
        <Image
          source={{ uri: exercise.gifUrl || exercise.imageUrl }}
          style={styles.heroImage}
          resizeMode="cover"
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
          onError={() => {
            setImageLoading(false);
            setImageError(true);
          }}
        />
        {imageLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}
        {imageError && (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorText}>Image unavailable</Text>
          </View>
        )}
      </View>

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
        <View style={styles.exerciseHeader}>
          <View style={styles.demoContainer}>
            {exercise.gifUrl ? (
              <View style={styles.gifWrapper}>
                <Image
                  source={{ uri: exercise.gifUrl }}
                  style={styles.demoGif}
                  resizeMode="contain"
                  onLoadStart={() => setGifLoading(true)}
                  onLoadEnd={() => setGifLoading(false)}
                  onError={() => {
                    setGifLoading(false);
                    setGifError(true);
                  }}
                />
                {gifLoading && (
                  <View style={styles.gifLoadingOverlay}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Loading demo...</Text>
                  </View>
                )}
                {gifError && (
                  <View style={styles.gifErrorOverlay}>
                    <Text style={styles.gifErrorText}>Demo unavailable</Text>
                  </View>
                )}
                {!gifLoading && !gifError && (
                  <View style={styles.gifBadge}>
                    <Text style={styles.gifBadgeText}>LIVE DEMO</Text>
                  </View>
                )}
              </View>
            ) : null}
          </View>

          <Text style={styles.exerciseTitle}>{exercise.name}</Text>
          <Text style={styles.muscleGroup}>{exercise.muscleGroup}</Text>

          {exercise.equipment && (
            <View style={styles.equipmentBadge}>
              <Package size={14} color={Colors.primary} />
              <Text style={styles.equipmentText}>{exercise.equipment}</Text>
            </View>
          )}

          <View style={styles.exerciseMeta}>
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>Sets</Text>
              <Text style={styles.metaValue}>{exercise.sets}</Text>
            </View>
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>Reps</Text>
              <Text style={styles.metaValue}>{exercise.reps}</Text>
            </View>
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>Rest</Text>
              <Text style={styles.metaValue}>{exercise.restTime}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Track Your Sets</Text>
          {Array.from({ length: exercise.sets }).map((_, index) => {
            const setNumber = index + 1;
            const isCompleted = completedSets.includes(setNumber);

            return (
              <TouchableOpacity
                key={setNumber}
                style={[
                  styles.setCard,
                  isCompleted && styles.setCardCompleted,
                ]}
                onPress={() => toggleSet(setNumber)}
                activeOpacity={0.7}
              >
                <View style={styles.setInfo}>
                  <Text style={styles.setNumber}>Set {setNumber}</Text>
                  <Text style={styles.setReps}>{exercise.reps} reps</Text>
                </View>
                <View
                  style={[
                    styles.checkbox,
                    isCompleted && styles.checkboxCompleted,
                  ]}
                >
                  {isCompleted && (
                    <CheckCircle2 size={24} color={Colors.success} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Perform</Text>
          {exercise.instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.completeButton,
            completedSets.length === exercise.sets &&
              styles.completeButtonActive,
          ]}
          activeOpacity={0.8}
          disabled={completedSets.length !== exercise.sets}
        >
          <Text style={styles.completeButtonText}>
            {completedSets.length === exercise.sets
              ? 'Exercise Complete!'
              : `Complete ${completedSets.length}/${exercise.sets} sets`}
          </Text>
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
    height: 300,
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
    marginTop: 250,
  },
  content: {
    paddingBottom: 40,
  },
  exerciseHeader: {
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    marginTop: -24,
  },
  demoContainer: {
    marginBottom: 20,
    marginHorizontal: -24,
    marginTop: -24,
  },
  gifWrapper: {
    position: 'relative',
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  demoGif: {
    width: '100%',
    height: 300,
    backgroundColor: Colors.background,
  },
  gifBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  gifBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.cardBackground,
    letterSpacing: 1,
  },
  equipmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  equipmentText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
    textTransform: 'capitalize' as const,
  },
  exerciseTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  muscleGroup: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600' as const,
    marginBottom: 20,
  },
  exerciseMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaCard: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  setCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  setCardCompleted: {
    borderColor: Colors.success,
    backgroundColor: Colors.success + '10',
  },
  setInfo: {
    flex: 1,
  },
  setNumber: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  setReps: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    borderColor: Colors.success,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.cardBackground,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  completeButton: {
    backgroundColor: Colors.border,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 8,
    alignItems: 'center',
  },
  completeButtonActive: {
    backgroundColor: Colors.success,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.cardBackground,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  heroImageContainer: {
    width: '100%',
    height: 300,
    position: 'absolute',
    top: 0,
    backgroundColor: Colors.background,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gifLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  gifErrorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gifErrorText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
