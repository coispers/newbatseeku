import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { AppText as Text } from '../../components/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';
import { ErrandCard } from '../../components/home/ErrandCard';

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

const ErrandsScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { orders, acceptOrder } = useOrders();
  const { Colors, Spacing, Radius, Shadow } = useTheme();
  const isFreelancer = user?.role === 'freelancer';

  const [selected, setSelected] = useState('All');

  const filters = useMemo(() => {
    const cats = orders.map((o) => (o.kind === 'errand' ? 'Errand' : o.category));
    return Array.from(new Set([...defaultFilters, ...cats]));
  }, [orders]);

  const filtered = useMemo(() => {
    // Freelancers see open requests across kinds; students see their own posted requests
    const scoped = isFreelancer ? orders.filter((o) => o.status === 'Requests') : orders.filter((o) => o.requesterId === user?.id);

    if (selected === 'All') return scoped;

    if (selected === 'Errand') return scoped.filter((o) => o.kind === 'errand');

    return scoped.filter((o) => String(o.category).toLowerCase() === String(selected).toLowerCase());
  }, [isFreelancer, orders, selected, user?.id]);

  const handleErrandAction = async (itemId: string) => {
    if (isFreelancer && user) {
      await acceptOrder(itemId, user.id);
    }

    router.push(`/order/${itemId}`);
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
            title={item.title}
            budget={item.budget}
            location={item.location}
            timeAgo={timeSince(item.createdAt)}
            actionLabel={isFreelancer ? 'Accept' : 'View progress'}
            onAccept={() => handleErrandAction(item.id)}
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
