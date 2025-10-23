import { Users, UserPlus } from 'lucide-react-native';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { GYM_BUDDIES } from '@/mocks/workouts';

export default function BuddiesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Gym Buddies</Text>
          <Text style={styles.subtitle}>
            Connect with friends and stay motivated together
          </Text>
        </View>

        <TouchableOpacity style={styles.findBuddiesButton} activeOpacity={0.7}>
          <UserPlus size={20} color={Colors.cardBackground} />
          <Text style={styles.findBuddiesText}>Find New Gym Buddies</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={20} color={Colors.text} />
            <Text style={styles.sectionTitle}>Your Buddies</Text>
          </View>

          {GYM_BUDDIES.map((buddy) => (
            <TouchableOpacity
              key={buddy.id}
              style={styles.buddyCard}
              activeOpacity={0.7}
            >
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: buddy.avatarUrl }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
                <View
                  style={[
                    styles.statusIndicator,
                    {
                      backgroundColor:
                        buddy.status === 'online'
                          ? Colors.online
                          : Colors.offline,
                    },
                  ]}
                />
              </View>

              <View style={styles.buddyInfo}>
                <Text style={styles.buddyName}>{buddy.name}</Text>
                <Text style={styles.buddyMeta}>
                  {buddy.workoutsCompleted} workouts completed
                </Text>
              </View>

              <TouchableOpacity
                style={styles.messageButton}
                activeOpacity={0.7}
              >
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.authNotice}>
          <Text style={styles.authNoticeTitle}>
            🔐 Authentication Required
          </Text>
          <Text style={styles.authNoticeText}>
            To connect with real gym buddies using Google or Facebook, enable
            backend in the settings.
          </Text>
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
  },
  header: {
    marginBottom: 20,
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
  findBuddiesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 32,
    gap: 8,
  },
  findBuddiesText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.cardBackground,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  buddyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.cardBackground,
  },
  buddyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  buddyName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  buddyMeta: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  messageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  messageButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  authNotice: {
    backgroundColor: Colors.secondary + '10',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.secondary + '20',
    marginTop: 16,
  },
  authNoticeTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  authNoticeText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
