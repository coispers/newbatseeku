import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { AppText as Text } from '../../components/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { freelancers } from '../../constants/mock-data';
import { FilterChip } from '../../components/services/FilterChip';
import { SearchBar } from '../../components/ui/SearchBar';
import { Avatar } from '../../components/ui/Avatar';
import { TrustBadge } from '../../components/ui/TrustBadge';
import { Button } from '../../components/ui/Button';

const studentFilters = ['All', 'Tutoring', 'Programming', 'Math', 'Science', 'Thesis', 'Lab', 'Review'];
const orderFilters = ['Requests', 'Ongoing', 'Finished'];

const mockOrders = [
  {
    id: 'o1',
    title: 'Calculus problem set help',
    requester: 'Juan Dela Cruz',
    budget: 200,
    status: 'Requests',
    time: '10m ago',
  },
  {
    id: 'o2',
    title: 'Thesis formatting review',
    requester: 'Lia Santos',
    budget: 350,
    status: 'Ongoing',
    time: 'Due today',
  },
  {
    id: 'o3',
    title: 'Physics lab report edits',
    requester: 'Marco Reyes',
    budget: 180,
    status: 'Finished',
    time: 'Completed yesterday',
  },
];

const ServicesScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { Colors, Spacing, Radius, Shadow } = useTheme();
  const isFreelancer = user?.role === 'freelancer';

  const [selected, setSelected] = useState('All');

  useEffect(() => {
    setSelected(isFreelancer ? 'Requests' : 'All');
  }, [isFreelancer]);

  const filtered = useMemo(() => {
    if (isFreelancer) {
      return mockOrders.filter((item) => item.status === selected);
    }
    if (selected === 'All') {
      return freelancers;
    }
    return freelancers.filter((item) => item.expertise.includes(selected));
  }, [isFreelancer, selected]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.background }]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <View style={styles.headerRow}>
              <Text style={styles.title}>{isFreelancer ? 'Orders' : 'Services'}</Text>

              {/* Show primary CTA only for students (Find Nearby Help) */}
              {!isFreelancer && (
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
              )}
            </View>

            <SearchBar placeholder={isFreelancer ? "Search tasks" : "Search services"} onPress={() => {}} />
            
            <View style={styles.filterRow}>
              <FlatList
                data={isFreelancer ? orderFilters : studentFilters}
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
        renderItem={({ item }) =>
          isFreelancer ? (
            <View style={styles.card}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderTitle}>{item.title}</Text>
                <View style={[styles.orderStatus, { backgroundColor: Colors.primaryLight }]}>
                  <Text style={[styles.orderStatusText, { color: Colors.primary }]}>{item.status}</Text>
                </View>
              </View>
              <Text style={styles.orderMeta}>Requested by {item.requester}</Text>
              <View style={styles.orderFooter}>
                <Text style={styles.orderBudget}>₱{item.budget}</Text>
                <Text style={styles.orderTime}>{item.time}</Text>
              </View>
            </View>
          ) : (
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
          )
        }
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
