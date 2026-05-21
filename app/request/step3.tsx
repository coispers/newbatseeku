import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { AppText as Text } from '../../components/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/colors';
import { Radius, Spacing } from '../../constants/theme';
import { freelancers } from '../../constants/mock-data';

const Step3Screen = () => {
  const router = useRouter();
  const { freelancerId } = useLocalSearchParams<{ freelancerId?: string }>();
  const scale = useRef(new Animated.Value(1)).current;

  const selectedTutor = freelancerId
    ? freelancers.find((item) => item.id === freelancerId)
    : undefined;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.15, duration: 900, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    animation.start();

    const timer = setTimeout(() => {
      router.replace({
        pathname: '/request/step4',
        params: freelancerId ? { freelancerId } : undefined,
      });
    }, 3000);

    return () => {
      animation.stop();
      clearTimeout(timer);
    };
  }, [router, scale]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Ionicons name="chevron-back" size={18} color={Colors.textPrimary} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.progress}>Step 3 of 4</Text>
        <Animated.View style={[styles.pulse, { transform: [{ scale }] }]} />
        <Text style={styles.title}>Finding available tutor...</Text>
        <Text style={styles.subtitle}>
          {selectedTutor ? `Requesting ${selectedTutor.name}` : 'Matching your request'}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancel"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.cancel, pressed && styles.pressed]}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  progress: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    fontSize: 12,
    color: Colors.textMuted,
  },
  backButton: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  backText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  pulse: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryLight,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  cancel: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
  },
  cancelText: {
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});

export default Step3Screen;
