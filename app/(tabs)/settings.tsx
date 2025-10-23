import { Globe } from 'lucide-react-native';
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
import { useLanguage, LANGUAGES, type SupportedLanguage } from '@/contexts/LanguageContext';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { t, currentLanguage, changeLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.general')}</Text>

          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.settingIcon,
                    { backgroundColor: Colors.primary + '20' },
                  ]}
                >
                  <Globe size={20} color={Colors.primary} />
                </View>
                <Text style={styles.settingLabel}>{t('settings.language')}</Text>
              </View>
              <Text style={styles.settingValue}>
                {LANGUAGES.find((l) => l.code === currentLanguage)?.flag}{' '}
                {LANGUAGES.find((l) => l.code === currentLanguage)?.name}
              </Text>
            </View>

            {LANGUAGES.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageOption,
                  currentLanguage === language.code && styles.languageOptionActive,
                ]}
                onPress={() => changeLanguage(language.code as SupportedLanguage)}
                activeOpacity={0.7}
              >
                <Text style={styles.languageFlag}>{language.flag}</Text>
                <Text
                  style={[
                    styles.languageName,
                    currentLanguage === language.code && styles.languageNameActive,
                  ]}
                >
                  {language.name}
                </Text>
                {currentLanguage === language.code && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.about')}</Text>

          <View style={styles.card}>
            <TouchableOpacity
              style={styles.settingItem}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingLabel}>{t('settings.version')}</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>1.0.0</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Gym Buddy Pro</Text>
          <Text style={styles.footerSubtext}>
            Made with ❤️ for fitness enthusiasts
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
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
    paddingLeft: 4,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingLeft: 64,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  languageOptionActive: {
    backgroundColor: Colors.primary + '10',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageName: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
    fontWeight: '500' as const,
  },
  languageNameActive: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '700' as const,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
