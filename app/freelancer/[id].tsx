import React, { useEffect, useMemo, useState } from 'react';
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
import { supabase } from '../../lib/supabase';

type RemoteFreelancerProfile = {
  id: string;
  full_name: string;
  avatar: string | null;
  course: string | null;
  university: string | null;
  is_verified: boolean | null;
  is_top_tutor: boolean | null;
  rating: number | null;
  completed_jobs: number | null;
  response_rate: number | null;
  member_since: number | null;
  campus_reputation: number | null;
  about: string | null;
  expertise: string[] | string | null;
  base_price: number | null;
};

const FreelancerProfileScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [remoteFreelancer, setRemoteFreelancer] = useState<RemoteFreelancerProfile | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    let isActive = true;

    const loadFreelancer = async () => {
      const { data, error } = await supabase
        .from('freelancer_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (!isActive) return;

      if (error) {
        setRemoteFreelancer(null);
        return;
      }

      setRemoteFreelancer(data as RemoteFreelancerProfile);
    };

    loadFreelancer();

    return () => {
      isActive = false;
    };
  }, [id]);

  const fallbackFreelancer = freelancers.find((item) => item.id === id) || freelancers[0];

  const parseExpertise = (value: RemoteFreelancerProfile['expertise']) => {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        return [value];
      }
    }

    return [];
  };

  const freelancerView = useMemo(() => {
    if (!remoteFreelancer) {
      return {
        id: fallbackFreelancer.id,
        avatar: fallbackFreelancer.avatar,
        name: fallbackFreelancer.name,
        course: fallbackFreelancer.course,
        university: 'Batangas State University',
        isVerified: fallbackFreelancer.isVerified,
        reputationLabel: fallbackFreelancer.reputationLabel,
        rating: fallbackFreelancer.rating,
        completedJobs: fallbackFreelancer.completedJobs,
        responseRate: fallbackFreelancer.responseRate,
        memberSince: fallbackFreelancer.memberSince,
        campusReputation: 92,
        bio: fallbackFreelancer.bio,
        expertise: fallbackFreelancer.expertise,
        price: fallbackFreelancer.price,
      };
    }

    return {
      id: remoteFreelancer.id,
      avatar: remoteFreelancer.avatar ?? '??',
      name: remoteFreelancer.full_name,
      course: remoteFreelancer.course ?? 'BS Computer Science',
      university: remoteFreelancer.university ?? 'Batangas State University',
      isVerified: !!remoteFreelancer.is_verified,
      reputationLabel: remoteFreelancer.is_top_tutor ? 'Top Tutor' : 'Reliable',
      rating: remoteFreelancer.rating ?? 4.9,
      completedJobs: remoteFreelancer.completed_jobs ?? 0,
      responseRate: `${remoteFreelancer.response_rate ?? 0}%`,
      memberSince: remoteFreelancer.member_since ?? 2026,
      campusReputation: remoteFreelancer.campus_reputation ?? 0,
      bio: remoteFreelancer.about ?? 'No bio provided yet.',
      expertise: parseExpertise(remoteFreelancer.expertise),
      price: remoteFreelancer.base_price ?? 0,
    };
  }, [fallbackFreelancer, remoteFreelancer]);

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
          <Avatar initials={freelancerView.avatar} size={80} />
          <Text style={styles.name}>{freelancerView.name}</Text>
          <Text style={styles.course}>{freelancerView.course} - {freelancerView.university}</Text>
          <View style={styles.heroRow}>
            <TrustBadge type={freelancerView.isVerified ? 'verified' : 'reliable'} />
            <View style={styles.reputationPill}>
              <Text style={styles.reputationText}>{freelancerView.reputationLabel}</Text>
            </View>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#1A5C38" />
              <Text style={styles.ratingText}>{freelancerView.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{freelancerView.completedJobs}</Text>
            <Text style={styles.statLabel}>Completed Jobs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{freelancerView.responseRate}</Text>
            <Text style={styles.statLabel}>Response Rate</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{freelancerView.memberSince}</Text>
            <Text style={styles.statLabel}>Member Since</Text>
          </View>
        </View>

        <View style={styles.reputationRow}>
          <ReputationScore score={freelancerView.campusReputation} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionText}>{freelancerView.bio}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expertise</Text>
          <FlatList
            data={freelancerView.expertise}
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
        <Text style={styles.priceLabel}>From ₱{freelancerView.price}/session</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Request service"
          onPress={() => router.push({ pathname: '/request/step1', params: { freelancerId: freelancerView.id } })}
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
