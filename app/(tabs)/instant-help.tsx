import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import { AppText as Text } from '../../components/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { freelancers } from '../../constants/mock-data';
import { useOrders } from '../../hooks/useOrders';

const distanceBetweenKm = (start: { latitude: number; longitude: number }, end: { latitude: number; longitude: number }) => {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(end.latitude - start.latitude);
  const deltaLon = toRadians(end.longitude - start.longitude);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(start.latitude)) * Math.cos(toRadians(end.latitude)) * Math.sin(deltaLon / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
};

const InstantHelpScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const { getOrderById } = useOrders();
  const { Colors, Spacing, Radius, Shadow } = useTheme();

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [nearbyHelpers, setNearbyHelpers] = useState(freelancers);

  const postedOrder = useMemo(() => (orderId ? getOrderById(orderId) : undefined), [getOrderById, orderId]);

  useEffect(() => {
    getLocationAndNearbyHelpers();
  }, []);

  const getLocationAndNearbyHelpers = async () => {
    try {
      setLoading(true);

      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        // Show all helpers anyway if permission denied
        setNearbyHelpers(freelancers);
        setLoading(false);
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const availableHelpers = freelancers.filter((item) => item.isOnline && item.isAvailable);
      const sortedHelpers = [...availableHelpers].sort((a, b) => {
        if (!currentLocation) {
          return b.rating - a.rating;
        }

        const aDistance = distanceBetweenKm(currentLocation.coords, { latitude: a.latitude, longitude: a.longitude });
        const bDistance = distanceBetweenKm(currentLocation.coords, { latitude: b.latitude, longitude: b.longitude });
        return aDistance - bDistance;
      });

      setNearbyHelpers(sortedHelpers);
      setErrorMsg(null);
    } catch (error) {
      console.log('Location error:', error);
      setErrorMsg('Could not get your location');
      setNearbyHelpers(freelancers.filter((item) => item.isOnline && item.isAvailable));
    } finally {
      setLoading(false);
    }
  };

  const renderHelperCard = ({ item }: { item: typeof freelancers[0] }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: Colors.white,
          borderColor: Colors.border,
          ...(Shadow || {}),
        },
      ]}
    >
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          {item.isOnline && (
            <View style={[styles.onlineBadge, { backgroundColor: Colors.primary }]}>
              <View style={styles.onlineDot} />
            </View>
          )}
        </View>

        <Text style={[styles.expertise, { color: Colors.textSecondary }]} numberOfLines={1}>
          {item.expertise.join(' • ')}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons name="star" size={14} color={Colors.warning} />
            <Text style={[styles.statText, { marginLeft: 4 }]}>
              {item.rating} ({item.completedJobs} jobs)
            </Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="cash-outline" size={14} color={Colors.primary} />
            <Text style={[styles.statText, { marginLeft: 4 }]}>
              ${item.price}/hr
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.responseTime, { color: Colors.textSecondary }]}>
            Response: {item.responseRate}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: Colors.background }]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size={36} color={Colors.primary} />
          <Text style={[styles.loadingText, { color: Colors.textSecondary, marginTop: 12 }]}>
            Finding nearby helpers...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.background }]}>
      <FlatList
        data={nearbyHelpers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Find Help</Text>
                <Text style={[styles.subtitle, { color: Colors.textSecondary }]}>
                  {location ? 'Showing nearby available helpers' : 'Showing available helpers'}
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Refresh location"
                onPress={getLocationAndNearbyHelpers}
                style={({ pressed }) => [
                  styles.refreshButton,
                  { backgroundColor: Colors.primary },
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
              </Pressable>
            </View>

            {postedOrder && (
              <View style={[styles.requestCard, { backgroundColor: Colors.white, borderColor: Colors.border, ...(Shadow || {}) }]}>
                <View style={styles.requestTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.requestLabel}>Current request</Text>
                    <Text style={styles.requestTitle}>{postedOrder.title}</Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="View progress"
                    onPress={() => router.push(`/order/${postedOrder.id}`)}
                    style={({ pressed }) => [styles.progressButton, pressed && styles.pressed]}
                  >
                    <Text style={styles.progressButtonText}>Progress</Text>
                  </Pressable>
                </View>
                <Text style={[styles.requestMeta, { color: Colors.textSecondary }]}>
                  {postedOrder.category} • {postedOrder.urgency ?? 'Normal'} • ₱{postedOrder.budget}
                </Text>
              </View>
            )}

            {errorMsg && (
              <View style={[styles.errorBanner, { backgroundColor: Colors.error + '20' }]}>
                <Ionicons name="alert-circle-outline" size={16} color={Colors.error} />
                <Text style={[styles.errorText, { color: Colors.error, marginLeft: 8 }]}>
                  {errorMsg}
                </Text>
              </View>
            )}

            {location && (
              <View style={[styles.locationInfo, { backgroundColor: Colors.primaryLight }]}>
                <Ionicons name="location" size={16} color={Colors.primary} />
                <Text style={[styles.locationText, { color: Colors.primary, marginLeft: 8 }]}>
                  Lat: {location.coords.latitude.toFixed(4)}, Lon: {location.coords.longitude.toFixed(4)}
                </Text>
              </View>
            )}
          </View>
        }
        renderItem={renderHelperCard}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={Colors.textMuted} />
            <Text style={[styles.emptyText, { color: Colors.textSecondary, marginTop: 12 }]}>
              No helpers available right now
            </Text>
          </View>
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
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
  },
  requestCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    padding: 12,
  },
  requestTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
  },
  requestLabel: {
    fontSize: 11,
    color: '#6B6B6B',
  },
  requestTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 2,
  },
  requestMeta: {
    fontSize: 12,
    marginTop: 8,
  },
  progressButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F0F0F2',
  },
  progressButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBanner: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    flex: 1,
  },
  locationInfo: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  locationText: {
    fontSize: 11,
    flex: 1,
  },
  card: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardContent: {
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  onlineBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  expertise: {
    fontSize: 11,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 11,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  responseTime: {
    fontSize: 10,
  },
  pressed: {
    opacity: 0.7,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 14,
  },
});

export default InstantHelpScreen;
