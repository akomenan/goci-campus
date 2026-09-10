import { Stack } from 'expo-router';
import { Theme } from '@/constants/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Theme.colors.card },
        headerTintColor: Theme.colors.primary,
        headerTitleStyle: { color: Theme.colors.text, fontWeight: '700' },
        contentStyle: { backgroundColor: Theme.colors.background },
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="login" options={{ title: 'Connexion', headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'Créer un compte' }} />
      <Stack.Screen name="register-choice" options={{ title: 'Créer un compte', headerShown: false }} />
      <Stack.Screen name="register-visiteur" options={{ title: 'Créer un compte', headerShown: false }} />
    </Stack>
  );
}
