import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { categories, freelancers, popularServices } from '../../constants/mock-data';
import { CategoryCard } from '../../components/home/CategoryCard';
import { FreelancerCard } from '../../components/home/FreelancerCard';
import { ServiceCard } from '../../components/services/ServiceCard';
import { SearchBar } from '../../components/ui/SearchBar';
import { AppText as Text } from '../../components/ui/AppText';

const HomeScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { Colors, Spacing, Radius, Shadow } = useTheme();

  const isFreelancer = user?.role === 'freelancer';

  // State for Freelancer Availability
  const [isOnline, setIsOnline] = useState(true);

  // Student specific category chips selection state
  const [selectedCategory, setSelectedCategory] = useState('tutoring');

  // Quick Errands list
  const quickErrands = useMemo(
    () => [
      { id: 'food', label: 'Buy Food', icon: 'food' },
      { id: 'printing', label: 'Printing', icon: 'printer' },
      { id: 'library', label: 'Library', icon: 'book-open-variant' },
    ],
    []
  );

  // Freelancer mock orders
  const mockOrders = useMemo(
    () => [
      { id: 'o1', title: 'Calculus Review Session', student: 'Noel G.', date: 'Today, 3:00 PM', status: 'Ongoing' },
      { id: 'o2', title: 'Java Programming Help', student: 'Juan D.', date: 'Tomorrow, 10:00 AM', status: 'Pending' },
      { id: 'o3', title: 'Thesis Formatting Assist', student: 'Maria C.', date: 'Completed May 20', status: 'Done' },
    ],
    []
  );

  // Helper: Status Pill Color Mapping
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Ongoing':
        return { bg: '#FEF9C3', text: '#7A5C10' }; // gold
      case 'Pending':
        return { bg: '#FEF3C7', text: '#92400E' }; // amber
      case 'Done':
      default:
        return { bg: '#DCFCE7', text: '#166534' }; // green
    }
  };

  /* ================= STUDENT HOME SCREEN ================= */
  const renderStudentHome = () => {
    const listHeader = (
      <View>
        <View style={styles.studentHeader}>
          <View>
            <Text style={styles.studentGreeting}>Good morning, {user?.name || 'Student'}</Text>
            <Text style={styles.studentSubGreeting}>Find help fast with trusted peers.</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            onPress={() => {}}
            style={({ pressed }) => [styles.bellCircle, { backgroundColor: '#F0F0F2' }, pressed && styles.pressed]}
          >
            <Ionicons name="notifications-outline" size={20} color="#8B0000" />
            <View style={[styles.badgeDot, { backgroundColor: '#8B0000' }]} />
          </Pressable>
        </View>

        {user?.role === 'guest' && (
          <View style={styles.guestBanner}>
            <Text style={styles.guestTitle}>Browsing as guest</Text>
            <Text style={styles.guestCopy}>Create an account to book services and message tutors.</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Log in"
              onPress={() => router.push('/(auth)/login')}
              style={({ pressed }) => [styles.guestAction, pressed && styles.pressed]}
            >
              <Text style={styles.guestActionText}>Log in</Text>
            </Pressable>
          </View>
        )}

        <SearchBar
          placeholder="What do you need help with?"
          onPress={() => {}}
          style={styles.studentSearch}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse categories</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="See all categories"
            onPress={() => {}}
          >
            <Text style={[styles.seeAll, { color: '#8B0000' }]}>See all</Text>
          </Pressable>
        </View>

        <FlatList
          data={categories}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryCard
              label={item.label}
              icon={item.icon as keyof typeof Ionicons.glyphMap}
              isSelected={selectedCategory === item.id}
              onPress={() => setSelectedCategory(item.id)}
            />
          )}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available now</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="See all available"
            onPress={() => {}}
          >
            <Text style={[styles.seeAll, { color: '#8B0000' }]}>See all</Text>
          </Pressable>
        </View>

        <FlatList
          data={freelancers}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <FreelancerCard
              name={item.name}
              subject={item.expertise[0]}
              rating={item.rating}
              price={item.price}
              isOnline={item.isOnline}
              isVerified={item.isVerified}
              avatar={item.avatar}
              reputationScore={Math.round(item.rating * 20)}
              onPress={() => router.push(`/freelancer/${item.id}`)}
            />
          )}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick errands</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="See all errands"
            onPress={() => router.push('/(tabs)/errands')}
          >
            <Text style={[styles.seeAll, { color: '#8B0000' }]}>See all</Text>
          </Pressable>
        </View>

        <View style={styles.quickRow}>
          {quickErrands.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              onPress={() => {}}
              style={({ pressed }) => [styles.quickCard, pressed && styles.pressed]}
            >
              <MaterialCommunityIcons name={item.icon as any} size={22} color="#8B0000" />
              <Text style={styles.quickLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular services</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="See all services"
            onPress={() => router.push('/(tabs)/services')}
          >
            <Text style={[styles.seeAll, { color: '#8B0000' }]}>See all</Text>
          </Pressable>
        </View>
      </View>
    );

    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: '#FFFFFF' }]}>
        <FlatList
          data={popularServices}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={listHeader}
          renderItem={({ item }) => (
            <ServiceCard
              title={item.title}
              category={item.category}
              price={item.price}
              rating={item.rating}
              tutor={item.tutor}
            />
          )}
        />
      </SafeAreaView>
    );
  };

  /* ================= FREELANCER DASHBOARD SCREEN ================= */
  const renderFreelancerDashboard = () => {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: '#FFFBEB' }]}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* HEADER */}
          <View style={styles.freelancerHeader}>
            <View>
              <Text style={styles.freelancerGreeting}>Welcome back, {user?.name || 'Freelancer'}</Text>
              <View style={styles.onlineBadgeRow}>
                <View style={[styles.indicatorDot, { backgroundColor: isOnline ? '#16A34A' : '#9A9A9A' }]} />
                <Text style={styles.onlineBadgeText}>{isOnline ? 'Online' : 'Offline'}</Text>
              </View>
            </View>
            <View style={styles.headerRightActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Notifications"
                onPress={() => {}}
                style={({ pressed }) => [styles.bellCircle, { backgroundColor: '#FFFDF0', borderColor: '#EDE8C8', borderWidth: 1 }, pressed && styles.pressed]}
              >
                <Ionicons name="notifications-outline" size={20} color="#8B6914" />
                <View style={[styles.badgeDot, { backgroundColor: '#8B6914' }]} />
              </Pressable>
            </View>
          </View>

          {/* ONLINE TOGGLE ROW */}
          <View style={styles.availabilityRow}>
            <View>
              <Text style={styles.availabilityTitle}>Availability Status</Text>
              <Text style={styles.availabilitySub}>Receive client requests when active</Text>
            </View>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ true: '#B8860B', false: '#E5E5E7' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* EARNINGS SUMMARY CARD */}
          <View style={styles.earningsCard}>
            <View style={styles.earningsTop}>
              <View>
                <Text style={styles.earningsLabel}>This week's earnings</Text>
                <Text style={styles.earningsAmount}>₱3,840.00</Text>
              </View>
              <View style={styles.changeBadge}>
                <Text style={styles.changeBadgeText}>+₱320</Text>
              </View>
            </View>

            <View style={styles.earningsDivider} />

            <View style={styles.statsRow}>
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>Jobs</Text>
                <Text style={styles.statValue}>18</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>Pending</Text>
                <Text style={styles.statValue}>2</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>Rating</Text>
                <View style={styles.starRow}>
                  <Ionicons name="star" size={13} color="#B8860B" />
                  <Text style={styles.statValue}>4.9</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ACTIVE ORDERS ALERT BANNER */}
          <Pressable
            style={({ pressed }) => [styles.alertBanner, pressed && styles.pressed]}
            onPress={() => router.push('/(tabs)/services')}
          >
            <View style={styles.alertLeft}>
              <Ionicons name="alert-circle-outline" size={20} color="#FFFFFF" />
              <Text style={styles.alertText}>You have 2 active requests</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
          </Pressable>

          {/* QUICK ACTIONS */}
          <Text style={styles.dashboardSectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add Service"
              style={({ pressed }) => [styles.quickActionBtn, pressed && styles.pressed]}
              onPress={() => router.push('/(tabs)/services')}
            >
              <View style={styles.quickIconCircle}>
                <Ionicons name="add-circle-outline" size={20} color="#8B6914" />
              </View>
              <Text style={styles.quickActionLabel}>Add Service</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Find Errands"
              style={({ pressed }) => [styles.quickActionBtn, pressed && styles.pressed]}
              onPress={() => router.push('/(tabs)/errands')}
            >
              <View style={styles.quickIconCircle}>
                <Ionicons name="search-outline" size={20} color="#8B6914" />
              </View>
              <Text style={styles.quickActionLabel}>Find Errands</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Messages"
              style={({ pressed }) => [styles.quickActionBtn, pressed && styles.pressed]}
              onPress={() => router.push('/(tabs)/messages')}
            >
              <View style={styles.quickIconCircle}>
                <Ionicons name="chatbubble-outline" size={20} color="#8B6914" />
              </View>
              <Text style={styles.quickActionLabel}>Chats</Text>
            </Pressable>
          </View>

          {/* ACTIVE ORDERS LIST */}
          <View style={styles.sectionHeader}>
            <Text style={styles.dashboardSectionTitle}>Active Orders</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="See all active orders"
              onPress={() => {}}
            >
              <Text style={[styles.seeAll, { color: '#8B6914' }]}>See all</Text>
            </Pressable>
          </View>

          {mockOrders.map((order) => {
            const statusTheme = getStatusStyle(order.status);
            return (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderTop}>
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderTitle}>{order.title}</Text>
                    <Text style={styles.orderClient}>Client: {order.student} • {order.date}</Text>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: statusTheme.bg }]}>
                    <Text style={[styles.statusText, { color: statusTheme.text }]}>{order.status}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    );
  };

  return isFreelancer ? renderFreelancerDashboard() : renderStudentHome();
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  pressed: {
    opacity: 0.75,
  },
  badgeDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  /* Student Styles */
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  studentGreeting: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  studentSubGreeting: {
    fontSize: 13,
    color: '#6B6B6B',
    marginTop: 4,
  },
  studentSearch: {
    marginTop: 8,
    backgroundColor: '#F0F0F2',
    borderRadius: 999,
    paddingVertical: 12,
  },

  /* Freelancer Styles */
  freelancerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE8C8',
  },
  freelancerGreeting: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  onlineBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  onlineBadgeText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B6B6B',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bellCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  availabilityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  availabilitySub: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 2,
  },

  /* Earnings Summary Card */
  earningsCard: {
    backgroundColor: '#FEF9C3',
    borderColor: '#E8DDA8',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  earningsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  earningsLabel: {
    fontSize: 13,
    color: '#8B6914',
    fontWeight: '500',
  },
  earningsAmount: {
    fontSize: 26,
    fontWeight: '700',
    color: '#6B0000',
    marginTop: 4,
  },
  changeBadge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  changeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
  },
  earningsDivider: {
    height: 1,
    backgroundColor: '#E8DDA8',
    marginVertical: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#8B6914',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B6B6B',
    marginTop: 4,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E8DDA8',
  },

  /* Active Orders Alert Banner */
  alertBanner: {
    backgroundColor: '#8B0000',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    marginBottom: 20,
  },
  alertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },

  /* Quick Actions (Dashboard) */
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  quickActionBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  quickIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFBEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B6B6B',
  },

  /* Active Orders List */
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderInfo: {
    flex: 1,
    marginRight: 8,
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  orderClient: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 4,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },

  /* Common/Shared Layout Styles */
  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  dashboardSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 4,
  },
  quickCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  quickLabel: {
    fontSize: 12,
    color: '#6B6B6B',
    fontWeight: '600',
  },
  guestBanner: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    backgroundColor: '#F7F7F8',
    gap: 4,
  },
  guestTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  guestCopy: {
    fontSize: 12,
    color: '#6B6B6B',
  },
  guestAction: {
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#8B0000',
  },
  guestActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default HomeScreen;
