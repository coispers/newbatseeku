import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText as Text } from '../ui/AppText';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../hooks/useTheme';
import { Radius, Shadow, Spacing } from '../../constants/theme';
import { TrustBadge } from '../ui/TrustBadge';
import { Avatar } from '../ui/Avatar';
import { ReputationScore } from '../ui/ReputationScore';

type FreelancerCardProps = {
  name: string;
  subject: string;
  rating: number;
  price: number;
  isOnline: boolean;
  isVerified: boolean;
  reputationScore: number;
  onPress: () => void;
  avatar: string;
};

export const FreelancerCard = ({
  name,
  subject,
  rating,
  price,
  isOnline,
  isVerified,
  reputationScore,
  onPress,
  avatar,
}: FreelancerCardProps) => {
  const { Colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${name}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Avatar initials={avatar} size={48} />
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      <Text style={styles.subject} numberOfLines={1}>{subject}</Text>
      <View style={styles.row}>
        <Ionicons name="star" size={14} color="#1A5C38" />
        <Text style={styles.rating}>{rating.toFixed(1)}</Text>
      </View>
      
      {/* Price with primary brand color accent */}
      <Text style={[styles.price, { color: Colors.primary }]}>₱{price}/hr</Text>
      
      <View style={styles.footer}>
        <View style={styles.statusRow}>
          {isOnline && <View style={styles.onlineDot} />}
          {isVerified && <TrustBadge type="verified" />}
        </View>
        
        {/* REQUEST CTA BUTTON */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Request service from ${name}`}
          style={({ pressed }) => [
            styles.requestBtn,
            { backgroundColor: Colors.primary },
            pressed && styles.pressed,
          ]}
          onPress={(e) => {
            e.stopPropagation();
            onPress();
          }}
        >
          <Text style={styles.requestBtnText}>Request</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 245,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    padding: Spacing.sm,
    marginRight: Spacing.md,
    alignItems: 'flex-start',
    ...(Shadow || {}),
  },
  name: {
    marginTop: Spacing.sm,
    fontWeight: '600',
    color: '#1A1A1A',
    fontSize: 14,
  },
  subject: {
    color: '#6B6B6B',
    fontSize: 12,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  rating: {
    fontSize: 12,
    color: '#6B6B6B',
  },
  price: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  footer: {
    width: '100%',
    gap: 4,
    marginTop: 'auto',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  requestBtn: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: Radius.md,
    marginTop: 6,
  },
  requestBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});

