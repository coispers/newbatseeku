import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { AppText as Text } from '../../components/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { freelancers } from '../../constants/mock-data';
import { supabase } from '../../lib/supabase';
import { FilterChip } from '../../components/services/FilterChip';
import { SearchBar } from '../../components/ui/SearchBar';
import { Avatar } from '../../components/ui/Avatar';
import { TrustBadge } from '../../components/ui/TrustBadge';
import { Button } from '../../components/ui/Button';

const studentFilters = ['All', 'Tutoring', 'Programming', 'Math', 'Science', 'Thesis', 'Lab', 'Review'];
const orderFilters = ['Requests', 'Ongoing', 'Finished'];

const timeSince = (value: string) => {
  const createdAt = new Date(value).getTime();
  const diffMinutes = Math.max(1, Math.round((Date.now() - createdAt) / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
};

type RemoteErrand = {
  id: string;
  requester_id: string;
  requester_name: string;
  category: string | null;
  description: string | null;
  budget: number | null;
  status: string | null;
  freelancer_id: string | null;
  created_at: string | null;
};

const toOrderStatus = (status: string | null) => {
  if (status === 'in_progress') return 'Ongoing';
  if (status === 'completed') return 'Finished';
  return 'Requests';
};

const ServicesScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { Colors, Spacing, Radius, Shadow } = useTheme();
  const isFreelancer = user?.role === 'freelancer';

  const [selected, setSelected] = useState('All');
  const [errands, setErrands] = useState<RemoteErrand[]>([]);

  useEffect(() => {
    setSelected(isFreelancer ? 'Requests' : 'All');
  }, [isFreelancer]);

  useEffect(() => {
    if (!isFreelancer || !user?.id) {
      setErrands([]);
      return;
    }

    let isActive = true;

    const loadErrands = async () => {
      const { data, error } = await supabase
        .from('errands')
        .select('id, requester_id, requester_name, category, description, budget, status, freelancer_id, created_at')
        .eq('freelancer_id', user.id)
        .order('created_at', { ascending: false });

      if (!isActive) return;

      if (error) {
        console.error('Failed to load assigned errands:', error);
        setErrands([]);
        return;
      }

      setErrands((data ?? []) as RemoteErrand[]);
    };

    loadErrands();

    return () => {
      isActive = false;
    };
  }, [isFreelancer, user?.id]);

  const updateErrandStatus = async (errand: RemoteErrand, nextStatus: 'in_progress' | 'open') => {
    const updates =
      nextStatus === 'open'
        ? { status: 'open', freelancer_id: null }
        : { status: 'in_progress' };

    const { data, error } = await supabase
      .from('errands')
      .update(updates)
      .eq('id', errand.id)
      .select('*')
      .single();

    if (error) {
      console.error('Failed to update errand status:', error);
      return;
    }

    setErrands((current) => {
      if (nextStatus === 'open') {
        return current.filter((item) => item.id !== errand.id);
      }

      return current.map((item) => (item.id === errand.id ? (data as RemoteErrand) : item));
    });
  };

  const errandFiltered = useMemo(
    () => errands.filter((item) => toOrderStatus(item.status) === selected),
    [errands, selected]
  );

  const studentFiltered = useMemo(() => {
    if (selected === 'All') {
      return freelancers;
    }
    return freelancers.filter((item) => item.expertise.includes(selected));
  }, [selected]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.background }]}>
      {isFreelancer ? (
        <FlatList
          data={errandFiltered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View>
              <View style={styles.headerRow}>
                <Text style={styles.title}>Tasks</Text>
              </View>

              <SearchBar placeholder="Search tasks" onPress={() => {}} />

              <View style={styles.filterRow}>
                <FlatList
                  data={orderFilters}
                  horizontal
                  keyExtractor={(item) => item}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <FilterChip label={item} isSelected={selected === item} onPress={() => setSelected(item)} />
                  )}
                />
              </View>
            </View>
          }
          renderItem={({ item }) => {
            const statusLabel = toOrderStatus(item.status);
            const title = item.description ?? `${item.category ?? 'Errand'} request`;
            const isRequest = statusLabel === 'Requests';
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`View progress for ${title}`}
                onPress={() => router.push(`/order/${item.id}`)}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              >
                <View style={styles.orderHeader}>
                  <Text style={styles.orderTitle}>{title}</Text>
                  <View style={[styles.orderStatus, { backgroundColor: Colors.primaryLight }]}>
                    <Text style={[styles.orderStatusText, { color: Colors.primary }]}>{statusLabel}</Text>
                  </View>
                </View>
                <Text style={styles.orderMeta}>Requested by {item.requester_name ?? 'Student'}</Text>
                <View style={styles.orderFooter}>
                  <Text style={styles.orderBudget}>₱{item.budget ?? 0}</Text>
                  <Text style={styles.orderTime}>{timeSince(item.created_at ?? new Date().toISOString())}</Text>
                </View>
                <View style={styles.orderActionRow}>
                  <Text style={styles.orderActionText}>View progress</Text>
                  <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
                </View>
                {isRequest && (
                  <View style={styles.actionButtonsRow}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Accept request"
                      onPress={() => updateErrandStatus(item, 'in_progress')}
                      style={({ pressed }) => [
                        styles.acceptButton,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text style={styles.acceptButtonText}>Accept</Text>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Deny request"
                      onPress={() => updateErrandStatus(item, 'open')}
                      style={({ pressed }) => [
                        styles.denyButton,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text style={styles.denyButtonText}>Deny</Text>
                    </Pressable>
                  </View>
                )}
              </Pressable>
            );
          }}
        />
      ) : (
        <FlatList
          data={studentFiltered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View>
              <View style={styles.headerRow}>
                <Text style={styles.title}>Services</Text>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Find Nearby Help"
                  onPress={() => router.push('/find-help')}
                  style={({ pressed }) => [
                    styles.ctaButton,
                    { backgroundColor: Colors.primary },
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.ctaText}>Find Nearby Help</Text>
                </Pressable>
              </View>

              <SearchBar placeholder="Search services" onPress={() => {}} />

              <View style={styles.filterRow}>
                <FlatList
                  data={studentFilters}
                  horizontal
                  keyExtractor={(item) => item}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <FilterChip label={item} isSelected={selected === item} onPress={() => setSelected(item)} />
                  )}
                />
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <Avatar initials={item.avatar} size={52} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{item.name}</Text>
                  <Text style={styles.cardCourse}>{item.course}</Text>
                  <FlatList
                    data={item.expertise.slice(0, 2)}
                    horizontal
                    keyExtractor={(tag) => tag}
                    scrollEnabled={false}
                    contentContainerStyle={styles.tagRow}
                    renderItem={({ item: tag }) => (
                      <View style={[styles.tag, { backgroundColor: Colors.primaryLight }]}>
                        <Text style={[styles.tagText, { color: Colors.primary }]}>{tag}</Text>
                      </View>
                    )}
                  />
                </View>
                <View style={styles.cardRight}>
                  <Text style={styles.cardPrice}>₱{item.price}/hr</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={12} color="#1A5C38" />
                    <Text style={styles.cardRating}>{item.rating.toFixed(1)}</Text>
                  </View>
                  {item.isOnline && <View style={[styles.onlineDot, { backgroundColor: '#16A34A' }]} />}
                </View>
              </View>
              <View style={styles.cardFooter}>
                <TrustBadge type={item.isVerified ? 'verified' : 'reliable'} />
                <View style={styles.cardActions}>
                  <Button
                    label="View Profile"
                    variant="outline"
                    onPress={() => router.push(`/freelancer/${item.id}`)}
                    style={styles.viewButton}
                  />
                </View>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  ctaButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12.5,
  },
  filterRow: {
    marginTop: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    padding: 16,
    marginBottom: 16,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  cardCourse: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 4,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  cardRating: {
    fontSize: 12,
    color: '#6B6B6B',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardFooter: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  orderStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderMeta: {
    fontSize: 12,
    color: '#6B6B6B',
    marginBottom: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderBudget: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderTime: {
    fontSize: 12,
    color: '#6B6B6B',
  },
  orderActionRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  actionButtonsRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#1A5C38',
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  denyButton: {
    flex: 1,
    backgroundColor: '#FDECEA',
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
  },
  denyButtonText: {
    color: '#8B0000',
    fontSize: 13,
    fontWeight: '600',
  },
  orderActionText: {
    fontSize: 12,
    color: '#1A5C38',
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pressed: {
    opacity: 0.75,
  },
});

export default ServicesScreen;
