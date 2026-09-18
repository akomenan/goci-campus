import { Stack } from 'expo-router';
import { Theme } from '@/constants/theme';

export default function ProfilLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Theme.colors.cardSolid },
        headerTintColor: Theme.colors.primary,
        headerTitleStyle: { color: Theme.colors.text, fontWeight: '700' },
        contentStyle: { backgroundColor: Theme.colors.background },
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="index" options={{ title: 'Mon profil' }} />
      <Stack.Screen name="mes-annonces" options={{ title: 'Mes annonces' }} />
      <Stack.Screen name="publier-logement" options={{ title: 'Publier un logement' }} />
      <Stack.Screen name="publier-stage" options={{ title: 'Publier stage / job' }} />
      <Stack.Screen name="publier-ecole" options={{ title: 'Publier mon école' }} />
    </Stack>
  );
}
