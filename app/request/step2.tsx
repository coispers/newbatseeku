import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { AppText as Text } from '../../components/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { Colors } from '../../constants/colors';
import { freelancers } from '../../constants/mock-data';
import { Radius, Shadow, Spacing } from '../../constants/theme';
import { Avatar } from '../../components/ui/Avatar';
import { PaymentCard } from '../../components/ui/PaymentCard';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

const payments = ['GCash', 'Cash', 'Wallet'];

const Step2Screen = () => {
  const router = useRouter();
  const { freelancerId, category, urgency, details, duration } = useLocalSearchParams<{
    freelancerId?: string;
    category?: string;
    urgency?: string;
    details?: string;
    duration?: string;
  }>();
  const { user } = useAuth();
  const [method, setMethod] = useState('GCash');
  const [estimateInput, setEstimateInput] = useState('200');

  const selectedTutor = freelancerId
    ? freelancers.find((item) => item.id === freelancerId)
    : undefined;

  const estimate = useMemo(() => {
    const value = Number(estimateInput.replace(/[^0-9.]/g, ''));
    return Number.isFinite(value) ? Math.max(0, value) : 0;
  }, [estimateInput]);

  const platformFee = Math.round(estimate * 0.1);

  const categoryLabel = Array.isArray(category) ? category[0] : category;
  const detailsValue = Array.isArray(details) ? details[0] : details;
  const urgencyValue = Array.isArray(urgency) ? urgency[0] : urgency;
  const durationValue = Array.isArray(duration) ? duration[0] : duration;

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

        <TextInput
          value={estimateInput}
          onChangeText={setEstimateInput}
          placeholder="Enter estimated price"
          placeholderTextColor={Colors.textMuted}
          keyboardType="numeric"
          style={styles.estimateInput}
        />

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
        ) : null}

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
          accessibilityLabel="Post errand"
          onPress={async () => {
            if (!user) {
              Toast.show({ type: 'error', text1: 'Please log in to post an errand.' });
              return;
            }

            const { error } = await supabase.from('errands').insert({
              requester_id: user.id,
              requester_name: user.name,
              category: categoryLabel ?? 'Tutoring',
              description: detailsValue?.trim() || `Need help with ${categoryLabel ?? 'service'}.`,
              urgency: urgencyValue ?? 'Normal',
              duration: durationValue ?? '2 hours',
              budget: estimate,
              payment_method: method,
              status: 'open',
              freelancer_id: freelancerId ?? null,
            });

            if (error) {
              console.error('Errand insert failed:', error);
              return;
            }

            Toast.show({ type: 'success', text1: 'Errand posted.' });
            router.replace('/(tabs)/errands');
          }}
          style={({ pressed }) => [styles.confirmButton, pressed && styles.pressed]}
        >
          <Text style={styles.confirmText}>Post Errand</Text>
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
  estimateInput: {
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    color: Colors.textPrimary,
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
