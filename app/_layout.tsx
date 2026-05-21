import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen, Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';

import { AuthProvider, useAuth } from '../hooks/useAuth';

SplashScreen.preventAutoHideAsync();

const RootLayoutNavigator = () => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (isLoading || !navigationState?.key) {
      return;
    }

    const root = segments[0];
    const inAuthGroup = root === '(auth)';
    const inAdmin = root === 'admin';
    const isGuest = user?.role === 'guest';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
      return;
    }

    if (user && !isGuest && inAuthGroup) {
      router.replace(user.role === 'admin' ? '/admin' : '/(tabs)');
      return;
    }

    if (user?.role === 'admin' && !inAdmin) {
      router.replace('/admin');
    }

    if (user && user.role !== 'admin' && inAdmin) {
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments, router, navigationState?.key]);

  return <Stack screenOptions={{ headerShown: false }} />;
};

const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootLayoutNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;
