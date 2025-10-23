import {
  Flame,
  Dumbbell,
  Trophy,
  TrendingUp,
  ChevronRight,
  Zap,
  Droplet,
} from 'lucide-react-native';
import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '@/constants/colors';
import { useGamification } from '@/contexts/GamificationContext';

const MOTIVATIONAL_QUOTES = [
  'Your Fitness Journey Starts Now',
  'Every Workout Counts',
  'Push Your Limits Today',
  'Stronger Every Day',
  'Make Today Count',
];

const WEEKLY_DATA = [
  { day: 'Mon', completed: true },
  { day: 'Tue', completed: true },
  { day: 'Wed', completed: true },
  { day: 'Thu', completed: true },
  { day: 'Fri', completed: true },
  { day: 'Sat', completed: false },
  { day: 'Sun', completed: false },
];

const WATER_STORAGE_KEY = '@gym_buddy_water';
const DAILY_WATER_GOAL = 2500;

interface WaterData {
  consumed: number;
  date: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userStats } = useGamification();
  const [waterConsumed, setWaterConsumed] = useState<number>(0);

  const quote =
    MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  const xpProgress = (userStats.xp / userStats.xpToNextLevel) * 100;
  const waterProgress = Math.min((waterConsumed / DAILY_WATER_GOAL) * 100, 100);

  const loadWaterData = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(WATER_STORAGE_KEY);
      if (stored) {
        try {
          const data: WaterData = JSON.parse(stored);
          const today = new Date().toDateString();
          if (data.date === today) {
            setWaterConsumed(data.consumed);
          } else {
            setWaterConsumed(0);
          }
        } catch (parseError) {
          console.log('Error parsing water data in home:', parseError);
          await AsyncStorage.removeItem(WATER_STORAGE_KEY);
          setWaterConsumed(0);
        }
      }
    } catch (error) {
      console.log('Error loading water data:', error);
    }
  }, []);

  useEffect(() => {
    loadWaterData();
    const interval = setInterval(loadWaterData, 3000);
    return () => clearInterval(interval);
  }, [loadWaterData]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome Back!</Text>
            <Text style={styles.subtitle}>{quote}</Text>
          </View>
          <View style={styles.levelBadge}>
            <Zap size={16} color={Colors.accent} fill={Colors.accent} />
            <Text style={styles.levelText}>Level {userStats.level}</Text>
          </View>
        </View>

        <LinearGradient
          colors={[Colors.xpGradientStart, Colors.xpGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.xpCard}
        >
          <View style={styles.xpHeader}>
            <Text style={styles.xpTitle}>Your Progress</Text>
            <Text style={styles.xpValue}>
              {userStats.xp} / {userStats.xpToNextLevel} XP
            </Text>
          </View>
          <View style={styles.xpBarContainer}>
            <View style={[styles.xpBarFill, { width: `${xpProgress}%` }]} />
          </View>
          <Text style={styles.xpDescription}>
            {userStats.xpToNextLevel - userStats.xp} XP to Level{' '}
            {userStats.level + 1}
          </Text>
        </LinearGradient>

        <View style={styles.streakCard}>
          <View style={styles.streakIcon}>
            <Flame size={32} color={Colors.accent} fill={Colors.accent} />
          </View>
          <View style={styles.streakContent}>
            <Text style={styles.streakNumber}>{userStats.currentStreak}</Text>
            <Text style={styles.streakLabel}>Day Streak</Text>
            <Text style={styles.streakBest}>
              Best: {userStats.bestStreak} days
            </Text>
          </View>
          <TouchableOpacity
            style={styles.streakButton}
            onPress={() => router.push('/(tabs)/workouts')}
            activeOpacity={0.7}
          >
            <Text style={styles.streakButtonText}>Start Workout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/profile')}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionLink}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.weeklyChart}>
            {WEEKLY_DATA.map((item, index) => (
              <View key={index} style={styles.dayColumn}>
                <View
                  style={[
                    styles.dayBar,
                    item.completed && styles.dayBarCompleted,
                  ]}
                />
                <Text style={styles.dayLabel}>{item.day}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.weeklyText}>
            {WEEKLY_DATA.filter((d) => d.completed).length} of 7 workouts
            completed
          </Text>
        </View>

        <TouchableOpacity
          style={styles.waterCard}
          onPress={() => router.push('/(tabs)/water')}
          activeOpacity={0.7}
        >
          <View style={styles.waterHeader}>
            <View style={styles.waterIconContainer}>
              <Droplet size={24} color={Colors.primary} fill={Colors.primary} />
            </View>
            <View style={styles.waterContent}>
              <Text style={styles.waterTitle}>Water Intake</Text>
              <Text style={styles.waterSubtitle}>
                {waterConsumed} / {DAILY_WATER_GOAL} ml
              </Text>
            </View>
            <ChevronRight size={24} color={Colors.textSecondary} />
          </View>
          <View style={styles.waterProgressBar}>
            <View
              style={[styles.waterProgressFill, { width: `${waterProgress}%` }]}
            />
          </View>
          <Text style={styles.waterProgressText}>
            {waterProgress >= 100
              ? '🎉 Daily goal reached!'
              : `${Math.round(waterProgress)}% of daily goal`}
          </Text>
        </TouchableOpacity>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: Colors.primary + '20' },
              ]}
            >
              <Dumbbell size={24} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>{userStats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: Colors.success + '20' },
              ]}
            >
              <Trophy size={24} color={Colors.success} />
            </View>
            <Text style={styles.statValue}>
              {userStats.achievements.filter((a) => a.unlocked).length}
            </Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: Colors.secondary + '20' },
              ]}
            >
              <TrendingUp size={24} color={Colors.secondary} />
            </View>
            <Text style={styles.statValue}>
              {Math.floor(userStats.totalTime / 60)}h
            </Text>
            <Text style={styles.statLabel}>Total Time</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/workouts')}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: Colors.primary + '20' },
              ]}
            >
              <Dumbbell size={24} color={Colors.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Browse Workouts</Text>
              <Text style={styles.actionDescription}>
                Find your next training session
              </Text>
            </View>
            <ChevronRight size={24} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/buddies')}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: Colors.accent + '20' },
              ]}
            >
              <Trophy size={24} color={Colors.accent} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Connect with Buddies</Text>
              <Text style={styles.actionDescription}>
                Find workout partners
              </Text>
            </View>
            <ChevronRight size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  xpCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  xpTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  xpValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  xpBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: Colors.text,
    borderRadius: 4,
  },
  xpDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500' as const,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    gap: 16,
  },
  streakIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakContent: {
    flex: 1,
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text,
    lineHeight: 36,
  },
  streakLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  streakBest: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  streakButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  streakButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  dayBar: {
    width: 24,
    height: 80,
    backgroundColor: Colors.border,
    borderRadius: 4,
  },
  dayBarCompleted: {
    backgroundColor: Colors.primary,
  },
  dayLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  weeklyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 16,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  waterCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  waterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  waterIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  waterContent: {
    flex: 1,
  },
  waterTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  waterSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  waterProgressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  waterProgressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  waterProgressText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500' as const,
  },
});
