# 🌍 Multi-Language Support Guide

Your Gym Buddy Pro app now supports multiple languages! Currently supported:
- 🇬🇧 **English** (en)
- 🇪🇸 **Español** (es) 
- 🇫🇷 **Français** (fr)

## 📱 How Users Change Language

1. Go to the **Settings** tab (new tab added to bottom navigation)
2. Under "General" section, tap on "Language"
3. Select desired language from the list
4. The app will instantly update to show all text in the selected language

## 🔧 How to Use Translations in Your Code

### Step 1: Import the hook
```typescript
import { useLanguage } from '@/contexts/LanguageContext';
```

### Step 2: Use the translation function
```typescript
export default function MyScreen() {
  const { t } = useLanguage();
  
  return (
    <View>
      <Text>{t('home.welcomeBack')}</Text>
      <Text>{t('common.save')}</Text>
    </View>
  );
}
```

### Step 3: Use with dynamic values
```typescript
// Translation with variables
<Text>{t('home.level', { level: 5 })}</Text>
// Output: "Level 5"

<Text>{t('home.workoutsCompleted', { count: 5 })}</Text>
// Output: "5 of 7 workouts completed"

<Text>{t('home.xpToNextLevel', { xp: 250, level: 6 })}</Text>
// Output: "250 XP to Level 6"
```

## 📝 Adding New Translations

### 1. Add to English file (`locales/en.ts`)
```typescript
export default {
  myNewSection: {
    title: 'My Title',
    description: 'My Description',
    buttonText: 'Click Me',
  },
};
```

### 2. Add to Spanish file (`locales/es.ts`)
```typescript
export default {
  myNewSection: {
    title: 'Mi Título',
    description: 'Mi Descripción',
    buttonText: 'Haz Click',
  },
};
```

### 3. Add to French file (`locales/fr.ts`)
```typescript
export default {
  myNewSection: {
    title: 'Mon Titre',
    description: 'Ma Description',
    buttonText: 'Cliquez-Moi',
  },
};
```

### 4. Use in your components
```typescript
<Text>{t('myNewSection.title')}</Text>
<Text>{t('myNewSection.description')}</Text>
<Button title={t('myNewSection.buttonText')} />
```

## 🌐 Adding a New Language

### 1. Create a new translation file
Create `locales/de.ts` (for German, for example):
```typescript
export default {
  common: {
    back: 'Zurück',
    save: 'Speichern',
    // ... add all translations
  },
  // ... copy structure from en.ts
};
```

### 2. Update the Language Context
Edit `contexts/LanguageContext.tsx`:

```typescript
import de from '@/locales/de';

// Add to supported languages type
export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de';

// Add to languages array
export const LANGUAGES = [
  { code: 'en' as const, name: 'English', flag: '🇬🇧' },
  { code: 'es' as const, name: 'Español', flag: '🇪🇸' },
  { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
  { code: 'de' as const, name: 'Deutsch', flag: '🇩🇪' },
];

// Add to i18n initialization
const i18n = new I18n({
  en,
  es,
  fr,
  de,
});

// Update the validation in loadLanguage function
if (stored && (stored === 'en' || stored === 'es' || stored === 'fr' || stored === 'de')) {
  // ...
}
```

### 3. Add auto-detection (optional)
In `contexts/LanguageContext.tsx`, update the `loadLanguage` function:
```typescript
const deviceLocale = getLocales()[0]?.languageCode;
const defaultLang = 
  deviceLocale === 'es' ? 'es' : 
  deviceLocale === 'fr' ? 'fr' :
  deviceLocale === 'de' ? 'de' :
  'en';
```

## 🎯 Best Practices

### ✅ DO:
- **Use translation keys everywhere** - Never hardcode user-facing text
- **Keep keys descriptive** - `home.welcomeBack` is better than `h.wb`
- **Group related translations** - Use sections like `home.*`, `workouts.*`, etc.
- **Test all languages** - Switch between languages to ensure everything looks good
- **Consider text length** - Spanish/French text can be 30% longer than English

### ❌ DON'T:
- **Don't hardcode text** - Always use `t('key')` instead of `'Text'`
- **Don't forget variables** - If text has dynamic data, use `{{variable}}` syntax
- **Don't skip translations** - Add the key to ALL language files
- **Don't concatenate translations** - Use variables instead of joining strings

## 📋 Current Translation Coverage

All major sections have translations:
- ✅ Home Screen
- ✅ Workouts Library
- ✅ Water Tracker
- ✅ Meal Plans
- ✅ Progress Tracking
- ✅ Challenges
- ✅ Profile
- ✅ Settings
- ✅ Common UI elements

## 🚀 Quick Example: Updating Home Screen

See `app/(tabs)/home.tsx` for a full example. Here's a snippet:

```typescript
import { useLanguage } from '@/contexts/LanguageContext';

export default function HomeScreen() {
  const { t } = useLanguage();
  
  // Instead of: <Text>Welcome Back!</Text>
  // Use: 
  <Text>{t('home.welcomeBack')}</Text>
  
  // Instead of: <Text>Day Streak</Text>
  // Use:
  <Text>{t('home.dayStreak')}</Text>
  
  // With variables:
  <Text>{t('home.best', { count: userStats.bestStreak })}</Text>
}
```

## 🔍 Available Translation Keys

Check the files in `locales/` folder to see all available keys:
- `locales/en.ts` - English (reference file)
- `locales/es.ts` - Spanish
- `locales/fr.ts` - French

## 💡 Tips

1. **Current language detection**: The app auto-detects device language on first launch
2. **Persistent storage**: Selected language is saved and persists across app restarts
3. **Instant updates**: When language changes, all screens update immediately
4. **Fallback**: If a translation is missing, it falls back to English

---

**That's it!** Your app now supports multiple languages. Happy translating! 🎉
