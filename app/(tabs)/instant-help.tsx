import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { AppText as Text } from '../../components/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { freelancers } from '../../constants/mock-data';

const InstantHelpScreen = () => {
  const { user } = useAuth();
  const { Colors, Spacing, Radius, Shadow } = useTheme();
  
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [nearbyHelpers, setNearbyHelpers] = useState(freelancers);

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

      // Sort freelancers by their simulated distance (mock data)
      // In production, you'd calculate actual distance using coordinates
      const sortedHelpers = [...freelancers].sort((a, b) => {
        // Simulate distance calculation - mock data shows helpers in order
        return 0;
      });

      setNearbyHelpers(sortedHelpers);
      setErrorMsg(null);
    } catch (error) {
      console.log('Location error:', error);
      setErrorMsg('Could not get your location');
      setNearbyHelpers(freelancers);
    } finally {
      setLoading(false);
    }
  };

  const renderHelperCard = ({ item }: { item: typeof freelancers[0] }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: Colors.card,
          borderColor: Colors.border,
          ...Shadow.md,
        },
      ]}
    >
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          {item.isOnline && (
            <View style={[styles.onlineBadge, { backgroundColor: Colors.success }]}>
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
          <ActivityIndicator size="large" color={Colors.primary} />
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
                  {location ? 'Showing helpers near you' : 'Showing all available helpers'}
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
