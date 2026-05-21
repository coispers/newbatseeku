import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { AppText as Text } from '../../components/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing } from '../../constants/theme';
import { Avatar } from '../../components/ui/Avatar';
import { freelancers } from '../../constants/mock-data';

const Step4Screen = () => {
  const router = useRouter();
  const { freelancerId } = useLocalSearchParams<{ freelancerId?: string }>();
  const fade = useRef(new Animated.Value(0)).current;

  const selectedTutor = freelancerId
    ? freelancers.find((item) => item.id === freelancerId)
    : undefined;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [fade]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Confirm"
          onPress={() => router.replace('/(tabs)')}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Ionicons name="checkmark" size={18} color={Colors.textPrimary} />
          <Text style={styles.backText}>Okay</Text>
        </Pressable>

        <Text style={styles.progress}>Step 4 of 4</Text>
        <Animated.View style={[styles.check, { opacity: fade }]}
        >
          <Ionicons name="checkmark" size={32} color={Colors.white} />
        </Animated.View>

        <Text style={styles.title}>Tutor matched</Text>
        <Text style={styles.subtitle}>Responds within 5 minutes</Text>

        <View style={styles.tutorCard}>
          <Avatar initials={selectedTutor?.avatar ?? 'AC'} size={52} />
          <View style={styles.tutorInfo}>
            <Text style={styles.tutorName}>{selectedTutor?.name ?? 'Andrea Cruz'}</Text>
            <Text style={styles.tutorMeta}>
              {selectedTutor ? `Rating ${selectedTutor.rating.toFixed(1)} - ETA 5 min` : 'Rating 4.9 - ETA 5 min'}
            </Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open chat"
            onPress={() => router.replace('/chat/c1')}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.primaryText}>Open Chat</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View profile"
            onPress={() =>
              router.replace(selectedTutor ? `/freelancer/${selectedTutor.id}` : '/freelancer/f1')
            }
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.secondaryText}>View Profile</Text>
          </Pressable>
        </View>
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
    padding: Spacing.lg,
    justifyContent: 'center',
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
  check: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.verified,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  tutorCard: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    ...(Shadow || {}),
  },
  tutorInfo: {
    alignItems: 'flex-start',
  },
  tutorName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  tutorMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  buttonRow: {
    marginTop: Spacing.lg,
    width: '100%',
    gap: Spacing.sm,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  primaryText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  secondaryText: {
    color: Colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default Step4Screen;
