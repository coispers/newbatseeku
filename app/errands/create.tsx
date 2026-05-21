import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AppText as Text } from '../../components/ui/AppText';

import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';

const categories = ['Food', 'Printing', 'Library', 'Supplies'];

const CreateErrandScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { createErrandOrder } = useOrders();
  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState(categories[0]);

  const handleSubmit = async () => {
    if (!user) {
      return;
    }

    const order = await createErrandOrder({
      title: title.trim() || 'New errand request',
      budget: Number(budget) || 0,
      location: location.trim() || 'BatStateU',
      category,
      details: title.trim(),
      requesterId: user.id,
      requesterName: user.name,
      requesterAvatar: user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    });

    router.replace(`/order/${order.id}`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title}>Post Errand</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
          >
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Errand title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Print thesis draft"
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
        />

        <Text style={styles.label}>Budget</Text>
        <TextInput
          value={budget}
          onChangeText={setBudget}
          placeholder="₱0"
          placeholderTextColor={Colors.textMuted}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Where should it be done?"
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryRow}>
          {categories.map((item) => (
            <Pressable
              key={item}
              accessibilityRole="button"
              accessibilityLabel={item}
              onPress={() => setCategory(item)}
              style={({ pressed }) => [
                styles.categoryPill,
                category === item && styles.categorySelected,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.categoryText, category === item && styles.categoryTextSelected]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Submit errand"
          onPress={handleSubmit}
          style={({ pressed }) => [styles.submitButton, pressed && styles.pressed]}
        >
          <Text style={styles.submitText}>Post Errand</Text>
        </Pressable>
      </KeyboardAvoidingView>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  closeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
  },
  closeText: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  label: {
    marginTop: Spacing.lg,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  input: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
    ...(Shadow || {}),
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  categoryPill: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  categorySelected: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  categoryTextSelected: {
    color: Colors.white,
  },
  submitButton: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  submitText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});

export default CreateErrandScreen;
