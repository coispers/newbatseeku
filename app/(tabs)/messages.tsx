import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { AppText as Text } from '../../components/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Colors } from '../../constants/colors';
import { chats } from '../../constants/mock-data';
import { Spacing } from '../../constants/theme';
import { ChatListItem } from '../../components/messages/ChatListItem';
import { SearchBar } from '../../components/ui/SearchBar';

const MessagesScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Messages</Text>
            <SearchBar placeholder="Search messages" onPress={() => {}} />
          </>
        }
        renderItem={({ item }) => (
          <ChatListItem
            name={item.name}
            message={item.lastMessage}
            time={item.time}
            unreadCount={item.unreadCount}
            avatar={item.avatar}
            onPress={() => router.push(`/chat/${item.id}`)}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
});

export default MessagesScreen;
