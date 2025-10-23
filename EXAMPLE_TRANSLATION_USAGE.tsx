// This is an EXAMPLE file showing how to convert a screen to use translations
// Compare with the original home.tsx to see the differences

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGamification } from '@/contexts/GamificationContext';
import Colors from '@/constants/colors';

export default function ExampleTranslatedScreen() {
  const { t } = useLanguage(); // 👈 Import the translation function
  const { userStats } = useGamification();
  
  return (
    <View style={styles.container}>
      {/* BEFORE: <Text>Welcome Back!</Text> */}
      {/* AFTER: */}
      <Text style={styles.greeting}>{t('home.welcomeBack')}</Text>
      
      {/* BEFORE: <Text>Day Streak</Text> */}
      {/* AFTER: */}
      <Text style={styles.label}>{t('home.dayStreak')}</Text>
      
      {/* BEFORE: <Text>Best: {userStats.bestStreak} days</Text> */}
      {/* AFTER (with variable): */}
      <Text style={styles.subtitle}>
        {t('home.best', { count: userStats.bestStreak })}
      </Text>
      
      {/* BEFORE: <Text>Level {userStats.level}</Text> */}
      {/* AFTER (with variable): */}
      <Text style={styles.level}>
        {t('home.level', { level: userStats.level })}
      </Text>
      
      {/* BEFORE: <Text>{userStats.xpToNextLevel - userStats.xp} XP to Level {userStats.level + 1}</Text> */}
      {/* AFTER (with multiple variables): */}
      <Text style={styles.xpText}>
        {t('home.xpToNextLevel', { 
          xp: userStats.xpToNextLevel - userStats.xp, 
          level: userStats.level + 1 
        })}
      </Text>
      
      {/* Button text */}
      {/* BEFORE: <Text>Start Workout</Text> */}
      {/* AFTER: */}
      <Text style={styles.buttonText}>{t('common.startWorkout')}</Text>
      
      {/* Section titles */}
      {/* BEFORE: <Text>This Week</Text> */}
      {/* AFTER: */}
      <Text style={styles.sectionTitle}>{t('home.thisWeek')}</Text>
      
      {/* BEFORE: <Text>Quick Actions</Text> */}
      {/* AFTER: */}
      <Text style={styles.sectionTitle}>{t('home.quickActions')}</Text>
      
      {/* BEFORE: <Text>Water Intake</Text> */}
      {/* AFTER: */}
      <Text style={styles.title}>{t('home.waterIntake')}</Text>
      
      {/* BEFORE: <Text>5 of 7 workouts completed</Text> */}
      {/* AFTER (with variable): */}
      <Text style={styles.text}>
        {t('home.workoutsCompleted', { count: 5 })}
      </Text>
    </View>
  );
}

// HOW TO USE IN YOUR EXISTING SCREENS:
// 
// 1. Add this import at the top:
//    import { useLanguage } from '@/contexts/LanguageContext';
//
// 2. Get the translation function:
//    const { t } = useLanguage();
//
// 3. Replace all hardcoded text:
//    Before: <Text>Welcome Back!</Text>
//    After:  <Text>{t('home.welcomeBack')}</Text>
//
// 4. For text with variables:
//    Before: <Text>Level {level}</Text>
//    After:  <Text>{t('home.level', { level: level })}</Text>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  level: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  xpText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  text: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
