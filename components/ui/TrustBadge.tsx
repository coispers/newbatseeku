import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText as Text } from './AppText';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '../../constants/colors';
import { Radius, Spacing } from '../../constants/theme';

type TrustBadgeType = 'verified' | 'top-tutor' | 'trusted' | 'reliable';

type TrustBadgeProps = {
  type: TrustBadgeType;
};

const config: Record<TrustBadgeType, {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  background: string;
  color: string;
}> = {
  verified: {
    label: 'Verified Student',
    icon: 'check-decagram',
    background: '#DCFCE7',
    color: '#14532D',
  },
  'top-tutor': {
    label: 'Top Tutor',
    icon: 'star-circle',
    background: '#DCFCE7',
    color: '#14532D',
  },
  trusted: {
    label: 'Trusted',
    icon: 'shield-check',
    background: '#DCFCE7',
    color: '#14532D',
  },
  reliable: {
    label: 'Reliable',
    icon: 'check-circle',
    background: '#DCFCE7',
    color: '#14532D',
  },
};

export const TrustBadge = ({ type }: TrustBadgeProps) => {
  const badge = config[type];
  return (
    <View style={[styles.container, { backgroundColor: badge.background }]}
    >
      <MaterialCommunityIcons name={badge.icon} size={14} color={badge.color} />
      <Text style={[styles.text, { color: badge.color }]}>{badge.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
