import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText as Text } from '../components/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '../constants/colors';
import { Radius, Shadow, Spacing } from '../constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useOrders } from '../hooks/useOrders';

const currency = (v: number) => `₱${v}`;

const ReceiptScreen = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const { orders } = useOrders();

  const order = orderId ? orders.find((o) => o.id === orderId) : orders.find((o) => o.status === 'Finished');
  const serviceFee = order?.budget ?? 200;
  const platformFee = Math.round(serviceFee * 0.1);
  const total = serviceFee + platformFee;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Transaction Receipt</Text>

        <View style={styles.card}>
          <Text style={styles.rowLabel}>Receipt #</Text>
          <Text style={styles.rowValue}>{order ? order.id : 'BSU-2026-XXXX'}</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Date</Text>
            <Text style={styles.rowValue}>{order ? new Date(order.createdAt).toLocaleDateString() : 'May 21, 2026'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Student</Text>
            <Text style={styles.rowValue}>{order?.requesterName ?? 'Juan Dela Cruz'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Tutor</Text>
            <Text style={styles.rowValue}>{order?.freelancerName ?? 'Andrea Cruz'}</Text>
          </View>

          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Service fee</Text>
            <Text style={styles.rowValue}>{currency(serviceFee)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>BatSeekU fee</Text>
            <Text style={styles.rowValue}>{currency(platformFee)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{currency(total)}</Text>
          </View>

          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{order?.status ?? 'Completed'}</Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  card: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    ...(Shadow || {}),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  rowLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  rowValue: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  totalValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  statusPill: {
    marginTop: Spacing.md,
    backgroundColor: Colors.verifiedBg,
    borderRadius: Radius.full,
    paddingVertical: Spacing.xs,
    alignItems: 'center',
  },
  statusText: {
    color: Colors.verified,
    fontSize: 12,
    fontWeight: '600',
  },
  backButton: {
    marginTop: Spacing.lg,
    alignSelf: 'center',
  },
  backText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});

export default ReceiptScreen;
