# 🌍 How to Add Another Language to the App

## Quick Start

Your app now has **full multi-language support**! Here's what has been added:

### ✅ What's Included
- 🇬🇧 English (en)
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- **Settings screen** with language selector
- **Auto-detection** of device language
- **Persistent storage** of user's language choice
- **Instant updates** when language changes

---

## 🎯 Step-by-Step: Adding a New Language

Let's add **German (Deutsch)** as an example:

### Step 1: Create Translation File

Create `locales/de.ts`:

```typescript
export default {
  common: {
    back: 'Zurück',
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    done: 'Fertig',
    loading: 'Laden...',
    error: 'Fehler',
    success: 'Erfolg',
    viewAll: 'Alle Anzeigen',
    startWorkout: 'Training Starten',
  },
  
  home: {
    welcomeBack: 'Willkommen Zurück!',
    level: 'Level {{level}}',
    yourProgress: 'Dein Fortschritt',
    xpToNextLevel: '{{xp}} XP bis Level {{level}}',
    dayStreak: 'Tage-Serie',
    best: 'Beste: {{count}} Tage',
    thisWeek: 'Diese Woche',
    workoutsCompleted: '{{count}} von 7 Trainings abgeschlossen',
    waterIntake: 'Wasseraufnahme',
    dailyGoalReached: '🎉 Tagesziel erreicht!',
    percentOfGoal: '{{percent}}% des Tagesziels',
    workouts: 'Trainings',
    achievements: 'Erfolge',
    totalTime: 'Gesamtzeit',
    quickActions: 'Schnellaktionen',
    browseWorkouts: 'Trainings Durchsuchen',
    findNextSession: 'Finde deine nächste Trainingseinheit',
    connectWithBuddies: 'Mit Freunden Verbinden',
    findWorkoutPartners: 'Finde Trainingspartner',
  },
  
  // Add all other sections following the same structure as en.ts
  // Copy from locales/en.ts and translate each value
};
```

### Step 2: Update Language Context

Edit `contexts/LanguageContext.tsx`:

```typescript
// 1. Import the new language file
import de from '@/locales/de';

// 2. Add to SupportedLanguage type
export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de';

// 3. Add to LANGUAGES array
export const LANGUAGES = [
  { code: 'en' as const, name: 'English', flag: '🇬🇧' },
  { code: 'es' as const, name: 'Español', flag: '🇪🇸' },
  { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
  { code: 'de' as const, name: 'Deutsch', flag: '🇩🇪' }, // 👈 Add this
];

// 4. Add to i18n initialization
const i18n = new I18n({
  en,
  es,
  fr,
  de, // 👈 Add this
});

// 5. Update validation in loadLanguage function
const loadLanguage = async () => {
  try {
    const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && (stored === 'en' || stored === 'es' || stored === 'fr' || stored === 'de')) {
      // 👆 Add 'de' here
      setCurrentLanguage(stored);
      i18n.locale = stored;
    } else {
      const deviceLocale = getLocales()[0]?.languageCode;
      const defaultLang = 
        deviceLocale === 'es' ? 'es' : 
        deviceLocale === 'fr' ? 'fr' :
        deviceLocale === 'de' ? 'de' : // 👈 Add this
        'en';
      setCurrentLanguage(defaultLang);
      i18n.locale = defaultLang;
    }
  } catch (error) {
    console.log('Error loading language:', error);
  } finally {
    setIsLoading(false);
  }
};
```

### Step 3: Test the New Language

1. Open the app
2. Go to **Settings** tab
3. You should see **German (Deutsch)** with 🇩🇪 flag
4. Tap to select it
5. All text in the app updates to German instantly!

---

## 📱 How to Use Translations in Your Screens

### Basic Usage

```typescript
import { useLanguage } from '@/contexts/LanguageContext';

export default function MyScreen() {
  const { t } = useLanguage();
  
  return (
    <View>
      <Text>{t('common.save')}</Text>
      <Text>{t('home.welcomeBack')}</Text>
    </View>
  );
}
```

### With Variables

```typescript
// Single variable
<Text>{t('home.level', { level: 5 })}</Text>
// Output: "Level 5"

// Multiple variables
<Text>{t('home.xpToNextLevel', { xp: 250, level: 6 })}</Text>
// Output: "250 XP to Level 6"

// Dynamic data
<Text>{t('home.workoutsCompleted', { count: workoutCount })}</Text>
// Output: "5 of 7 workouts completed"
```

### Get Current Language

```typescript
const { currentLanguage, languages } = useLanguage();

console.log(currentLanguage); // 'en', 'es', 'fr', etc.
console.log(languages); // Array of all available languages
```

### Change Language Programmatically

```typescript
const { changeLanguage } = useLanguage();

// Change to Spanish
await changeLanguage('es');

// Change to French
await changeLanguage('fr');
```

