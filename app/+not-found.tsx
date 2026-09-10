import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Introuvable' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Cette page n'existe pas.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Retour a l'accueil</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Theme.colors.background,
  },
  title: { fontSize: 18, fontWeight: '700', color: Theme.colors.text },
  link: { marginTop: 16, paddingVertical: 12 },
  linkText: { fontSize: 15, color: Theme.colors.primary, fontWeight: '700' },
});
