import React from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { AppText as Text } from './AppText';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/colors';
import { Radius, Spacing } from '../../constants/theme';

type SearchBarProps = {
  placeholder: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export const SearchBar = ({ placeholder, onPress, style }: SearchBarProps) => {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Search"
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed, style]}
    >
      <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
      <Text style={styles.placeholder}>{placeholder}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  placeholder: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  pressed: {
    opacity: 0.7,
  },
});
