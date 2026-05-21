import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';

const TabsLayout = () => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { theme, Colors } = useTheme();

  const isFreelancer = user?.role === 'freelancer';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.tabBarBorder,
          borderTopWidth: 0.5,
          height: 60 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
        },
        tabBarActiveTintColor: theme.tabActive,
        tabBarInactiveTintColor: Colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: isFreelancer ? 'Dashboard' : 'Home',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name={isFreelancer ? "stats-chart-outline" : "home-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: isFreelancer ? 'Tasks' : 'Services',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name={isFreelancer ? "clipboard-outline" : "grid-outline"} color={color} size={size} />
          ),
        }}
      />
      {user && user.role !== 'freelancer' && (
        <Tabs.Screen
          name="student-orders"
          options={{
            title: 'Orders',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="clipboard-outline" color={color} size={size} />
            ),
          }}
        />
      )}
      <Tabs.Screen
        name="errands"
        options={{
          title: 'Errands',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="bicycle-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="instant-help"
        options={{
          title: 'Find Help',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="location-outline" color={color} size={size} />,
          href: null,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="chatbubble-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="person-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

