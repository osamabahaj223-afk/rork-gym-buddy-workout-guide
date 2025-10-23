import { Trophy, Target, Calendar, TrendingUp, Flame } from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { useGamification } from '@/contexts/GamificationContext';

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Sarah J.', xp: 8450, avatar: '🏆' },
  { rank: 2, name: 'Mike C.', xp: 7820, avatar: '🥈' },
  { rank: 3, name: 'You', xp: 7200, avatar: '🥉', isUser: true },
  { rank: 4, name: 'Emma D.', xp: 6950, avatar: '💪' },
  { rank: 5, name: 'Alex R.', xp: 6420, avatar: '🔥' },
];

export default function ChallengesScreen() {
  const insets = useSafeAreaInsets();
  const { challenges, userStats } = useGamification();

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
          <Text style={styles.title}>Challenges</Text>
          <Text style={styles.subtitle}>
            Complete challenges to earn XP and rewards
          </Text>
        </View>

        <LinearGradient
          colors={[Colors.accent, Colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.levelCard}
        >
          <View style={styles.levelHeader}>
            <View>
              <Text style={styles.levelLabel}>Your Level</Text>
              <Text style={styles.levelValue}>Level {userStats.level}</Text>
            </View>
            <View style={styles.levelIcon}>
              <Trophy size={32} color={Colors.text} />
            </View>
          </View>
          <View style={styles.xpBar}>
            <View
              style={[
                styles.xpBarFill,
                {
                  width: `${(userStats.xp / userStats.xpToNextLevel) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.xpText}>
            {userStats.xp} / {userStats.xpToNextLevel} XP
          </Text>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Target size={20} color={Colors.text} />
            <Text style={styles.sectionTitle}>Active Challenges</Text>
          </View>

          {challenges.map((challenge) => {
            const progress = (challenge.progress / challenge.target) * 100;
            const isCompleted = challenge.progress >= challenge.target;

            return (
              <View
                key={challenge.id}
                style={[
                  styles.challengeCard,
                  isCompleted && styles.challengeCardCompleted,
                ]}
              >
                <View style={styles.challengeHeader}>
                  <View style={styles.challengeType}>
                    <Calendar size={16} color={Colors.primary} />
                    <Text style={styles.challengeTypeText}>
                      {challenge.type === 'weekly' ? 'Weekly' : 'Monthly'}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.xpRewardBadge,
                      { backgroundColor: Colors.accent + '20' },
                    ]}
                  >
                    <Text style={styles.xpRewardText}>
                      +{challenge.xpReward} XP
                    </Text>
                  </View>
                </View>

                <Text style={styles.challengeName}>{challenge.name}</Text>
                <Text style={styles.challengeDescription}>
                  {challenge.description}
                </Text>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <LinearGradient
                      colors={[Colors.primary, Colors.secondary]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.progressFill, { width: `${progress}%` }]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {challenge.progress} / {challenge.target}
                  </Text>
                </View>

                {isCompleted && (
                  <View style={styles.completedBadge}>
                    <Trophy size={16} color={Colors.success} />
                    <Text style={styles.completedText}>Completed!</Text>
                  </View>
                )}

                <Text style={styles.challengeEndDate}>
                  Ends {new Date(challenge.endDate).toLocaleDateString()}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color={Colors.text} />
            <Text style={styles.sectionTitle}>Leaderboard</Text>
          </View>
          <Text style={styles.leaderboardSubtitle}>Monthly Rankings</Text>

          {LEADERBOARD_DATA.map((entry) => (
            <View
              key={entry.rank}
              style={[
                styles.leaderboardItem,
                entry.isUser && styles.leaderboardItemUser,
              ]}
            >
              <View style={styles.leaderboardRank}>
                <Text style={styles.rankNumber}>{entry.rank}</Text>
              </View>
              <View style={styles.leaderboardAvatar}>
                <Text style={styles.leaderboardAvatarText}>{entry.avatar}</Text>
              </View>
              <View style={styles.leaderboardInfo}>
                <Text style={styles.leaderboardName}>
                  {entry.name}
                  {entry.isUser && ' (You)'}
                </Text>
                <View style={styles.xpRow}>
                  <Flame size={14} color={Colors.accent} />
                  <Text style={styles.leaderboardXp}>{entry.xp} XP</Text>
                </View>
              </View>
            </View>
          ))}
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
  levelCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  levelValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  levelIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  xpBar: {
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
  xpText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500' as const,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  challengeCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  challengeCardCompleted: {
    borderWidth: 2,
    borderColor: Colors.success,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  challengeTypeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  xpRewardBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  xpRewardText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.accent,
  },
  challengeName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.success,
  },
  challengeEndDate: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  leaderboardSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  leaderboardItemUser: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  leaderboardRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  leaderboardAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderboardAvatarText: {
    fontSize: 24,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  leaderboardXp: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
});