---

## 🗂️ File Structure

```
your-app/
├── locales/                    # Translation files
│   ├── en.ts                  # English (reference)
│   ├── es.ts                  # Spanish
│   ├── fr.ts                  # French
│   └── de.ts                  # German (add this)
├── contexts/
│   └── LanguageContext.tsx    # Language management
├── app/(tabs)/
│   └── settings.tsx           # Language settings screen
└── TRANSLATION_GUIDE.md       # This file
```

---

## 🎨 Translation Keys Structure

All translation files follow this structure:

```typescript
{
  common: {        // Common UI elements
    back: 'Back',
    save: 'Save',
    // ...
  },
  home: {          // Home screen
    welcomeBack: 'Welcome Back!',
    // ...
  },
  workouts: {      // Workouts section
    title: 'Workouts',
    // ...
  },
  water: {         // Water tracker
    title: 'Water Tracker',
    // ...
  },
  meals: {         // Meal plans
    title: 'Meal Plans',
    // ...
  },
  progress: {      // Progress tracking
    title: 'Progress',
    // ...
  },
  challenges: {    // Challenges
    title: 'Challenges',
    // ...
  },
  profile: {       // Profile screen
    title: 'Profile',
    // ...
  },
  buddies: {       // Gym buddies
    title: 'Gym Buddies',
    // ...
  },
  settings: {      // Settings screen
    title: 'Settings',
    language: 'Language',
    // ...
  },
}
```

---

## ✅ Checklist for Adding a Language

- [ ] Create `locales/[language-code].ts` file
- [ ] Translate ALL keys from `locales/en.ts`
- [ ] Import in `contexts/LanguageContext.tsx`
- [ ] Add to `SupportedLanguage` type
- [ ] Add to `LANGUAGES` array with flag
- [ ] Add to `i18n` initialization
- [ ] Update validation in `loadLanguage`
- [ ] Test in Settings screen
- [ ] Test all screens to ensure translations appear correctly

---

## 🌟 Popular Languages to Add

Here are some popular languages with their codes and flags:

| Language | Code | Flag | Name in Native Language |
|----------|------|------|------------------------|
| German | de | 🇩🇪 | Deutsch |
| Italian | it | 🇮🇹 | Italiano |
| Portuguese | pt | 🇵🇹 | Português |
| Portuguese (Brazil) | pt-BR | 🇧🇷 | Português (Brasil) |
| Japanese | ja | 🇯🇵 | 日本語 |
| Korean | ko | 🇰🇷 | 한국어 |
| Chinese | zh | 🇨🇳 | 中文 |
| Arabic | ar | 🇸🇦 | العربية |
| Russian | ru | 🇷🇺 | Русский |
| Hindi | hi | 🇮🇳 | हिन्दी |
| Dutch | nl | 🇳🇱 | Nederlands |
| Polish | pl | 🇵🇱 | Polski |
| Turkish | tr | 🇹🇷 | Türkçe |

---

## 🔧 Advanced Features

### RTL (Right-to-Left) Support

For languages like Arabic or Hebrew, you'll need to add RTL support:

```typescript
import { I18nManager } from 'react-native';

// In your language context
const changeLanguage = async (language: SupportedLanguage) => {
  // Enable RTL for Arabic
  if (language === 'ar') {
    I18nManager.forceRTL(true);
  } else {
    I18nManager.forceRTL(false);
  }
  
  // ... rest of your code
};
```

### Pluralization

For complex plural rules:

```typescript
// In translation file
export default {
  items: {
    one: '{{count}} item',
    other: '{{count}} items',
  },
};

// Usage
<Text>{t('items', { count: 1 })}</Text>  // "1 item"
<Text>{t('items', { count: 5 })}</Text>  // "5 items"
```

---

## 🐛 Troubleshooting

### Translation not showing?
1. Check if key exists in ALL language files
2. Verify spelling of translation key
3. Make sure language file is imported in `LanguageContext.tsx`

### Language not appearing in Settings?
1. Verify it's added to `LANGUAGES` array
2. Check `SupportedLanguage` type includes it
3. Restart the app

### Translation showing key instead of text?
- The key doesn't exist in the current language file
- Falls back to English, then shows the key if not found

---

## 📚 Resources

- [i18n-js Documentation](https://github.com/fnando/i18n)
- [Expo Localization](https://docs.expo.dev/versions/latest/sdk/localization/)
- [React Native Internationalization](https://reactnative.dev/docs/new-architecture-library-intro)

---

## 🎉 Done!

Your app now supports multiple languages with:
- ✅ Easy language switching in Settings
- ✅ Auto-detection of device language
- ✅ Persistent language preference
- ✅ Instant UI updates
- ✅ Simple API for developers

Happy translating! 🌍
