import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { AppText as Text } from '../../components/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Colors } from '../../constants/colors';
import { freelancers } from '../../constants/mock-data';
import { Radius, Shadow, Spacing } from '../../constants/theme';
import { Avatar } from '../../components/ui/Avatar';
import { PaymentCard } from '../../components/ui/PaymentCard';

const payments = ['GCash', 'Cash', 'Wallet'];

const Step2Screen = () => {
  const router = useRouter();
  const [method, setMethod] = useState('GCash');

  const estimate = useMemo(() => {
    return 200;
  }, []);

  const platformFee = 15;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.progress}>Step 2 of 4</Text>
        <Text style={styles.title}>Confirm details</Text>

        <View style={styles.estimateCard}>
          <Text style={styles.estimateLabel}>Estimated price</Text>
          <Text style={styles.estimateValue}>₱{estimate}</Text>
        </View>

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
          accessibilityLabel="Confirm and find tutor"
          onPress={() => router.push('/request/step3')}
          style={({ pressed }) => [styles.confirmButton, pressed && styles.pressed]}
        >
          <Text style={styles.confirmText}>Confirm & Find Tutor</Text>
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
  },
  paymentPill: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
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
