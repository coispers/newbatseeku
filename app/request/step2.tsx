import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { AppText as Text } from '../../components/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/colors';
import { freelancers } from '../../constants/mock-data';
import { Radius, Shadow, Spacing } from '../../constants/theme';
import { Avatar } from '../../components/ui/Avatar';
import { PaymentCard } from '../../components/ui/PaymentCard';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';

const payments = ['GCash', 'Cash', 'Wallet'];

const Step2Screen = () => {
  const router = useRouter();
  const { freelancerId, category, urgency, details } = useLocalSearchParams<{
    freelancerId?: string;
    category?: string;
    urgency?: string;
    details?: string;
  }>();
  const { user } = useAuth();
  const { createServiceOrder } = useOrders();
  const [method, setMethod] = useState('GCash');

  const selectedTutor = freelancerId
    ? freelancers.find((item) => item.id === freelancerId)
    : undefined;

  const estimate = useMemo(() => {
    return 200;
  }, []);

  const platformFee = Math.round(estimate * 0.1);

  const categoryLabel = Array.isArray(category) ? category[0] : category;
  const detailsValue = Array.isArray(details) ? details[0] : details;
  const urgencyValue = Array.isArray(urgency) ? urgency[0] : urgency;

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

        <Text style={styles.progress}>Step 2 of 4</Text>
        <Text style={styles.title}>Confirm details</Text>

        <View style={styles.estimateCard}>
          <Text style={styles.estimateLabel}>Estimated price</Text>
          <Text style={styles.estimateValue}>₱{estimate}</Text>
        </View>

        {selectedTutor ? (
          <View>
            <Text style={styles.sectionTitle}>Selected tutor</Text>
            <View style={styles.selectedTutorCard}>
              <Avatar initials={selectedTutor.avatar} size={44} />
              <View style={styles.selectedTutorInfo}>
                <Text style={styles.selectedTutorName}>{selectedTutor.name}</Text>
                <Text style={styles.selectedTutorMeta}>{selectedTutor.expertise[0]}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.sectionTitle}>Suggested tutors</Text>
            <FlatList
              data={freelancers.slice(0, 3)}
              horizontal
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.tutorCard}>
                  <Avatar initials={item.avatar} size={44} />
                  <Text style={styles.tutorName}>{item.name}</Text>
                  <Text style={styles.tutorMeta}>{item.expertise[0]}</Text>
                </View>
              )}
            />
          </View>
        )}

        <Text style={styles.sectionTitle}>Payment method</Text>
        <FlatList
          data={payments}
          horizontal
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.paymentRow}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={item}
              onPress={() => setMethod(item)}
              style={({ pressed }) => [
                styles.paymentPill,
                method === item && styles.paymentSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.paymentText, method === item && styles.paymentTextSelected]}>{item}</Text>
            </Pressable>
          )}
        />

        <PaymentCard method={method} serviceFee={estimate} platformFee={platformFee} />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={selectedTutor ? 'Send request' : 'Confirm and find tutor'}
          onPress={async () => {
            if (!user) {
              return;
            }

            const order = await createServiceOrder({
              title: detailsValue?.trim() || `${categoryLabel ?? 'Service'} help request`,
              details: detailsValue?.trim() || `Need help with ${categoryLabel ?? 'service'}.`,
              category: categoryLabel ?? 'Tutoring',
              budget: estimate,
              location: 'BatStateU',
              urgency: urgencyValue,
              paymentMethod: method,
              requesterId: user.id,
              requesterName: user.name,
              requesterAvatar: user.name
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase(),
              freelancerId: freelancerId ?? undefined,
              freelancerName: selectedTutor?.name,
              freelancerAvatar: selectedTutor?.avatar,
            });

            router.push({
              pathname: '/request/step3',
              params: {
                ...(freelancerId ? { freelancerId } : {}),
                orderId: order.id,
              },
            });
          }}
          style={({ pressed }) => [styles.confirmButton, pressed && styles.pressed]}
        >
          <Text style={styles.confirmText}>
            {selectedTutor ? 'Send Request' : 'Confirm & Find Tutor'}
          </Text>
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
  progress: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  backText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
  },
  estimateCard: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    ...(Shadow || {}),
  },
  estimateLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  estimateValue: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    marginTop: Spacing.lg,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  tutorCard: {
    marginTop: Spacing.md,
    marginRight: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    alignItems: 'center',
    ...(Shadow || {}),
  },
  selectedTutorCard: {
    marginTop: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    ...(Shadow || {}),
  },
  selectedTutorInfo: {
    flex: 1,
  },
  selectedTutorName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  selectedTutorMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  tutorName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
  tutorMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  paymentRow: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    alignItems: 'center',
  },
  paymentPill: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    minWidth: 88,
    alignItems: 'center',
  },
  paymentSelected: {
    backgroundColor: Colors.primary,
  },
  paymentText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  paymentTextSelected: {
    color: Colors.white,
  },
  confirmButton: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  confirmText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});

export default Step2Screen;
