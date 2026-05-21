import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText as Text } from '../ui/AppText';

import { useTheme } from '../../hooks/useTheme';
import { Radius, Shadow, Spacing } from '../../constants/theme';

type ErrandCardProps = {
  title: string;
  budget: number;
  location: string;
  timeAgo: string;
  actionLabel?: string;
  onAccept: () => void;
};

export const ErrandCard = ({ title, budget, location, timeAgo, actionLabel = 'Accept', onAccept }: ErrandCardProps) => {
  const { Colors } = useTheme();

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.meta}>{location} - {timeAgo}</Text>
        </View>
        <Text style={styles.budget}>₱{budget}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Accept errand"
        onPress={onAccept}
        style={({ pressed }) => [
          styles.accept,
          { backgroundColor: Colors.primary },
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.acceptText}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...(Shadow || {}),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  meta: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: Spacing.xs,
  },
  budget: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  accept: {
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
  },
  acceptText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});

