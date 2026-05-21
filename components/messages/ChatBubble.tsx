import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText as Text } from '../ui/AppText';

import { Colors } from '../../constants/colors';
import { Radius, Spacing } from '../../constants/theme';

type ChatBubbleProps = {
  text: string;
  time: string;
  fromMe: boolean;
};

export const ChatBubble = ({ text, time, fromMe }: ChatBubbleProps) => {
  return (
    <View style={[styles.container, fromMe ? styles.me : styles.them]}>
      <Text style={[styles.text, fromMe ? styles.meText : styles.themText]}>{text}</Text>
      <Text style={[styles.time, fromMe ? styles.meTime : styles.themTime]}>{time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.sm,
    borderRadius: Radius.lg,
    maxWidth: '80%',
    marginBottom: Spacing.sm,
  },
  me: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
  },
  them: {
    backgroundColor: Colors.surfaceAlt,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 14,
  },
  meText: {
    color: Colors.white,
  },
  themText: {
    color: Colors.textPrimary,
  },
  time: {
    fontSize: 11,
    marginTop: Spacing.xs,
  },
  meTime: {
    color: Colors.primaryLight,
  },
  themTime: {
    color: Colors.textMuted,
  },
});
