import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { AppText as Text } from '../../components/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { errands } from '../../constants/mock-data';
import { ErrandCard } from '../../components/home/ErrandCard';

const filters = ['All', 'Food', 'Printing', 'Library', 'Supplies'];

const ErrandsScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { Colors, Spacing, Radius, Shadow } = useTheme();
  const isFreelancer = user?.role === 'freelancer';

  const [selected, setSelected] = useState('All');

  const filtered = useMemo(() => {
    const scoped = isFreelancer
      ? errands
      : errands.filter((item) => item.ownerId === user?.id);

    if (selected === 'All') {
      return scoped;
    }
    return scoped.filter((item) => item.category === selected);
  }, [isFreelancer, selected, user?.id]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.background }]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.title}>{isFreelancer ? 'Find Errands' : 'My Errands'}</Text>

              {!isFreelancer && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Post Errand"
                  onPress={() => router.push('/errands/create')}
                  style={({ pressed }) => [
                    styles.postButton,
                    { backgroundColor: Colors.primary },
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.postText}>Post Errand</Text>
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
            timeAgo={item.timeAgo}
            onAccept={() => {}}
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
