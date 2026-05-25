import React, { useEffect, useState } from 'react';
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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing } from '../../constants/theme';
import { freelancers } from '../../constants/mock-data';
import { Avatar } from '../../components/ui/Avatar';

const categories: Array<{ id: string; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }> = [
  { id: 'tutoring', label: 'Tutoring', icon: 'school' },
  { id: 'programming', label: 'Programming', icon: 'code-tags' },
  { id: 'math', label: 'Math', icon: 'calculator' },
  { id: 'lab', label: 'Lab', icon: 'flask' },
  { id: 'thesis', label: 'Thesis', icon: 'file-document' },
  { id: 'research', label: 'Research', icon: 'magnify' },
  { id: 'quick', label: 'Quick Errands', icon: 'clock' },
];

const urgencies = ['Normal', 'Urgent', 'ASAP'];
const durationPresets = ['2 hours', '1 day', '1 week', 'Custom'];

const Step1Screen = () => {
  const router = useRouter();
  const { freelancerId } = useLocalSearchParams<{ freelancerId?: string }>();
  const [selectedCategory, setSelectedCategory] = useState('tutoring');
  const [urgency, setUrgency] = useState('Normal');
  const [details, setDetails] = useState('');
  const [durationPreset, setDurationPreset] = useState('2 hours');
  const [customDuration, setCustomDuration] = useState('');

  const isQuickErrand = selectedCategory === 'quick';

  const selectedTutor = freelancerId
    ? freelancers.find((item) => item.id === freelancerId)
    : undefined;

  useEffect(() => {
    if (isQuickErrand) {
      setUrgency('ASAP');
    }
  }, [isQuickErrand]);

  useEffect(() => {
    if (!isQuickErrand) {
      return;
    }

    if (durationPreset === '1 day' || durationPreset === '1 week') {
      setDurationPreset('2 hours');
    }
  }, [durationPreset, isQuickErrand]);

  const handleContinue = () => {
    if (!selectedCategory) {
      Toast.show({ type: 'error', text1: 'Please select a category.' });
      return;
    }

    if (!details.trim()) {
      Toast.show({ type: 'error', text1: 'Please describe your request.' });
      return;
    }

    if (!urgency) {
      Toast.show({ type: 'error', text1: 'Please select an urgency level.' });
      return;
    }

    router.push({
      pathname: '/request/step2',
      params: {
        ...(freelancerId ? { freelancerId } : {}),
        category: selectedCategory,
        urgency,
        details,
        duration: durationPreset === 'Custom' ? customDuration : durationPreset,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Ionicons name="chevron-back" size={18} color={Colors.textPrimary} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.progress}>Step 1 of 4</Text>
        <Text style={styles.title}>What do you need help with?</Text>

        {selectedTutor && (
          <View style={styles.selectedTutorCard}>
            <Avatar initials={selectedTutor.avatar} size={44} />
            <View style={styles.selectedTutorInfo}>
              <Text style={styles.selectedTutorTitle}>Requesting</Text>
              <Text style={styles.selectedTutorName}>{selectedTutor.name}</Text>
              <Text style={styles.selectedTutorMeta}>{selectedTutor.expertise[0]}</Text>
            </View>
          </View>
        )}

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
          value={details}
          onChangeText={setDetails}
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
              disabled={isQuickErrand && item !== 'ASAP'}
              style={({ pressed }) => [
                styles.urgencyPill,
                urgency === item && styles.urgencySelected,
                isQuickErrand && item !== 'ASAP' && styles.urgencyDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.urgencyText, urgency === item && styles.urgencyTextSelected]}>{item}</Text>
            </Pressable>
          )}
        />

        <Text style={styles.sectionTitle}>Duration</Text>
        <FlatList
          data={durationPresets}
          horizontal
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.durationRow}
          ItemSeparatorComponent={() => <View style={styles.durationSeparator} />}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={item}
              onPress={() => setDurationPreset(item)}
              disabled={isQuickErrand && (item === '1 day' || item === '1 week')}
              style={({ pressed }) => [
                styles.durationPill,
                durationPreset === item && styles.durationSelected,
                isQuickErrand && (item === '1 day' || item === '1 week') && styles.durationDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[
                  styles.durationText,
                  durationPreset === item && styles.durationTextSelected,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          )}
        />

        {durationPreset === 'Custom' && (
          <TextInput
            value={customDuration}
            onChangeText={setCustomDuration}
            placeholder="Enter custom duration"
            placeholderTextColor={Colors.textMuted}
            style={styles.customDurationInput}
          />
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continue"
          onPress={handleContinue}
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
    marginTop: Spacing.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  backText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
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
  selectedTutorCard: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    ...(Shadow || {}),
  },
  selectedTutorInfo: {
    flex: 1,
  },
  selectedTutorTitle: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  selectedTutorName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  selectedTutorMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
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
  urgencyDisabled: {
    opacity: 0.5,
  },
  urgencyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  urgencyTextSelected: {
    color: Colors.white,
  },
  durationRow: {
    marginTop: Spacing.sm,
  },
  durationSeparator: {
    width: Spacing.sm,
  },
  durationPill: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    minWidth: 88,
    alignItems: 'center',
  },
  durationSelected: {
    backgroundColor: Colors.primary,
  },
  durationDisabled: {
    opacity: 0.5,
  },
  durationText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  durationTextSelected: {
    color: Colors.white,
  },
  customDurationInput: {
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    color: Colors.textPrimary,
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
