import { useAuth } from './useAuth';
import { BatStateUColors, StudentTheme, FreelancerTheme } from '../constants/colors';
import { Radius, Shadow, Spacing } from '../constants/theme';

export const useTheme = () => {
  const { user } = useAuth();
  const role = user?.role === 'freelancer' ? 'freelancer' : 'student';
  const theme = role === 'freelancer' ? FreelancerTheme : StudentTheme;

  const dynamicColors = {
    ...BatStateUColors,
    primary: theme.primary,
    primaryDark: theme.primaryDark,
    primaryLight: theme.primaryLight,
    background: theme.surfaceBg,
  };

  return {
    Colors: dynamicColors,
    theme,
    Radius,
    Shadow,
    Spacing,
  };
};

