import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { AppText as Text } from '../../components/ui/AppText';
import { Avatar } from '../../components/ui/Avatar';
import { Radius, Shadow, Spacing } from '../../constants/theme';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';

const timeline = [
  { key: 'Requests', label: 'Posted', description: 'Customer request submitted' },
  { key: 'Ongoing', label: 'In progress', description: 'A freelancer is working on it' },
  { key: 'Finished', label: 'Completed', description: 'Order delivered and closed' },
] as const;

const OrderProgressScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { getOrderById, acceptOrder, completeOrder } = useOrders();

  const order = id ? getOrderById(id) : undefined;

  if (!order) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Order not found</Text>
          <Text style={styles.emptyText}>This request may have been removed or is still syncing.</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.primaryButtonText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const isFreelancer = user?.role === 'freelancer';
  const isAssignedToMe = order.freelancerId ? order.freelancerId === user?.id : false;

  const progressIndex = timeline.findIndex((item) => item.key === order.status);

  const handlePrimaryAction = async () => {
    if (isFreelancer && order.status === 'Requests' && user) {
      await acceptOrder(order.id, user.id);
      return;
    }

    if (isFreelancer && order.status === 'Ongoing' && isAssignedToMe) {
      await completeOrder(order.id);
    }
  };

  const primaryActionLabel =
    isFreelancer && order.status === 'Requests'
      ? 'Accept order'
      : isFreelancer && order.status === 'Ongoing' && isAssignedToMe
        ? 'Mark complete'
        : 'Go back';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Ionicons name="chevron-back" size={18} color={Colors.textPrimary} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.title}>Order progress</Text>
        <Text style={styles.subtitle}>Both customers and freelancers can track the same order here.</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={styles.summaryLeft}>
              <Text style={styles.orderTitle}>{order.title}</Text>
              <Text style={styles.orderMeta}>{order.category} • ₱{order.budget}</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
          </View>

          <Text style={styles.detailText}>{order.details}</Text>

          <View style={styles.peopleRow}>
            <View style={styles.personBlock}>
              <Text style={styles.personLabel}>Customer</Text>
              <Text style={styles.personName}>{order.requesterName}</Text>
            </View>
            <View style={styles.personBlock}>
              <Text style={styles.personLabel}>Freelancer</Text>
              <Text style={styles.personName}>{order.freelancerName ?? 'Not assigned yet'}</Text>
            </View>
          </View>

          <View style={styles.assigneeRow}>
            <Avatar initials={order.freelancerAvatar ?? '??'} size={44} />
            <View style={styles.assigneeInfo}>
              <Text style={styles.assigneeLabel}>Current assignee</Text>
              <Text style={styles.assigneeName}>{order.freelancerName ?? 'Waiting for a match'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.timelineCard}>
          {timeline.map((item, index) => {
            const isDone = index <= progressIndex;
            return (
              <View key={item.key} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.dot, { backgroundColor: isDone ? Colors.primary : Colors.border }]} />
                  {index < timeline.length - 1 && <View style={styles.line} />}
                </View>
                <View style={styles.timelineBody}>
                  <Text style={styles.timelineTitle}>{item.label}</Text>
                  <Text style={styles.timelineDescription}>{item.description}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.actionsRow}>
          {isFreelancer && (order.status === 'Requests' || (order.status === 'Ongoing' && isAssignedToMe)) ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={primaryActionLabel}
              onPress={handlePrimaryAction}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            >
              <Text style={styles.primaryButtonText}>{primaryActionLabel}</Text>
            </Pressable>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={() => router.back()}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
            >
              <Text style={styles.secondaryButtonText}>Close</Text>
            </Pressable>
          )}
        </View>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  summaryCard: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    ...(Shadow || {}),
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  summaryLeft: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  orderMeta: {
    marginTop: Spacing.xs,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  detailText: {
    marginTop: Spacing.md,
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 19,
  },
  peopleRow: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  personBlock: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.sm,
  },
  personLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  personName: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  assigneeRow: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  assigneeInfo: {
    flex: 1,
  },
  assigneeLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  assigneeName: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  timelineCard: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    ...(Shadow || {}),
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineLeft: {
    width: 18,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginTop: 4,
  },
  timelineBody: {
    flex: 1,
    paddingBottom: Spacing.md,
    paddingLeft: Spacing.sm,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  timelineDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  actionsRow: {
    marginTop: Spacing.lg,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  emptyText: {
    marginTop: Spacing.xs,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});

export default OrderProgressScreen;