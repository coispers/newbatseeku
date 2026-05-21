import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { AppText as Text } from '../../components/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Colors } from '../../constants/colors';
import { Radius, Spacing } from '../../constants/theme';

const Step3Screen = () => {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.15, duration: 900, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    animation.start();

    const timer = setTimeout(() => {
      router.replace('/request/step4');
    }, 3000);

    return () => {
      animation.stop();
      clearTimeout(timer);
    };
  }, [router, scale]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.progress}>Step 3 of 4</Text>
        <Animated.View style={[styles.pulse, { transform: [{ scale }] }]} />
        <Text style={styles.title}>Finding available tutor...</Text>
        <Text style={styles.subtitle}>Programming - Urgent</Text>
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
