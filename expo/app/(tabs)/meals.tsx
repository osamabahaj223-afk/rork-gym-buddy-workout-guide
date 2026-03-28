import { ChevronRight, Clock, Flame, Droplet, ChefHat } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { MEAL_PLANS, NUTRITION_GOALS } from '@/mocks/meals';
import type { Meal, WorkoutLevel } from '@/types/meal';

export default function MealsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedLevel, setSelectedLevel] = useState<WorkoutLevel>('beginner');
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const currentPlan = MEAL_PLANS.find((plan) => plan.level === selectedLevel);
  const nutritionGoals = NUTRITION_GOALS[selectedLevel];

  const mealsByType = {
    breakfast: currentPlan?.meals.filter((m) => m.type === 'breakfast') || [],
    lunch: currentPlan?.meals.filter((m) => m.type === 'lunch') || [],
    dinner: currentPlan?.meals.filter((m) => m.type === 'dinner') || [],
    snack: currentPlan?.meals.filter((m) => m.type === 'snack') || [],
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Meal Plans</Text>
          <Text style={styles.subtitle}>
            Nutrition tailored to your fitness level
          </Text>
        </View>

        <View style={styles.levelSelector}>
          {(['beginner', 'intermediate', 'advanced'] as WorkoutLevel[]).map(
            (level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.levelButton,
                  selectedLevel === level && styles.levelButtonActive,
                ]}
                onPress={() => setSelectedLevel(level)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.levelButtonText,
                    selectedLevel === level && styles.levelButtonTextActive,
                  ]}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        <LinearGradient
          colors={[Colors.xpGradientStart, Colors.xpGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.goalsCard}
        >
          <View style={styles.goalsHeader}>
            <ChefHat size={28} color={Colors.text} />
            <Text style={styles.goalsTitle}>Daily Nutrition Goals</Text>
          </View>
          <Text style={styles.goalsDescription}>
            {nutritionGoals.description}
          </Text>

          <View style={styles.macrosGrid}>
            <View style={styles.macroItem}>
              <Flame size={24} color={Colors.accent} />
              <Text style={styles.macroValue}>
                {nutritionGoals.calories.recommended}
              </Text>
              <Text style={styles.macroLabel}>Calories</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{nutritionGoals.protein}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{nutritionGoals.carbs}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{nutritionGoals.fats}g</Text>
              <Text style={styles.macroLabel}>Fats</Text>
            </View>
          </View>

          <View style={styles.waterSection}>
            <Droplet size={20} color={Colors.secondary} />
            <Text style={styles.waterText}>
              Recommended Water: {nutritionGoals.waterIntake}L per day
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Breakfast</Text>
          {mealsByType.breakfast.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onPress={() => setSelectedMeal(meal)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lunch</Text>
          {mealsByType.lunch.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onPress={() => setSelectedMeal(meal)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dinner</Text>
          {mealsByType.dinner.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onPress={() => setSelectedMeal(meal)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Snacks</Text>
          {mealsByType.snack.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onPress={() => setSelectedMeal(meal)}
            />
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={selectedMeal !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedMeal(null)}
      >
        {selectedMeal && (
          <MealDetail
            meal={selectedMeal}
            onClose={() => setSelectedMeal(null)}
          />
        )}
      </Modal>
    </View>
  );
}

function MealCard({ meal, onPress }: { meal: Meal; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={styles.mealCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: meal.imageUrl }} style={styles.mealImage} />
      <View style={styles.mealContent}>
        <Text style={styles.mealName}>{meal.name}</Text>
        <View style={styles.mealMeta}>
          <View style={styles.metaItem}>
            <Flame size={14} color={Colors.accent} />
            <Text style={styles.metaText}>{meal.calories} cal</Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={14} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{meal.prepTime}</Text>
          </View>
        </View>
        <View style={styles.macros}>
          <Text style={styles.macroChip}>P: {meal.protein}g</Text>
          <Text style={styles.macroChip}>C: {meal.carbs}g</Text>
          <Text style={styles.macroChip}>F: {meal.fats}g</Text>
        </View>
      </View>
      <ChevronRight size={24} color={Colors.textSecondary} />
    </TouchableOpacity>
  );
}

function MealDetail({ meal, onClose }: { meal: Meal; onClose: () => void }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.modalScroll}
        contentContainerStyle={styles.modalContent}
      >
        <Image source={{ uri: meal.imageUrl }} style={styles.detailImage} />

        <View style={styles.detailHeader}>
          <Text style={styles.detailTitle}>{meal.name}</Text>
          <View style={styles.detailMeta}>
            <View style={styles.metaItem}>
              <Flame size={20} color={Colors.accent} />
              <Text style={styles.detailMetaText}>{meal.calories} cal</Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={20} color={Colors.textSecondary} />
              <Text style={styles.detailMetaText}>{meal.prepTime}</Text>
            </View>
          </View>
        </View>

        <View style={styles.macrosDetail}>
          <View style={styles.macroDetailItem}>
            <Text style={styles.macroDetailValue}>{meal.protein}g</Text>
            <Text style={styles.macroDetailLabel}>Protein</Text>
          </View>
          <View style={styles.macroDetailItem}>
            <Text style={styles.macroDetailValue}>{meal.carbs}g</Text>
            <Text style={styles.macroDetailLabel}>Carbs</Text>
          </View>
          <View style={styles.macroDetailItem}>
            <Text style={styles.macroDetailValue}>{meal.fats}g</Text>
            <Text style={styles.macroDetailLabel}>Fats</Text>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Ingredients</Text>
          {meal.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.ingredientText}>{ingredient}</Text>
            </View>
          ))}
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Instructions</Text>
          {meal.instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.modalFooter, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
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
  },
  levelSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  levelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
  },
  levelButtonActive: {
    backgroundColor: Colors.primary,
  },
  levelButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  levelButtonTextActive: {
    color: Colors.text,
  },
  goalsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  goalsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  goalsTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  goalsDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
    lineHeight: 20,
  },
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  macroItem: {
    alignItems: 'center',
    gap: 4,
  },
  macroValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  macroLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  waterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
  },
  waterText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600' as const,
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
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  mealContent: {
    flex: 1,
    gap: 6,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  mealMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  macros: {
    flexDirection: 'row',
    gap: 8,
  },
  macroChip: {
    fontSize: 11,
    color: Colors.text,
    backgroundColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalScroll: {
    flex: 1,
  },
  modalContent: {
    paddingBottom: 100,
  },
  detailImage: {
    width: '100%',
    height: 300,
  },
  detailHeader: {
    padding: 20,
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  detailMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  detailMetaText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  macrosDetail: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  macroDetailItem: {
    alignItems: 'center',
    gap: 4,
  },
  macroDetailValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  macroDetailLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  detailSection: {
    padding: 20,
  },
  detailSectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  ingredientItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 16,
    color: Colors.primary,
    marginRight: 12,
    fontWeight: '700' as const,
  },
  ingredientText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
    lineHeight: 24,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  instructionText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
    lineHeight: 24,
  },
  modalFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  closeButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
});
