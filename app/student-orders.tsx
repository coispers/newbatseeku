import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText as Text } from '../components/ui/AppText';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { FilterChip } from '../components/services/FilterChip';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const orderFilters = ['Requests', 'Ongoing', 'Finished'];

const timeSince = (value: string) => {
  const createdAt = new Date(value).getTime();
  const diffMinutes = Math.max(1, Math.round((Date.now() - createdAt) / 60000));

  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
};

const StudentOrdersScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { orders } = useOrders();
  const { Colors, Spacing } = useTheme();

  const [selected, setSelected] = useState('Requests');

  const myOrders = useMemo(() => orders.filter((o) => o.requesterId === user?.id), [orders, user?.id]);

  const filtered = useMemo(() => myOrders.filter((o) => o.status === selected), [myOrders, selected]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.background }]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <View style={styles.headerRow}>
              <Text style={[styles.title, { color: Colors.textPrimary }]}>Orders</Text>
            </View>

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
        renderItem={({ item }) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={`Open order ${item.title}`}
            onPress={() => router.push(`/order/${item.id}`)}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          >
            <View style={styles.rowTop}>
              <View>
                <Text style={[styles.orderTitle, { color: Colors.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.orderMeta, { color: Colors.textSecondary }]}>Requested by {item.requesterName}</Text>
              </View>
              <View style={[styles.statusPill, { backgroundColor: item.status === 'Ongoing' ? Colors.primaryLight : '#E6E6E6' }] }>
                <Text style={[styles.statusText, { color: item.status === 'Ongoing' ? Colors.primary : Colors.textMuted }]}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.rowBottom}>
              <Text style={[styles.orderBudget, { color: Colors.textPrimary }]}>₱{item.budget}</Text>
              <View style={styles.timeRow}>
                <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
                <Text style={[styles.orderTime, { color: Colors.textMuted }]}>{timeSince(item.createdAt)}</Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  list: { padding: 16, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '600' },
  filterRow: { marginBottom: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E5E5E7' },
  pressed: { opacity: 0.85 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderTitle: { fontSize: 16, fontWeight: '600' },
  orderMeta: { fontSize: 12, marginTop: 4 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  statusText: { fontSize: 12, fontWeight: '600' },
  rowBottom: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderBudget: { fontSize: 14, fontWeight: '600' },
  orderTime: { marginLeft: 6, fontSize: 12 },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
});

export default StudentOrdersScreen;
