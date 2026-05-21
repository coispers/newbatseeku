import React from 'react';
import { Text as RNText, TextProps } from 'react-native';

export const AppText = ({ style, ...props }: TextProps) => {
  return <RNText {...props} style={[{ fontFamily: 'Inter_400Regular' }, style]} />;
};
