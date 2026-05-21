import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText as Text } from '../ui/AppText';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing } from '../../constants/theme';

type ServiceCardProps = {
  title: string;
  category: string;
  price: number;
  rating: number;
  tutor: string;
};

export const ServiceCard = ({ title, category, price, rating, tutor }: ServiceCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>₱{price}</Text>
      </View>
      <Text style={styles.category}>{category} - {tutor}</Text>
      <View style={styles.ratingRow}>
        <Ionicons name="star" size={14} color={Colors.gold} />
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...(Shadow || {}),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  category: {
    marginTop: Spacing.xs,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  ratingRow: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ratingText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
