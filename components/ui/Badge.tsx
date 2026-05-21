import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { AppText as Text } from './AppText';

import { Colors } from '../../constants/colors';
import { Radius, Spacing } from '../../constants/theme';

type BadgeProps = {
  label: string;
  style?: StyleProp<ViewStyle>;
};

export const Badge = ({ label, style }: BadgeProps) => {
  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    alignSelf: 'flex-start',
  },
  text: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
});
