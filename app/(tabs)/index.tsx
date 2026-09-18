import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ShortcutButton } from '@/components/ShortcutButton';
import { Theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { resolveRole } from '@/data/profile';
import { universities } from '@/data/universities';

type InfoBlock = {
  titre: string;
  texte: string;
};

const SECTIONS: InfoBlock[] = [
  {
    titre: 'Opportunités',
    texte:
      'Bourses, programmes, événements utiles aux étudiants et bacheliers en Côte d’Ivoire — avec pourquoi ça vaut le coup et comment postuler.',
  },
  {
    titre: 'Rentrée & cours',
    texte:
      'Dates de début des cours, calendriers utiles et rappels pour bien démarrer l’année.',
  },
  {
    titre: 'Briefs techno',
    texte:
      'Petits points clairs sur la tech (outils, tendances) pour rester à jour sans jargon inutile.',
  },
  {
    titre: 'Briefs finances',
    texte:
      'Astuces budget étudiant, paiements, et pistes concrètes pour mieux gérer son argent.',
  },
];

export default function AccueilScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const prenom = user?.prenom ?? 'ami';
  const role = resolveRole(user);
  const roleBadge = role === 'visiteur' ? 'Visiteur' : 'Étudiant';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <Text style={styles.greeting}>Bonjour, {prenom} 👋</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{roleBadge}</Text>
          </View>
        </View>
        <Text style={styles.sub}>Vie étudiante en Côte d’Ivoire</Text>
      </View>

      <Text style={styles.section}>Accueil — infos utiles</Text>
      <Text style={styles.lead}>
        Ici tu trouveras bientôt des infos sur la vie étudiante ivoirienne : opportunités,
        début des cours, briefs techno et finances — avec le « pourquoi c’est bon pour toi »
        et comment te préparer ou postuler.
      </Text>

      {SECTIONS.map((s) => (
        <View key={s.titre} style={styles.card}>
          <Text style={styles.cardTitle}>{s.titre}</Text>
          <Text style={styles.cardBody}>{s.texte}</Text>
          <Text style={styles.soon}>Contenu à venir</Text>
        </View>
      ))}

      <Text style={styles.section}>Annuaire</Text>
      <ShortcutButton
        emoji="🎓"
        label="Univs / Bacheliers"
        subtitle={`${universities.length} établissements`}
        onPress={() => router.push('/(tabs)/univs')}
      />

      <Text style={styles.footer}>Goci Campus · Côte d&apos;Ivoire</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  content: { padding: Theme.spacing.md, paddingBottom: 40 },
  hero: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
  },
  greeting: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', flexShrink: 1 },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  roleBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  sub: { marginTop: 8, color: 'rgba(255,255,255,0.9)', fontSize: 14 },
  section: {
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  lead: {
    color: Theme.colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: Theme.spacing.sm,
  },
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Theme.colors.text },
  cardBody: { marginTop: 6, fontSize: 14, color: Theme.colors.muted, lineHeight: 20 },
  soon: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  footer: {
    marginTop: Theme.spacing.xl,
    textAlign: 'center',
    color: Theme.colors.muted,
    fontSize: 12,
  },
});
