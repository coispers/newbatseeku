import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText as Text } from './AppText';

import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing } from '../../constants/theme';

type PaymentCardProps = {
  method: string;
  serviceFee: number;
  platformFee: number;
};

export const PaymentCard = ({ method, serviceFee, platformFee }: PaymentCardProps) => {
  const total = serviceFee + platformFee;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Payment</Text>
      <Text style={styles.method}>{method}</Text>
      <Text style={styles.notice}>Payment held until service is complete</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Service fee</Text>
        <Text style={styles.value}>₱{serviceFee}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>BatSeekU fee (10%)</Text>
        <Text style={styles.value}>₱{platformFee}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>₱{total}</Text>
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
    marginTop: Spacing.md,
    ...(Shadow || {}),
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  method: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  notice: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  row: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  value: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginTop: Spacing.sm,
  },
  totalLabel: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});
