import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';
import { Theme } from '@/constants/theme';
import { ProttectorLogo } from '@/components/ProttectorLogo';

type IconName = ComponentProps<typeof Ionicons>['name'];

function TabBarIcon({
  name,
  focusedName,
  color,
  focused,
}: {
  name: IconName;
  focusedName: IconName;
  color: ColorValue;
  focused: boolean;
}) {
  return <Ionicons name={focused ? focusedName : name} size={22} color={color as string} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: Theme.colors.muted,
        tabBarStyle: {
          backgroundColor: Theme.colors.card,
          borderTopColor: Theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerStyle: { backgroundColor: Theme.colors.card },
        headerTintColor: Theme.colors.primary,
        headerTitleStyle: { color: Theme.colors.text, fontWeight: '700' },
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home-outline" focusedName="home" color={color} focused={focused} />
          ),
          headerStyle: { backgroundColor: '#F97316' },
          headerTitle: () => <ProttectorLogo height={36} />,
        }}
      />
      <Tabs.Screen
        name="logement"
        options={{
          title: 'Logement',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="key-outline" focusedName="key" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="stages"
        options={{
          title: 'Stages',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="briefcase-outline"
              focusedName="briefcase"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="univs"
        options={{
          title: 'Univs',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="school-outline"
              focusedName="school"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="person-outline"
              focusedName="person"
              color={color}
              focused={focused}
            />
          ),
          headerTitle: 'Mon profil',
        }}
      />
    </Tabs>
  );
}
