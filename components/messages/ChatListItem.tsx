import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText as Text } from '../ui/AppText';

import { Colors } from '../../constants/colors';
import { Radius, Spacing } from '../../constants/theme';
import { Avatar } from '../ui/Avatar';

type ChatListItemProps = {
  name: string;
  message: string;
  time: string;
  unreadCount: number;
  avatar: string;
  onPress: () => void;
};

export const ChatListItem = ({ name, message, time, unreadCount, avatar, onPress }: ChatListItemProps) => {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open chat with ${name}`}
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <Avatar initials={avatar} size={48} />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.message} numberOfLines={1}>{message}</Text>
          {unreadCount > 0 && (
            <View style={styles.unread}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  time: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  message: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    flex: 1,
    marginRight: Spacing.sm,
  },
  unread: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  unreadText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});
