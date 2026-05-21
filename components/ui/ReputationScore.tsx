import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText as Text } from './AppText';

import { Colors } from '../../constants/colors';
import { Radius, Spacing } from '../../constants/theme';

type ReputationScoreProps = {
  score: number;
  compact?: boolean;
};

const scoreColor = (score: number) => {
  if (score >= 80) {
    return Colors.verified;
  }
  if (score >= 60) {
    return Colors.gold;
  }
  return Colors.primary;
};

export const ReputationScore = ({ score, compact = false }: ReputationScoreProps) => {
  const color = scoreColor(score);
  return (
    <View style={[styles.container, compact && styles.compactContainer, { borderColor: color }]}>
      <Text style={[styles.score, compact && styles.compactScore, { color }]}>{score}</Text>
      {!compact && <Text style={styles.label}>Campus Reputation</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
  },
  compactContainer: {
    width: '100%',
    backgroundColor: Colors.white,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  score: {
    fontSize: 22,
    fontWeight: '600',
  },
  compactScore: {
    fontSize: 12,
  },
  label: {
    marginTop: Spacing.xs,
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
