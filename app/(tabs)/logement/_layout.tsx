import { Stack } from 'expo-router';
import { Theme } from '@/constants/theme';

export default function LogementLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Theme.colors.card },
        headerTintColor: Theme.colors.primary,
        headerTitleStyle: { color: Theme.colors.text, fontWeight: '700' },
        contentStyle: { backgroundColor: Theme.colors.background },
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="index" options={{ title: 'Logement' }} />
      <Stack.Screen name="[id]" options={{ title: 'Détail logement' }} />
      <Stack.Screen name="publier" options={{ title: 'Publier une annonce' }} />
      <Stack.Screen name="mes-annonces" options={{ title: 'Mes annonces' }} />
    </Stack>
  );
}
