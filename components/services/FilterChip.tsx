import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { AppText as Text } from '../ui/AppText';

import { Colors } from '../../constants/colors';
import { Radius, Spacing } from '../../constants/theme';

type FilterChipProps = {
  label: string;
  isSelected: boolean;
  onPress: () => void;
};

export const FilterChip = ({ label, isSelected, onPress }: FilterChipProps) => {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        isSelected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.text, isSelected && styles.selectedText]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
  },
  selected: {
    backgroundColor: Colors.primary,
  },
  text: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  selectedText: {
    color: Colors.white,
  },
  pressed: {
    opacity: 0.7,
  },
});
