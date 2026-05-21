import React from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText as Text } from '../../components/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Colors } from '../../constants/colors';
import { freelancers, reviews } from '../../constants/mock-data';
import { Radius, Shadow, Spacing } from '../../constants/theme';
import { Avatar } from '../../components/ui/Avatar';
import { TrustBadge } from '../../components/ui/TrustBadge';
import { ReputationScore } from '../../components/ui/ReputationScore';

const FreelancerProfileScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const freelancer = freelancers.find((item) => item.id === id) || freelancers[0];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Ionicons name="chevron-back" size={20} color={Colors.textPrimary} />
        </Pressable>

        <View style={styles.hero}>
          <Avatar initials={freelancer.avatar} size={80} />
          <Text style={styles.name}>{freelancer.name}</Text>
          <Text style={styles.course}>{freelancer.course} - Batangas State University</Text>
          <View style={styles.heroRow}>
            <TrustBadge type={freelancer.isVerified ? 'verified' : 'reliable'} />
            <View style={styles.reputationPill}>
              <Text style={styles.reputationText}>{freelancer.reputationLabel}</Text>
            </View>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#1A5C38" />
              <Text style={styles.ratingText}>{freelancer.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{freelancer.completedJobs}</Text>
            <Text style={styles.statLabel}>Completed Jobs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{freelancer.responseRate}</Text>
            <Text style={styles.statLabel}>Response Rate</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{freelancer.memberSince}</Text>
            <Text style={styles.statLabel}>Member Since</Text>
          </View>
        </View>

        <View style={styles.reputationRow}>
          <ReputationScore score={92} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionText}>{freelancer.bio}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expertise</Text>
          <FlatList
            data={freelancer.expertise}
            keyExtractor={(item) => item}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.tagRow}
            renderItem={({ item }) => (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{item}</Text>
              </View>
            )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portfolio</Text>
          <FlatList
            data={[1, 2, 3]}
            horizontal
            keyExtractor={(item) => String(item)}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.portfolioCard}>
                <Text style={styles.portfolioText}>Sample {item}</Text>
              </View>
            )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Avatar initials={item.avatar} size={36} />
                  <View style={styles.reviewInfo}>
                    <Text style={styles.reviewName}>{item.name}</Text>
                    <Text style={styles.reviewDate}>{item.date}</Text>
                  </View>
                  <View style={styles.reviewRatingRow}>
                    <Ionicons name="star" size={12} color="#1A5C38" />
                    <Text style={styles.reviewRating}>{item.rating}</Text>
                  </View>
                </View>
                <Text style={styles.reviewText}>{item.comment}</Text>
              </View>
            )}
          />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Text style={styles.priceLabel}>From ₱{freelancer.price}/session</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Request service"
          onPress={() => router.push('/request/step1')}
          style={({ pressed }) => [styles.requestButton, pressed && styles.pressed]}
        >
          <Text style={styles.requestText}>Request Service</Text>
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
    padding: Spacing.lg,
    paddingBottom: 120,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  course: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  reputationPill: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  reputationText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ratingText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  reputationRow: {
    marginTop: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    alignItems: 'center',
    ...(Shadow || {}),
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  sectionText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  tagRow: {
    gap: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
    marginRight: Spacing.sm,
  },
  tagText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  portfolioCard: {
    width: 140,
    height: 100,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  portfolioText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  reviewCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...(Shadow || {}),
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  reviewDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  reviewRating: {
    fontSize: 12,
    color: Colors.forest,
    fontWeight: '600',
  },
  reviewRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  reviewText: {
    marginTop: Spacing.sm,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  bottomBar: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    bottom: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...(Shadow || {}),
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  requestButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  requestText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 13,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default FreelancerProfileScreen;
