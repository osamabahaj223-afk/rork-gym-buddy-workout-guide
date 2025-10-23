import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import Colors from '@/constants/colors';
import { GamificationProvider } from '@/contexts/GamificationContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { trpc, trpcClient } from '@/lib/trpc';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: 'Back',
        headerStyle: {
          backgroundColor: Colors.cardBackground,
        },
        headerTintColor: Colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="workout/[id]"
        options={{
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="exercise/[id]"
        options={{
          headerShown: false,
          presentation: 'card',
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <GamificationProvider>
            <GestureHandlerRootView style={styles.container}>
              <RootLayoutNav />
            </GestureHandlerRootView>
          </GamificationProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
