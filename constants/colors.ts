// BatStateU official brand colors
// Maroon = Student role  |  Gold = Freelancer role

export const BatStateUColors = {
  maroon: '#8B0000',
  maroonDark: '#6B0000',
  maroonLight: '#FDECEA',
  maroonMid: '#A31621',

  gold: '#B8860B',
  goldDark: '#8B6914',
  goldLight: '#FEF9C3',
  goldMid: '#D4A017',
  goldSurface: '#FFFBEB',

  white: '#FFFFFF',
  surface: '#F7F7F8',
  surfaceAlt: '#F0F0F2',
  border: '#E5E5E7',

  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textMuted: '#9A9A9A',

  verified: '#16A34A',
  verifiedBg: '#DCFCE7',
  error: '#DC2626',
  errorBg: '#FEE2E2',
};

export const StudentTheme = {
  primary: BatStateUColors.maroon,
  primaryDark: BatStateUColors.maroonDark,
  primaryLight: BatStateUColors.maroonLight,
  tabActive: BatStateUColors.maroon,
  tabBar: '#FFFFFF',
  tabBarBorder: '#E5E5E7',
  headerBg: '#FFFFFF',
  headerBorder: '#F0F0F2',
  avatarBg: BatStateUColors.maroonLight,
  avatarText: BatStateUColors.maroonDark,
  cardBg: '#FFFFFF',
  surfaceBg: '#F7F7F8',
  ctaText: '#FFFFFF',
};

export const FreelancerTheme = {
  primary: BatStateUColors.gold,
  primaryDark: BatStateUColors.goldDark,
  primaryLight: BatStateUColors.goldLight,
  tabActive: BatStateUColors.goldDark,
  tabBar: BatStateUColors.goldSurface,
  tabBarBorder: '#E8DDA8',
  headerBg: BatStateUColors.goldSurface,
  headerBorder: '#EDE8C8',
  avatarBg: BatStateUColors.goldLight,
  avatarText: BatStateUColors.goldDark,
  cardBg: '#FFFFFF',
  surfaceBg: '#FFFDF0',
  ctaText: '#FFFFFF',
};

// Keep full compatibility for files statically importing 'Colors'
export const Colors = {
  primary: BatStateUColors.maroonMid,
  primaryDark: BatStateUColors.maroonDark,
  primaryLight: BatStateUColors.maroonLight,
  background: BatStateUColors.white,
  surface: BatStateUColors.surface,
  surfaceAlt: BatStateUColors.surfaceAlt,
  border: BatStateUColors.border,
  textPrimary: BatStateUColors.textPrimary,
  textSecondary: BatStateUColors.textSecondary,
  textMuted: BatStateUColors.textMuted,
  verified: BatStateUColors.verified,
  verifiedBg: BatStateUColors.verifiedBg,
  gold: BatStateUColors.gold,
  goldBg: BatStateUColors.goldLight,
  white: BatStateUColors.white,
  error: BatStateUColors.error,
  errorBg: BatStateUColors.errorBg,
};

