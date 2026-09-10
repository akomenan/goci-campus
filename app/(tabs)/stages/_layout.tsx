import { Stack } from 'expo-router';
import { Theme } from '@/constants/theme';

export default function StagesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Theme.colors.card },
        headerTintColor: Theme.colors.primary,
        headerTitleStyle: { color: Theme.colors.text, fontWeight: '700' },
        contentStyle: { backgroundColor: Theme.colors.background },
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="index" options={{ title: 'Stages & jobs' }} />
      <Stack.Screen name="[id]" options={{ title: 'Détail offre' }} />
      <Stack.Screen name="postuler" options={{ title: 'Postuler' }} />
      <Stack.Screen name="publier" options={{ title: 'Publier une offre' }} />
      <Stack.Screen name="mes-candidatures" options={{ title: 'Mes candidatures' }} />
    </Stack>
  );
}
