import { Calendar, Clock, TrendingUp, Award, Flame } from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { useGamification } from '@/contexts/GamificationContext';

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const { userStats } = useGamification();

  const totalHours = Math.floor(userStats.totalTime / 60);
  const totalMinutes = userStats.totalTime % 60;

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
          <Text style={styles.title}>Your Progress</Text>
          <Text style={styles.subtitle}>Track your fitness journey</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.bigStatCard}>
            <View
              style={[
                styles.bigStatIcon,
                { backgroundColor: Colors.primary + '20' },
              ]}
            >
              <TrendingUp size={32} color={Colors.primary} />
            </View>
            <Text style={styles.bigStatValue}>{userStats.totalWorkouts}</Text>
            <Text style={styles.bigStatLabel}>Total Workouts</Text>
          </View>

          <View style={styles.bigStatCard}>
            <View
              style={[
                styles.bigStatIcon,
                { backgroundColor: Colors.accent + '20' },
              ]}
            >
              <Flame size={32} color={Colors.accent} />
            </View>
            <Text style={styles.bigStatValue}>{userStats.currentStreak}</Text>
            <Text style={styles.bigStatLabel}>Current Streak</Text>
          </View>
        </View>

        <View style={styles.timeCard}>
          <View style={styles.timeHeader}>
            <Clock size={24} color={Colors.secondary} />
            <Text style={styles.timeTitle}>Total Training Time</Text>
          </View>
          <Text style={styles.timeValue}>
            {totalHours}h {totalMinutes}m
          </Text>
          <Text style={styles.timeDescription}>
            You&apos;ve invested {totalHours} hours in your fitness journey
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>

          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <View style={styles.statCardHeader}>
                <Award size={20} color={Colors.success} />
                <Text style={styles.statCardTitle}>Achievements</Text>
              </View>
              <Text style={styles.statCardValue}>
                {userStats.achievements.filter((a) => a.unlocked).length}/
                {userStats.achievements.length}
              </Text>
              <Text style={styles.statCardDescription}>Unlocked</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statCardHeader}>
                <Flame size={20} color={Colors.accent} />
                <Text style={styles.statCardTitle}>Best Streak</Text>
              </View>
              <Text style={styles.statCardValue}>{userStats.bestStreak}</Text>
              <Text style={styles.statCardDescription}>Days</Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <View style={styles.statCardHeader}>
                <TrendingUp size={20} color={Colors.primary} />
                <Text style={styles.statCardTitle}>Level</Text>
              </View>
              <Text style={styles.statCardValue}>{userStats.level}</Text>
              <Text style={styles.statCardDescription}>
                {userStats.xp}/{userStats.xpToNextLevel} XP
              </Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statCardHeader}>
                <Calendar size={20} color={Colors.secondary} />
                <Text style={styles.statCardTitle}>Avg/Week</Text>
              </View>
              <Text style={styles.statCardValue}>5</Text>
              <Text style={styles.statCardDescription}>Workouts</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          {userStats.achievements
            .filter((a) => a.unlocked)
            .slice(0, 3)
            .map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <View style={styles.achievementIcon}>
                  <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
                </View>
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementName}>{achievement.name}</Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                  {achievement.unlockedAt && (
                    <Text style={styles.achievementDate}>
                      Unlocked{' '}
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </Text>
                  )}
                </View>
                <View style={styles.xpBadge}>
                  <Text style={styles.xpBadgeText}>
                    +{achievement.xpReward} XP
                  </Text>
                </View>
              </View>
            ))}
        </View>

        <TouchableOpacity style={styles.exportButton} activeOpacity={0.7}>
          <Text style={styles.exportButtonText}>Export Data</Text>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
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
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  bigStatCard: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  bigStatIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  bigStatValue: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  bigStatLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  timeCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  timeTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  timeValue: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: Colors.secondary,
    marginBottom: 8,
  },
  timeDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statCardTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  statCardValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  statCardDescription: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementEmoji: {
    fontSize: 28,
  },
  achievementContent: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  xpBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  xpBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  exportButton: {
    backgroundColor: Colors.cardBackground,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
});
