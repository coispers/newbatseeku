import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { AppText as Text } from '../components/ui/AppText';
import { Colors } from '../constants/colors';
import { Radius, Shadow, Spacing } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';

const categories = [
  { id: 'tutoring', label: 'Tutoring' },
  { id: 'programming', label: 'Programming' },
  { id: 'math', label: 'Math' },
  { id: 'lab', label: 'Lab' },
  { id: 'thesis', label: 'Thesis' },
  { id: 'research', label: 'Research' },
];

const urgencies = ['Normal', 'Urgent', 'ASAP'];

const FindHelpScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { createServiceOrder } = useOrders();

  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [location, setLocation] = useState('BatStateU');
  const [selectedCategory, setSelectedCategory] = useState('tutoring');
  const [urgency, setUrgency] = useState('Normal');

  const categoryLabel = useMemo(
    () => categories.find((item) => item.id === selectedCategory)?.label ?? 'Tutoring',
    [selectedCategory]
  );

  const handleSubmit = async () => {
    if (!user) {
      return;
    }

    const order = await createServiceOrder({
      title: title.trim() || `${categoryLabel} help request`,
      details: details.trim() || `Need help with ${categoryLabel.toLowerCase()}.`,
      category: categoryLabel,
      budget: 200,
      location: location.trim() || 'BatStateU',
      urgency,
      requesterId: user.id,
      requesterName: user.name,
      requesterAvatar: user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    });

    router.push({
      pathname: '/instant-help',
      params: { orderId: order.id },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Find Nearby Help</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
          >
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>

        <Text style={styles.helperText}>Post the request first, then see who is online and nearby.</Text>

        <Text style={styles.label}>Request title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Help with calculus review"
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
        />

        <Text style={styles.label}>Details</Text>
        <TextInput
          value={details}
          onChangeText={setDetails}
          placeholder="What do you need help with?"
          placeholderTextColor={Colors.textMuted}
          multiline
          style={styles.textArea}
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Where should the helper meet you?"
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.pillRow}>
          {categories.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              onPress={() => setSelectedCategory(item.id)}
              style={({ pressed }) => [
                styles.pill,
                selectedCategory === item.id && styles.pillSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.pillText, selectedCategory === item.id && styles.pillTextSelected]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Urgency</Text>
        <View style={styles.pillRow}>
          {urgencies.map((item) => (
            <Pressable
              key={item}
              accessibilityRole="button"
              accessibilityLabel={item}
              onPress={() => setUrgency(item)}
              style={({ pressed }) => [
                styles.pill,
                urgency === item && styles.pillSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.pillText, urgency === item && styles.pillTextSelected]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Post request"
          onPress={handleSubmit}
          style={({ pressed }) => [styles.submitButton, pressed && styles.pressed]}
        >
          <Text style={styles.submitText}>See available helpers</Text>
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
  helperText: {
    marginTop: Spacing.sm,
    fontSize: 13,
    color: Colors.textSecondary,
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
  textArea: {
    marginTop: Spacing.sm,
    minHeight: 110,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
    textAlignVertical: 'top',
    ...(Shadow || {}),
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  pill: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  pillSelected: {
    backgroundColor: Colors.primary,
  },
  pillText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  pillTextSelected: {
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

export default FindHelpScreen;
