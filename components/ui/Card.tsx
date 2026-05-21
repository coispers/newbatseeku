import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing } from '../../constants/theme';

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const Card = ({ children, style }: CardProps) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    ...(Shadow || {}),
  },
});
