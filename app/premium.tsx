import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { AppText as Text } from '../components/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Colors } from '../constants/colors';
import { Radius, Shadow, Spacing } from '../constants/theme';

const plans = [
  {
    id: 'free',
    title: 'Free',
    price: '₱0',
    features: ['Standard matching', 'Basic profile', 'Limited insights'],
  },
  {
    id: 'plus',
    title: 'Plus',
    price: '₱149',
    features: ['Priority matching', 'Profile highlights', 'Weekly insights'],
  },
  {
    id: 'pro',
    title: 'Pro',
    price: '₱299',
    features: ['Priority matching', 'Profile boost', 'Analytics', 'Premium badge'],
  },
];

const PremiumScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Premium</Text>
        <Text style={styles.subtitle}>Choose the plan that fits your goals.</Text>

        <FlatList
          data={plans}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={[styles.planCard, item.id === 'pro' && styles.planHighlight]}>
              <View style={styles.planHeader}>
                <Text style={styles.planTitle}>{item.title}</Text>
                <Text style={styles.planPrice}>{item.price}</Text>
              </View>
              <FlatList
                data={item.features}
                keyExtractor={(feature) => feature}
                scrollEnabled={false}
                renderItem={({ item: feature }) => (
                  <Text style={styles.featureText}>- {feature}</Text>
                )}
              />
              {item.id === 'pro' && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Upgrade to Pro"
                  onPress={() => {}}
                  style={({ pressed }) => [styles.ctaButton, pressed && styles.pressed]}
                >
                  <Text style={styles.ctaText}>Upgrade to Pro</Text>
                </Pressable>
              )}
            </View>
          )}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Text style={styles.backText}>Back</Text>
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
    padding: Spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  planCard: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    ...(Shadow || {}),
  },
  planHighlight: {
    borderColor: Colors.primary,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  featureText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  ctaButton: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  ctaText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 13,
  },
  backButton: {
    marginTop: Spacing.lg,
    alignSelf: 'center',
  },
  backText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});

export default PremiumScreen;
