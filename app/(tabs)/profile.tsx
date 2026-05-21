import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { AppText as Text } from '../../components/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';
import { Avatar } from '../../components/ui/Avatar';

const ProfileScreen = () => {
  const router = useRouter();
  const { user, signOut, switchRole } = useAuth();
  const { orders } = useOrders();
  const { Colors, Spacing, Radius, Shadow } = useTheme();

  const isFreelancer = user?.role === 'freelancer';

  // Actions map
  const actions: Record<string, () => void> = {
    'Active Requests': () => {
      const latestOrder = orders[0];
      router.push(latestOrder ? `/order/${latestOrder.id}` : '/request/step1');
    },
    'Transaction History': () => router.push('/receipt'),
    Earnings: () => { },
    'Switch to Freelancer Mode': async () => {
      await switchRole('freelancer');
    },
    'Switch to Student Mode': async () => {
      await switchRole('student');
    },
    Premium: () => router.push('/premium'),
    Settings: () => { },
    Help: () => { },
  };

  // Menu items list depending on active role
  const menuItems = [
    'Active Requests',
    'Transaction History',
    isFreelancer ? 'Earnings' : null,
    isFreelancer ? 'Switch to Student Mode' : 'Switch to Freelancer Mode',
    'Premium',
    'Settings',
    'Help',
  ].filter(Boolean) as string[];

  // User initials helper
  const initials = user?.name?.split(' ').map((part) => part[0]).join('') || 'JD';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isFreelancer ? '#F0FDF4' : '#FFFFFF' }]}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Avatar
            initials={initials}
            size={72}
            style={{
              backgroundColor: isFreelancer ? '#DCFCE7' : '#FDECEA',
              borderColor: isFreelancer ? '#DCFCE7' : '#FDECEA',
              borderWidth: 1,
            }}
            textStyle={{
              color: isFreelancer ? '#144D2E' : '#8B0000',
              fontWeight: '700',
            }}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{user?.name || 'Juan Dela Cruz'}</Text>
            <Text style={styles.email}>{user?.email || 'student@g.batstate-u.edu.ph'}</Text>

            {/* VERIFIED BADGE */}
            <View style={styles.verifiedBadge}>
              <MaterialCommunityIcons name="check-decagram" size={13} color="#166534" />
              <Text style={styles.verifiedBadgeText}>Verified Student</Text>
            </View>
          </View>
        </View>

        {/* FREELANCER SPECIFIC REPUTATION SCORE CARD */}
        {isFreelancer && (
          <View style={styles.reputationSection}>
            <View style={styles.reputationCard}>
              <View style={styles.reputationHeaderRow}>
                <Text style={styles.reputationLabel}>Reputation Score</Text>
                <View style={styles.reputationBadgePill}>
                  <Text style={styles.reputationBadgeText}>Top Tutor</Text>
                </View>
              </View>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreNumber}>94</Text>
                <Text style={styles.scoreSubLabel}>Campus Reputation (Excellent)</Text>
              </View>
            </View>
          </View>
        )}

        {/* STATS ROW */}
        <View style={[styles.statsRow, { backgroundColor: isFreelancer ? '#F0FDF4' : '#F7F7F8' }]}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>48</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statValue}>21</Text>
            <Text style={styles.statLabel}>Jobs</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statValue}>4.9</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* MENU */}
        <View style={styles.menu}>
          <FlatList
            data={menuItems}
            keyExtractor={(item) => item}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const isSwitchRow = item.startsWith('Switch to');

              if (isSwitchRow) {
                const switchFreelancer = item === 'Switch to Freelancer Mode';
                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={item}
                    onPress={() => actions[item]?.()}
                    style={({ pressed }) => [
                      styles.switchRow,
                      {
                        backgroundColor: pressed
                          ? switchFreelancer
                            ? '#DCFCE7' // forest highlight on press
                            : '#FDECEA' // maroon highlight on press
                          : 'transparent',
                      },
                    ]}
                  >
                    <View style={styles.switchRowLeft}>
                      <View
                        style={[
                          styles.switchIconCircle,
                          {
                            backgroundColor: switchFreelancer ? '#DCFCE7' : '#FDECEA',
                          },
                        ]}
                      >
                        <Ionicons
                          name={switchFreelancer ? 'briefcase-outline' : 'school-outline'}
                          size={18}
                          color={switchFreelancer ? '#1A5C38' : '#8B0000'}
                        />
                      </View>
                      <View>
                        <Text
                          style={[
                            styles.switchRowTitle,
                            { color: switchFreelancer ? '#1A5C38' : '#8B0000' },
                          ]}
                        >
                          {item}
                        </Text>
                        <Text style={styles.switchRowSub}>
                          {switchFreelancer
                            ? 'Offer your skills and earn'
                            : 'Request services and get help'}
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={switchFreelancer ? '#1A5C38' : '#8B0000'}
                    />
                  </Pressable>
                );
              }

              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={item}
                  onPress={() => actions[item]?.()}
                  style={({ pressed }) => [styles.menuRow, pressed && styles.pressed]}
                >
                  <Text style={styles.menuText}>{item}</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={isFreelancer ? '#1A5C38' : '#8B0000'}
                  />
                </Pressable>
              );
            }}
          />

          {/* LOGOUT BUTTON */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Logout"
            onPress={() => signOut()}
            style={({ pressed }) => [
              styles.logoutRow,
              { backgroundColor: isFreelancer ? '#DCFCE7' : '#FDECEA' },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.logoutText, { color: isFreelancer ? '#1A5C38' : '#8B0000' }]}>
              Logout
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  email: {
    fontSize: 13,
    color: '#6B6B6B',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#DCFCE7',
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
  },

  /* Reputation Score Card */
  reputationSection: {
    marginBottom: 16,
  },
  reputationCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  reputationHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reputationLabel: {
    fontSize: 13,
    color: '#1A5C38',
    fontWeight: '600',
  },
  reputationBadgePill: {
    backgroundColor: '#DCFCE7',
    borderColor: '#BBF7D0',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  reputationBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#14532D',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 8,
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6B0000',
  },
  scoreSubLabel: {
    fontSize: 12,
    color: '#1A5C38',
    fontWeight: '500',
  },

  /* Stats Row */
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E5E7',
  },

  /* Menu */
  menu: {
    flex: 1,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  menuText: {
    fontSize: 14.5,
    fontWeight: '500',
    color: '#1A1A1A',
  },

  /* Custom Switch Row */
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: -8,
    borderRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  switchRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRowTitle: {
    fontSize: 14.5,
    fontWeight: '600',
  },
  switchRowSub: {
    fontSize: 11.5,
    color: '#6B6B6B',
    marginTop: 2,
  },

  /* Logout button */
  logoutRow: {
    marginTop: 24,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontWeight: '600',
    fontSize: 15,
  },
  pressed: {
    opacity: 0.75,
  },
});

export default ProfileScreen;
