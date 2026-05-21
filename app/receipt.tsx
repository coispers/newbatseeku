import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText as Text } from '../components/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Colors } from '../constants/colors';
import { Radius, Shadow, Spacing } from '../constants/theme';

const ReceiptScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Transaction Receipt</Text>

        <View style={styles.card}>
          <Text style={styles.rowLabel}>Receipt #</Text>
          <Text style={styles.rowValue}>BSU-2026-0412</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Date</Text>
            <Text style={styles.rowValue}>May 21, 2026</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Student</Text>
            <Text style={styles.rowValue}>Juan Dela Cruz</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Tutor</Text>
            <Text style={styles.rowValue}>Andrea Cruz</Text>
          </View>

          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Service fee</Text>
            <Text style={styles.rowValue}>₱200</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>BatSeekU fee</Text>
            <Text style={styles.rowValue}>₱15</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₱215</Text>
          </View>

          <View style={styles.statusPill}>
            <Text style={styles.statusText}>Completed</Text>
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
