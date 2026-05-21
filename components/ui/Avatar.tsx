import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { AppText as Text } from './AppText';

import { Colors } from '../../constants/colors';
import { Radius } from '../../constants/theme';

type AvatarProps = {
  initials: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export const Avatar = ({ initials, size = 48, style, textStyle }: AvatarProps) => {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }, style]}>
      <Text style={[styles.text, { fontSize: size / 2.4 }, textStyle]}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
  },
  text: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});

