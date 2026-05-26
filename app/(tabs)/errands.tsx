import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { AppText as Text } from '../../components/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { ErrandCard } from '../../components/home/ErrandCard';
import { supabase } from '../../lib/supabase';

const defaultFilters = ['All'];

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
  urgency: string | null;
  duration: string | null;
  budget: number | null;
  payment_method: string | null;
  status: string | null;
  freelancer_id: string | null;
  created_at: string | null;
};

const ErrandsScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { Colors, Spacing, Radius, Shadow } = useTheme();
  const isFreelancer = user?.role === 'freelancer';

  const [errands, setErrands] = useState<RemoteErrand[]>([]);
  const [selected, setSelected] = useState('All');

  useEffect(() => {
    let isActive = true;

    const loadErrands = async () => {
      const { data, error } = await supabase
        .from('errands')
        .select('*')
        .order('created_at', { ascending: false });

      if (!isActive) return;

      if (error) {
        console.error('Failed to load errands:', error);
        setErrands([]);
        return;
      }

      setErrands((data ?? []) as RemoteErrand[]);
    };

    loadErrands();

    return () => {
      isActive = false;
    };
  }, []);

  const filters = useMemo(() => {
    const cats = errands
      .map((o) => o.category ?? 'Other')
      .filter((cat) => String(cat).trim().length > 0);
    return Array.from(new Set([...defaultFilters, ...cats]));
  }, [errands]);

  const filtered = useMemo(() => {
    // Freelancers see open requests; students see their own posted requests
    const scoped = isFreelancer
      ? errands.filter((o) => o.status === 'open')
      : errands.filter((o) => o.requester_id === user?.id);

    if (selected === 'All') return scoped;

    return scoped.filter((o) => String(o.category).toLowerCase() === String(selected).toLowerCase());
  }, [errands, isFreelancer, selected, user?.id]);

  const applyForErrand = async (item: RemoteErrand) => {
    if (!user) return;

    const { data: profileRow, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      Alert.alert('Unable to apply', profileError.message);
      return;
    }

    if (!profileRow) {
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({ id: user.id, full_name: user.name, role: user.role }, { onConflict: 'id' });

      if (upsertError) {
        Alert.alert('Unable to apply', upsertError.message);
        return;
      }
    }

    const { data: existing, error: existingError } = await supabase
      .from('errand_applications')
      .select('id')
      .eq('errand_id', item.id)
      .eq('freelancer_id', user.id)
      .maybeSingle();

    if (existingError) {
      Alert.alert('Unable to apply', existingError.message);
      return;
    }

    if (existing) {
      Alert.alert('Already applied', 'You already applied for this errand.');
      return;
    }

    const { error } = await supabase
      .from('errand_applications')
      .insert({ errand_id: item.id, freelancer_id: user.id });

    if (error) {
      Alert.alert('Unable to apply', error.message);
      return;
    }

    Alert.alert('Application sent', 'The student will review your application.');
  };

  const openErrandDetails = (item: RemoteErrand) => {
    router.push(`/order/${item.id}`);
  };

  const handleErrandAccept = (item: RemoteErrand) => {
    if (!isFreelancer) {
      openErrandDetails(item);
      return;
    }

    Alert.alert('Accept request', 'Do you want to accept this errand?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Accept', onPress: () => applyForErrand(item) },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.background }]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.title}>{isFreelancer ? 'Available Requests' : 'Request Wall'}</Text>

              {!isFreelancer && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Post Request"
                  onPress={() => router.push('/request/step1')}
                  style={({ pressed }) => [
                    styles.postButton,
                    { backgroundColor: Colors.primary },
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.postText}>Post Request</Text>
                </Pressable>
              )}
            </View>

            <View style={styles.filterRow}>
              <FlatList
                data={filters}
                horizontal
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={item}
                    onPress={() => setSelected(item)}
                    style={({ pressed }) => [
                      styles.filter,
                      selected === item && { backgroundColor: Colors.primary },
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        selected === item && { color: '#FFFFFF' },
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                )}
              />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <ErrandCard
            title={item.description ?? `${item.category ?? 'Errand'} request`}
            budget={item.budget ?? 0}
            location="BatStateU"
            timeAgo={timeSince(item.created_at ?? new Date().toISOString())}
            actionLabel={isFreelancer ? 'Accept' : 'View progress'}
            onPress={() => openErrandDetails(item)}
            onAccept={() => handleErrandAccept(item)}
          />
        )}
      />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  postButton: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  postText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12.5,
  },
  filterRow: {
    marginTop: 16,
    marginBottom: 16,
  },
  filter: {
    backgroundColor: '#F0F0F2',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  filterText: {
    fontSize: 13,
    color: '#6B6B6B',
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.75,
  },
});

export default ErrandsScreen;
