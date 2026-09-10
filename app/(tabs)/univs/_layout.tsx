import { Stack } from 'expo-router';
import { Theme } from '@/constants/theme';

export default function UnivsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Theme.colors.card },
        headerTintColor: Theme.colors.primary,
        headerTitleStyle: { color: Theme.colors.text, fontWeight: '700' },
        contentStyle: { backgroundColor: Theme.colors.background },
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="index" options={{ title: 'Universités' }} />
      <Stack.Screen name="[id]" options={{ title: 'Détail université' }} />
    </Stack>
  );
}
