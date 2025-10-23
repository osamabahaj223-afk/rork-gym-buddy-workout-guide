import { Dumbbell } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { WORKOUTS } from '@/mocks/workouts';

export default function WorkoutsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const filteredWorkouts = selectedLevel === 'all' 
    ? WORKOUTS 
    : WORKOUTS.filter(w => w.difficulty === selectedLevel);

  const levelButtons: { key: typeof selectedLevel; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'beginner', label: 'Beginner' },
    { key: 'intermediate', label: 'Intermediate' },
    { key: 'advanced', label: 'Pro' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Your Workout Plans</Text>
          <Text style={styles.subtitle}>
            Choose your level and start training
          </Text>
        </View>

        <View style={styles.filterContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {levelButtons.map((button) => (
              <TouchableOpacity
                key={button.key}
                style={[
                  styles.filterButton,
                  selectedLevel === button.key && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedLevel(button.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedLevel === button.key && styles.filterButtonTextActive,
                  ]}
                >
                  {button.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {filteredWorkouts.map((workout) => (
          <TouchableOpacity
            key={workout.id}
            style={styles.workoutCard}
            onPress={() =>
              router.push({
                pathname: '/workout/[id]',
                params: { id: workout.id },
              })
            }
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: workout.imageUrl }}
              style={styles.workoutImage}
              resizeMode="cover"
            />
            <View style={styles.workoutContent}>
              <View style={styles.workoutHeader}>
                <Text style={styles.workoutName}>{workout.name}</Text>
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
              <Text style={styles.workoutDescription}>
                {workout.description}
              </Text>
              <View style={styles.workoutMeta}>
                <View style={styles.metaItem}>
                  <Dumbbell size={16} color={Colors.primary} />
                  <Text style={styles.metaText}>
                    {workout.exercises.length} exercises
                  </Text>
                </View>
                <Text style={styles.metaDivider}>•</Text>
                <Text style={styles.metaText}>{workout.duration}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  workoutCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  workoutImage: {
    width: '100%',
    height: 180,
  },
  workoutContent: {
    padding: 16,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  workoutDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  metaDivider: {
    marginHorizontal: 8,
    color: Colors.textSecondary,
  },
  filterContainer: {
    marginBottom: 20,
    marginHorizontal: -20,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  filterButtonTextActive: {
    color: Colors.cardBackground,
  },
});
