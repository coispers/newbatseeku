import React from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { AppText as Text } from './AppText';

import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../../constants/theme';

type ButtonVariant = 'primary' | 'ghost' | 'outline';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  style,
  accessibilityLabel,
}: ButtonProps) => {
  const { Colors } = useTheme();

  const dynamicStyles = {
    primary: {
      backgroundColor: Colors.primary,
    },
    ghost: {
      backgroundColor: Colors.surfaceAlt,
    },
    outline: {
      backgroundColor: Colors.white,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    primaryText: {
      color: Colors.white,
    },
    ghostText: {
      color: Colors.textPrimary,
    },
    outlineText: {
      color: Colors.textPrimary,
    },
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        dynamicStyles[variant],
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, dynamicStyles[`${variant}Text`]]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

