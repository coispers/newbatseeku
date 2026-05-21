import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { AppText as Text } from '../../components/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Colors } from '../../constants/colors';
import { chats, messages } from '../../constants/mock-data';
import { useOrders } from '../../hooks/useOrders';
import { useAuth } from '../../hooks/useAuth';
import { Radius, Shadow, Spacing } from '../../constants/theme';
import { Avatar } from '../../components/ui/Avatar';
import { ChatBubble } from '../../components/messages/ChatBubble';

const TypingIndicator = () => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(anim, { toValue: 1, duration: 1200, useNativeDriver: true })
    ).start();
  }, [anim]);

  const dotStyle = (index: number) => ({
    opacity: anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 1, 0.3],
      extrapolate: 'clamp',
    }),
    transform: [{
      translateY: anim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, -2 * (index + 1) * 0.1, 0],
      }),
    }],
  });

  return (
    <View style={styles.typingRow}>
      {[0, 1, 2].map((index) => (
        <Animated.View key={index} style={[styles.typingDot, dotStyle(index)]} />
      ))}
    </View>
  );
};

const ChatScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [input, setInput] = useState('');
  const [showContext, setShowContext] = useState(true);

  const chat = chats.find((item) => item.id === id) || chats[0];
  const chatMessages = useMemo(() => messages.filter((item) => item.chatId === chat.id), [chat.id]);
  const { orders } = useOrders();
  const { user } = useAuth();

  const relatedOrder = useMemo(() => {
    // Try to find an active order involving the chat participant and the current user
    return orders.find((o) =>
      ((o.requesterName === chat.name && o.freelancerName === user?.name) ||
        (o.freelancerName === chat.name && o.requesterName === user?.name))
    );
  }, [orders, chat.name, user?.name]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Ionicons name="chevron-back" size={20} color={Colors.textPrimary} />
        </Pressable>
        <Avatar initials={chat.avatar} size={40} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{chat.name}</Text>
          <Text style={styles.headerStatus}>{chat.isOnline ? 'Online' : 'Offline'}</Text>
        </View>
      </View>

      {showContext ? (
        relatedOrder ? (
          <View style={styles.contextBar}>
            <View>
              <Text style={styles.contextText}>{relatedOrder.title}</Text>
              <Text style={styles.contextPillText}>{relatedOrder.status}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View order progress"
              onPress={() => router.push(`/order/${relatedOrder.id}`)}
              style={({ pressed }) => [styles.progressButton, pressed && styles.pressed]}
            >
              <Text style={styles.contextPillText}>Progress</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Hide service context"
            onPress={() => setShowContext(false)}
            style={({ pressed }) => [styles.contextBar, pressed && styles.pressed]}
          >
            <Text style={styles.contextText}>Service: Programming Assistance</Text>
            <View style={styles.contextPill}>
              <Text style={styles.contextPillText}>Active</Text>
            </View>
          </Pressable>
        )
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Show service context"
          onPress={() => setShowContext(true)}
          style={({ pressed }) => [styles.contextCollapsed, pressed && styles.pressed]}
        >
          <Text style={styles.contextCollapsedText}>Show service details</Text>
        </Pressable>
      )}

      <FlatList
        data={chatMessages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messages}
        renderItem={({ item }) => (
          <ChatBubble text={item.text} time={item.time} fromMe={item.fromMe} />
        )}
        ListFooterComponent={<TypingIndicator />}
      />

      <View style={styles.inputBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Attach"
          onPress={() => {}}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <Ionicons name="attach" size={18} color={Colors.textMuted} />
        </Pressable>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          placeholderTextColor={Colors.textMuted}
          value={input}
          onChangeText={setInput}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Send"
          onPress={() => setInput('')}
          style={({ pressed }) => [styles.sendButton, pressed && styles.pressed]}
        >
          <Ionicons name="send" size={16} color={Colors.white} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  headerStatus: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  contextBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
  },
  contextCollapsed: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
  },
  contextCollapsedText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  contextText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  contextPill: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  contextPillText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
  },
  messages: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  typingRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textMuted,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    marginHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});

export default ChatScreen;
