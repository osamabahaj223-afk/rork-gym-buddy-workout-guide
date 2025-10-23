import { Droplet, Plus, Minus, Target, TrendingUp } from 'lucide-react-native';
import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '@/constants/colors';
import { useGamification } from '@/contexts/GamificationContext';

const DAILY_GOAL = 2500;
const QUICK_ADD_AMOUNTS = [250, 350, 500, 750];
const WATER_STORAGE_KEY = '@gym_buddy_water';

interface WaterData {
  consumed: number;
  date: string;
  history: { date: string; amount: number }[];
}

export default function WaterScreen() {
  const insets = useSafeAreaInsets();
  const { addXP } = useGamification();
  const [consumed, setConsumed] = useState<number>(0);
  const [animatedValue] = useState<Animated.Value>(new Animated.Value(0));
  const [hasReachedGoal, setHasReachedGoal] = useState<boolean>(false);

  const progress = Math.min((consumed / DAILY_GOAL) * 100, 100);
  const remaining = Math.max(DAILY_GOAL - consumed, 0);

  const loadWaterData = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(WATER_STORAGE_KEY);
      if (stored) {
        try {
          const data: WaterData = JSON.parse(stored);
          const today = new Date().toDateString();
          if (data.date === today) {
            setConsumed(data.consumed);
            setHasReachedGoal(data.consumed >= DAILY_GOAL);
          } else {
            setConsumed(0);
            setHasReachedGoal(false);
          }
        } catch (parseError) {
          console.log('Error parsing water data, resetting:', parseError);
          await AsyncStorage.removeItem(WATER_STORAGE_KEY);
          setConsumed(0);
          setHasReachedGoal(false);
        }
      }
    } catch (error) {
      console.log('Error loading water data:', error);
    }
  }, []);

  const saveWaterData = useCallback(async (amount: number) => {
    try {
      const today = new Date().toDateString();
      const stored = await AsyncStorage.getItem(WATER_STORAGE_KEY);
      let data: WaterData = {
        consumed: amount,
        date: today,
        history: [],
      };

      if (stored) {
        try {
          const oldData: WaterData = JSON.parse(stored);
          if (oldData.date === today) {
            data = { ...oldData, consumed: amount };
          } else {
            data.history = [{ date: oldData.date, amount: oldData.consumed }, ...oldData.history].slice(0, 30);
          }
        } catch (parseError) {
          console.log('Error parsing stored water data, creating fresh:', parseError);
        }
      }

      await AsyncStorage.setItem(WATER_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.log('Error saving water data:', error);
    }
  }, []);

  useEffect(() => {
    loadWaterData();
  }, [loadWaterData]);

  const addWater = (amount: number) => {
    setConsumed((prev) => {
      const newValue = prev + amount;
      animateWave();
      
      if (!hasReachedGoal && newValue >= DAILY_GOAL) {
        setHasReachedGoal(true);
        addXP(50);
      }
      
      const finalValue = Math.min(newValue, DAILY_GOAL + 1000);
      saveWaterData(finalValue);
      return finalValue;
    });
  };

  const removeWater = (amount: number) => {
    setConsumed((prev) => {
      const newValue = Math.max(prev - amount, 0);
      saveWaterData(newValue);
      return newValue;
    });
  };

  const animateWave = () => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  const getMotivationalMessage = () => {
    if (progress >= 100) {
      return '🎉 Great job! You reached your daily goal!';
    }
    if (progress >= 75) {
      return '💪 Almost there! Keep it up!';
    }
    if (progress >= 50) {
      return '👍 Halfway there! You&apos;re doing great!';
    }
    if (progress >= 25) {
      return '🌊 Good start! Keep drinking!';
    }
    return '💧 Start hydrating! Your body needs it!';
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Water Tracker</Text>
          <Text style={styles.subtitle}>Stay hydrated, stay healthy</Text>
        </View>

        <View style={styles.mainCard}>
          <Animated.View
            style={[
              styles.waterContainer,
              {
                transform: [{ scale }],
              },
            ]}
          >
            <View style={styles.glassOuter}>
              <View
                style={[
                  styles.waterLevel,
                  {
                    height: `${progress}%`,
                  },
                ]}
              >
                <View style={styles.waterSurface} />
              </View>
              <Droplet size={60} color={Colors.waterLight} style={styles.dropletIcon} />
            </View>
          </Animated.View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{consumed}</Text>
              <Text style={styles.statLabel}>ml consumed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{remaining}</Text>
              <Text style={styles.statLabel}>ml remaining</Text>
            </View>
          </View>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>

          <Text style={styles.motivationalText}>{getMotivationalMessage()}</Text>
        </View>

        <View style={styles.recommendationCard}>
          <View style={styles.recommendationHeader}>
            <Target size={20} color={Colors.primary} />
            <Text style={styles.recommendationTitle}>Daily Recommendation</Text>
          </View>
          <Text style={styles.recommendationValue}>{DAILY_GOAL} ml</Text>
          <Text style={styles.recommendationDescription}>
            Based on average adult needs. Adjust based on your activity level, climate, and body weight.
          </Text>

          <View style={styles.tipCard}>
            <TrendingUp size={18} color={Colors.secondary} />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Hydration Tips</Text>
              <Text style={styles.tipText}>
                • Drink water before, during, and after workouts{'\n'}
                • Drink more in hot weather{'\n'}
                • Listen to your body&apos;s thirst signals
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.quickAddSection}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.quickAddGrid}>
            {QUICK_ADD_AMOUNTS.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.quickAddButton}
                onPress={() => addWater(amount)}
                activeOpacity={0.7}
              >
                <Droplet size={24} color={Colors.primary} />
                <Text style={styles.quickAddText}>{amount} ml</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.controlSection}>
          <Text style={styles.sectionTitle}>Custom Amount</Text>
          <View style={styles.controlRow}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => removeWater(100)}
              activeOpacity={0.7}
            >
              <Minus size={24} color={Colors.cardBackground} />
              <Text style={styles.controlButtonText}>100 ml</Text>
            </TouchableOpacity>

            <View style={styles.currentAmount}>
              <Text style={styles.currentAmountValue}>{consumed}</Text>
              <Text style={styles.currentAmountLabel}>ml</Text>
            </View>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => addWater(100)}
              activeOpacity={0.7}
            >
              <Plus size={24} color={Colors.cardBackground} />
              <Text style={styles.controlButtonText}>100 ml</Text>
            </TouchableOpacity>
          </View>
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
    lineHeight: 24,
  },
  mainCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  waterContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  glassOuter: {
    width: 140,
    height: 240,
    borderWidth: 3,
    borderColor: Colors.primary,
    borderRadius: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
    backgroundColor: Colors.waterBackground,
  },
  waterLevel: {
    width: '100%',
    backgroundColor: Colors.water,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'flex-start',
  },
  waterSurface: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.waterLight,
  },
  dropletIcon: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    marginLeft: -30,
    marginTop: -30,
    opacity: 0.3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  motivationalText: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  recommendationCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  recommendationValue: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 8,
  },
  recommendationDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: Colors.secondary + '10',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.secondary + '20',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  quickAddSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  quickAddGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAddButton: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: Colors.cardBackground,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickAddText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  controlSection: {
    marginBottom: 20,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  controlButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.cardBackground,
  },
  currentAmount: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  currentAmountValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  currentAmountLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
});
