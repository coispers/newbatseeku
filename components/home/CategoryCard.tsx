import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { AppText as Text } from '../ui/AppText';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../../constants/theme';

type CategoryCardProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isSelected?: boolean;
  onPress: () => void;
};

export const CategoryCard = ({ label, icon, isSelected, onPress }: CategoryCardProps) => {
  const { Colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        isSelected && { backgroundColor: Colors.primary },
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name={icon} size={16} color={isSelected ? Colors.white : Colors.textSecondary} />
      <Text style={[styles.label, isSelected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: '#F0F0F2',
    marginRight: Spacing.sm,
  },
  label: {
    fontSize: 13,
    color: '#6B6B6B',
    fontWeight: '500',
  },
  labelSelected: {
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.7,
  },
});

