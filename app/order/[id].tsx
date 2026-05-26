import React, { useEffect, useMemo, useState } from 'react';
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
import { supabase } from '../../lib/supabase';

const timeline = [
  { key: 'Requests', label: 'Posted', description: 'Customer request submitted' },
  { key: 'Ongoing', label: 'In progress', description: 'A freelancer is working on it' },
  { key: 'Finished', label: 'Completed', description: 'Order delivered and closed' },
] as const;

type RemoteErrand = {
  id: string;
  requester_id: string;
  requester_name: string;
  category: string | null;
  description: string | null;
  urgency: string | null;
  duration: string | null;
  budget: number | null;
  payment_method: string | null;
  status: string | null;
  freelancer_id: string | null;
  freelancer_completed: boolean | null;
  requester_completed: boolean | null;
  created_at: string | null;
};

type FreelancerProfile = {
  id: string;
  full_name: string;
  avatar: string | null;
  course: string | null;
  rating: number | null;
};

type ErrandApplication = {
  id: string;
  errand_id: string;
  freelancer_id: string;
  applied_at: string | null;
  freelancerProfile?: FreelancerProfile;
};

const OrderProgressScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { getOrderById, acceptOrder, completeOrder } = useOrders();

  const order = id ? getOrderById(id) : undefined;
  const [errand, setErrand] = useState<RemoteErrand | null>(null);
  const [errandLoading, setErrandLoading] = useState(false);
  const [applications, setApplications] = useState<ErrandApplication[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [assignedFreelancer, setAssignedFreelancer] = useState<FreelancerProfile | null>(null);

  useEffect(() => {
    if (!id || order) {
      return;
    }

    let isActive = true;
    const loadErrand = async () => {
      setErrandLoading(true);
      const { data, error } = await supabase
        .from('errands')
        .select('*')
        .eq('id', id)
        .single();

      if (!isActive) return;

      if (error) {
        console.error('Failed to load errand:', error);
        setErrand(null);
      } else {
        setErrand(data as RemoteErrand);
      }

      setErrandLoading(false);
    };

    loadErrand();

    return () => {
      isActive = false;
    };
  }, [id, order]);

  useEffect(() => {
    if (!errand) {
      setApplications([]);
      return;
    }

    let isActive = true;

    const loadApplications = async () => {
      setApplicationsLoading(true);
      const { data, error } = await supabase
        .from('errand_applications')
        .select('id, errand_id, freelancer_id, applied_at')
        .eq('errand_id', errand.id)
        .order('applied_at', { ascending: false });

      if (!isActive) return;

      if (error) {
        console.error('Failed to load errand applications:', error);
        setApplications([]);
        setApplicationsLoading(false);
        return;
      }

      const rows = (data ?? []) as ErrandApplication[];
      const freelancerIds = Array.from(new Set(rows.map((row) => row.freelancer_id)));

      if (freelancerIds.length === 0) {
        setApplications(rows);
        setApplicationsLoading(false);
        return;
      }

      const { data: profiles, error: profileError } = await supabase
        .from('freelancer_profiles')
        .select('id, full_name, avatar, course, rating')
        .in('id', freelancerIds);

      if (!isActive) return;

      if (profileError) {
        console.error('Failed to load freelancer profiles:', profileError);
        setApplications(rows);
        setApplicationsLoading(false);
        return;
      }

      const profileMap = new Map(
        (profiles ?? []).map((profile) => [profile.id, profile as FreelancerProfile])
      );

      setApplications(
        rows.map((row) => ({
          ...row,
          freelancerProfile: profileMap.get(row.freelancer_id),
        }))
      );
      setApplicationsLoading(false);
    };

    loadApplications();

    return () => {
      isActive = false;
    };
  }, [errand]);

  useEffect(() => {
    if (!errand?.freelancer_id) {
      setAssignedFreelancer(null);
      return;
    }

    let isActive = true;

    const loadAssignedFreelancer = async () => {
      const { data, error } = await supabase
        .from('freelancer_profiles')
        .select('id, full_name, avatar, course, rating')
        .eq('id', errand.freelancer_id)
        .single();

      if (!isActive) return;

      if (error) {
        console.error('Failed to load assigned freelancer:', error);
        setAssignedFreelancer(null);
        return;
      }

      setAssignedFreelancer(data as FreelancerProfile);
    };

    loadAssignedFreelancer();

    return () => {
      isActive = false;
    };
  }, [errand?.freelancer_id]);

  const errandStatusKey = useMemo(() => {
    if (!errand) return null;
    if (errand.status === 'completed') return 'Finished';
    if (errand.status === 'in_progress') return 'Ongoing';
    return 'Requests';
  }, [errand]);

  const errandStatusLabel = useMemo(() => {
    if (!errand) return null;
    if (errand.status === 'completed') return 'Completed';
    if (errand.status === 'in_progress') return 'In progress';
    return 'Open';
  }, [errand]);

  const errandFreelancerLabel = errand?.freelancer_id
    ? assignedFreelancer?.full_name ?? 'Assigned'
    : 'None';

  if (!order && errandLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Loading request...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order && !errand) {
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
  const isAssignedToMe = order?.freelancerId ? order.freelancerId === user?.id : false;
  const hasApplied = !!applications.find((entry) => entry.freelancer_id === user?.id);
  const isErrandRequester = errand?.requester_id === user?.id;
  const isErrandAssignee = errand?.freelancer_id === user?.id;
  const freelancerCompleted = !!errand?.freelancer_completed;
  const requesterCompleted = !!errand?.requester_completed;

  const progressIndex = timeline.findIndex((item) => item.key === (order?.status ?? errandStatusKey));

  const handlePrimaryAction = async () => {
    if (!order) {
      return;
    }

    if (isFreelancer && order.status === 'Requests' && user) {
      await acceptOrder(order.id, user.id);
      return;
    }

    if (isFreelancer && order.status === 'Ongoing' && isAssignedToMe) {
      await completeOrder(order.id);
    }
  };

  const primaryActionLabel =
    order && isFreelancer && order.status === 'Requests'
      ? 'Accept order'
      : order && isFreelancer && order.status === 'Ongoing' && isAssignedToMe
        ? 'Mark complete'
        : 'Go back';

  const handleErrandApply = async () => {
    if (!errand || !user) {
      return;
    }

    if (hasApplied) {
      return;
    }

    const { data: profileRow, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Failed to load user profile:', profileError);
      return;
    }

    if (!profileRow) {
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({ id: user.id, full_name: user.name, role: user.role }, { onConflict: 'id' });

      if (upsertError) {
        console.error('Failed to create user profile:', upsertError);
        return;
      }
    }

    const { error } = await supabase
      .from('errand_applications')
      .insert({ errand_id: errand.id, freelancer_id: user.id });

    if (error) {
      console.error('Failed to apply for errand:', error);
      return;
    }

    setApplications((current) => [
      {
        id: `local-${Date.now()}`,
        errand_id: errand.id,
        freelancer_id: user.id,
        applied_at: new Date().toISOString(),
      },
      ...current,
    ]);
  };

  const openFreelancerProfile = (freelancerId: string) => {
    router.push(`/freelancer/${freelancerId}`);
  };

  const handleAcceptFreelancer = async (application: ErrandApplication) => {
    if (!errand) {
      return;
    }

    const { data, error } = await supabase
      .from('errands')
      .update({ status: 'in_progress', freelancer_id: application.freelancer_id })
      .eq('id', errand.id)
      .select('*')
      .single();

    if (error) {
      console.error('Failed to assign freelancer:', error);
      return;
    }

    setErrand(data as RemoteErrand);
    setAssignedFreelancer(application.freelancerProfile ?? null);
  };

  const handleErrandComplete = async (field: 'freelancer_completed' | 'requester_completed') => {
    if (!errand) {
      return;
    }

    const { data, error } = await supabase
      .from('errands')
      .update({ [field]: true })
      .eq('id', errand.id)
      .select('*')
      .single();

    if (error) {
      console.error('Failed to update errand completion:', error);
      return;
    }

    setErrand(data as RemoteErrand);
  };

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
              <Text style={styles.orderTitle}>
                {order?.title ?? `${errand?.category ?? 'Errand'} request`}
              </Text>
              <Text style={styles.orderMeta}>
                {order?.category ?? errand?.category ?? 'Errand'} • ₱{order?.budget ?? errand?.budget ?? 0}
              </Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>{order?.status ?? errandStatusLabel ?? 'Open'}</Text>
            </View>
          </View>

          <Text style={styles.detailText}>
            {order?.details ?? errand?.description ?? 'No description provided.'}
          </Text>

          <View style={styles.peopleRow}>
            <View style={styles.personBlock}>
              <Text style={styles.personLabel}>Customer</Text>
              <Text style={styles.personName}>{order?.requesterName ?? errand?.requester_name ?? 'Unknown'}</Text>
            </View>
            <View style={styles.personBlock}>
              <Text style={styles.personLabel}>Freelancer</Text>
              <Text style={styles.personName}>
                {order?.freelancerName ?? (errand ? errandFreelancerLabel : 'Not assigned yet')}
              </Text>
            </View>
          </View>

          <View style={styles.assigneeRow}>
            <Avatar initials={order?.freelancerAvatar ?? assignedFreelancer?.avatar ?? '??'} size={44} />
            <View style={styles.assigneeInfo}>
              <Text style={styles.assigneeLabel}>Current assignee</Text>
              <Text style={styles.assigneeName}>
                {order?.freelancerName ?? (errand ? errandFreelancerLabel : 'Waiting for a match')}
              </Text>
            </View>
          </View>
        </View>

        {errand && !isFreelancer && !errand.freelancer_id && (
          <View style={styles.applicantsCard}>
            <Text style={styles.sectionTitle}>Applicants</Text>
            {applicationsLoading ? (
              <Text style={styles.sectionEmpty}>Loading applicants...</Text>
            ) : applications.length === 0 ? (
              <Text style={styles.sectionEmpty}>No applications yet.</Text>
            ) : (
              applications.map((application) => (
                <Pressable
                  key={application.id}
                  accessibilityRole="button"
                  accessibilityLabel="View freelancer profile"
                  onPress={() => openFreelancerProfile(application.freelancer_id)}
                  style={({ pressed }) => [styles.applicantRow, pressed && styles.pressed]}
                >
                  <View style={styles.applicantInfo}>
                    <Text style={styles.applicantName}>
                      {application.freelancerProfile?.full_name ?? 'Freelancer'}
                    </Text>
                    <Text style={styles.applicantMeta}>
                      {application.freelancerProfile?.course ?? 'BatStateU'}
                    </Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Accept freelancer"
                    onPress={() => handleAcceptFreelancer(application)}
                    style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
                  >
                    <Text style={styles.primaryButtonText}>Accept</Text>
                  </Pressable>
                </Pressable>
              ))
            )}
          </View>
        )}

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
          {order && isFreelancer && (order.status === 'Requests' || (order.status === 'Ongoing' && isAssignedToMe)) ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={primaryActionLabel}
              onPress={handlePrimaryAction}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            >
              <Text style={styles.primaryButtonText}>{primaryActionLabel}</Text>
            </Pressable>
          ) : errand && isFreelancer && errand.status === 'open' && !errand.freelancer_id ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={hasApplied ? 'Applied' : 'Apply for errand'}
              onPress={handleErrandApply}
              style={({ pressed }) => [
                styles.primaryButton,
                hasApplied && styles.buttonDisabled,
                pressed && !hasApplied && styles.pressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>{hasApplied ? 'Applied' : 'Apply for errand'}</Text>
            </Pressable>
          ) : errand && isErrandAssignee ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mark as complete"
              onPress={() => handleErrandComplete('freelancer_completed')}
              style={({ pressed }) => [
                styles.primaryButton,
                freelancerCompleted && styles.buttonDisabled,
                pressed && !freelancerCompleted && styles.pressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {freelancerCompleted ? 'Completed' : 'Mark as Complete'}
              </Text>
            </Pressable>
          ) : errand && isErrandRequester ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mark as complete"
              onPress={() => handleErrandComplete('requester_completed')}
              style={({ pressed }) => [
                styles.primaryButton,
                requesterCompleted && styles.buttonDisabled,
                pressed && !requesterCompleted && styles.pressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {requesterCompleted ? 'Completed' : 'Mark as Complete'}
              </Text>
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
  applicantsCard: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    ...(Shadow || {}),
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  sectionEmpty: {
    marginTop: Spacing.sm,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  applicantRow: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  applicantInfo: {
    flex: 1,
  },
  applicantName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  applicantMeta: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.textSecondary,
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
  buttonDisabled: {
    opacity: 0.6,
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