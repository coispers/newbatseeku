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
    background: Colors.verifiedBg,
    color: Colors.verified,
  },
  'top-tutor': {
    label: 'Top Tutor',
    icon: 'star-circle',
    background: Colors.goldBg,
    color: Colors.gold,
  },
  trusted: {
    label: 'Trusted',
    icon: 'shield-check',
    background: Colors.surfaceAlt,
    color: Colors.textSecondary,
  },
  reliable: {
    label: 'Reliable',
    icon: 'check-circle',
    background: Colors.surfaceAlt,
    color: Colors.textSecondary,
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
