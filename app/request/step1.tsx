import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { AppText as Text } from '../../components/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing } from '../../constants/theme';

const categories: Array<{ id: string; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }> = [
  { id: 'tutoring', label: 'Tutoring', icon: 'school' },
  { id: 'programming', label: 'Programming', icon: 'code-tags' },
  { id: 'math', label: 'Math', icon: 'calculator' },
  { id: 'lab', label: 'Lab', icon: 'flask' },
  { id: 'thesis', label: 'Thesis', icon: 'file-document' },
  { id: 'research', label: 'Research', icon: 'magnify' },
];

const urgencies = ['Normal', 'Urgent', 'ASAP'];

const Step1Screen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('tutoring');
  const [urgency, setUrgency] = useState('Normal');

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Text style={styles.progress}>Step 1 of 4</Text>
        <Text style={styles.title}>What do you need help with?</Text>

        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.categoryRow}
          contentContainerStyle={styles.categoryGrid}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={item.label}
              onPress={() => setSelectedCategory(item.id)}
              style={({ pressed }) => [
                styles.categoryCard,
                selectedCategory === item.id && styles.categorySelected,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={20}
                color={selectedCategory === item.id ? Colors.white : Colors.primary}
              />
              <Text style={[styles.categoryLabel, selectedCategory === item.id && styles.categoryLabelSelected]}>
                {item.label}
              </Text>
            </Pressable>
          )}
        />

        <TextInput
          placeholder="Describe your problem"
          placeholderTextColor={Colors.textMuted}
          multiline
          style={styles.textArea}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add file"
          onPress={() => {}}
          style={({ pressed }) => [styles.attachRow, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons name="paperclip" size={18} color={Colors.textMuted} />
          <Text style={styles.attachText}>Add file</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Urgency</Text>
        <FlatList
          data={urgencies}
          horizontal
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.urgencyRow}
          ItemSeparatorComponent={() => <View style={styles.urgencySeparator} />}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={item}
              onPress={() => setUrgency(item)}
              style={({ pressed }) => [
                styles.urgencyPill,
                urgency === item && styles.urgencySelected,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.urgencyText, urgency === item && styles.urgencyTextSelected]}>{item}</Text>
            </Pressable>
          )}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Select deadline"
          onPress={() => {}}
          style={({ pressed }) => [styles.deadlineRow, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons name="calendar" size={18} color={Colors.textMuted} />
          <Text style={styles.deadlineText}>Set deadline</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continue"
          onPress={() => router.push('/request/step2')}
          style={({ pressed }) => [styles.continueButton, pressed && styles.pressed]}
        >
          <Text style={styles.continueText}>Continue</Text>
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
  progress: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
  },
  categoryGrid: {
    marginTop: Spacing.md,
  },
  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  categoryCard: {
    width: '48%',
    minHeight: 72,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    justifyContent: 'center',
    gap: Spacing.xs,
    ...(Shadow || {}),
  },
  categorySelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  categoryLabelSelected: {
    color: Colors.white,
  },
  textArea: {
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    minHeight: 100,
    color: Colors.textPrimary,
  },
  attachRow: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  attachText: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  sectionTitle: {
    marginTop: Spacing.lg,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  urgencyRow: {
    marginTop: Spacing.sm,
  },
  urgencySeparator: {
    width: Spacing.sm,
  },
  urgencyPill: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    minWidth: 88,
    alignItems: 'center',
  },
  urgencySelected: {
    backgroundColor: Colors.primary,
  },
  urgencyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  urgencyTextSelected: {
    color: Colors.white,
  },
  deadlineRow: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  deadlineText: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  continueButton: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  continueText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});

export default Step1Screen;
