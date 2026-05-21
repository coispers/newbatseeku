import React from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText as Text } from '../../components/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '../../constants/colors';
import { adminStats } from '../../constants/mock-data';
import { Radius, Shadow, Spacing } from '../../constants/theme';
import { Avatar } from '../../components/ui/Avatar';

const pending = [
  { id: 'p1', name: 'Samantha Lee', email: 'samlee@g.batstate-u.edu.ph', avatar: 'SL' },
  { id: 'p2', name: 'John Mateo', email: 'jmateo@g.batstate-u.edu.ph', avatar: 'JM' },
];

const flagged = [
  { id: 'f1', name: 'Placeholder Account', reason: 'Report pending', avatar: 'PA' },
];

const transactions = [
  { id: 't1', user: 'Andrea Cruz', type: 'Tutor payout', amount: '₱350', status: 'Completed' },
  { id: 't2', user: 'Juan Dela Cruz', type: 'Service fee', amount: '₱200', status: 'Pending' },
];

const AdminScreen = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Admin Panel - BatSeekU</Text>

        <FlatList
          data={adminStats}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.metricsGrid}
          renderItem={({ item }) => (
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{item.value}</Text>
              <Text style={styles.metricLabel}>{item.label}</Text>
            </View>
          )}
        />

        <Text style={styles.sectionTitle}>Pending verifications</Text>
        <FlatList
          data={pending}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.listRow}>
              <Avatar initials={item.avatar} size={40} />
              <View style={styles.listInfo}>
                <Text style={styles.listName}>{item.name}</Text>
                <Text style={styles.listMeta}>{item.email}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Verify"
                onPress={() => {}}
                style={({ pressed }) => [styles.verifyButton, pressed && styles.pressed]}
              >
                <Text style={styles.verifyText}>Verify</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Reject"
                onPress={() => {}}
                style={({ pressed }) => [styles.rejectButton, pressed && styles.pressed]}
              >
                <Text style={styles.rejectText}>Reject</Text>
              </Pressable>
            </View>
          )}
        />

        <Text style={styles.sectionTitle}>Flagged accounts</Text>
        <FlatList
          data={flagged}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.listRow}>
              <Avatar initials={item.avatar} size={40} />
              <View style={styles.listInfo}>
                <Text style={styles.listName}>{item.name}</Text>
                <Text style={styles.listMeta}>{item.reason}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Review"
                onPress={() => {}}
                style={({ pressed }) => [styles.verifyButton, pressed && styles.pressed]}
              >
                <Text style={styles.verifyText}>Review</Text>
              </Pressable>
            </View>
          )}
        />

        <Text style={styles.sectionTitle}>Recent transactions</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.transactionRow}>
              <View>
                <Text style={styles.listName}>{item.user}</Text>
                <Text style={styles.listMeta}>{item.type}</Text>
              </View>
              <View style={styles.transactionRight}>
                <Text style={styles.transactionAmount}>{item.amount}</Text>
                <Text style={styles.transactionStatus}>{item.status}</Text>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  metricsGrid: {
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
  },
  metricCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    ...(Shadow || {}),
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    marginTop: Spacing.lg,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    ...(Shadow || {}),
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  listMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  verifyButton: {
    backgroundColor: Colors.verifiedBg,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  verifyText: {
    color: Colors.verified,
    fontSize: 12,
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  rejectText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    ...(Shadow || {}),
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  transactionStatus: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default AdminScreen;
