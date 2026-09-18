import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ShortcutButton } from '@/components/ShortcutButton';
import { Theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { roleBadge } from '@/data/profile';
import { universities } from '@/data/universities';

const SECTIONS = ['Opportunités', 'Rentrée & cours', 'Briefs techno', 'Briefs finances'];

export default function AccueilScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const prenom = user?.prenom ?? 'ami';
  const badge = roleBadge(user);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <Text style={styles.greeting}>Bonjour, {prenom}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{badge}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.section}>Accueil</Text>
      {SECTIONS.map((titre) => (
        <View key={titre} style={styles.card}>
          <Text style={styles.cardTitle}>{titre}</Text>
        </View>
      ))}

      <Text style={styles.section}>Annuaire</Text>
      <ShortcutButton
        emoji="🎓"
        label="Univs / Bacheliers"
        subtitle={`${universities.length} établissements`}
        onPress={() => router.push('/(tabs)/univs')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  content: { padding: Theme.spacing.md, paddingBottom: 40 },
  hero: {
    ...Theme.glass,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  greeting: { fontSize: 22, fontWeight: '800', color: Theme.colors.text, flex: 1 },
  roleBadge: {
    backgroundColor: Theme.colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  roleBadgeText: { fontWeight: '800', fontSize: 12, color: Theme.colors.primaryDark },
  section: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: 10,
    marginTop: 8,
  },
  card: {
    ...Theme.glass,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    marginBottom: 10,
  },
  cardTitle: { fontWeight: '800', fontSize: 15, color: Theme.colors.text },
});
