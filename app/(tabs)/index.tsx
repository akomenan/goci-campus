import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AlertCard } from '@/components/AlertCard';
import { ShortcutButton } from '@/components/ShortcutButton';
import { TodoItemRow } from '@/components/TodoItem';
import { Theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { resolveRole } from '@/data/profile';
import { alerts } from '@/data/alerts';
import { todos } from '@/data/todos';
import { universities } from '@/data/universities';

export default function AccueilScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const prenom = user?.prenom ?? 'ami';
  const role = resolveRole(user);
  const filiere = user?.filiere ?? '';
  const niveau = user?.niveau ?? '';
  const ville = user?.ville ?? '';
  const roleBadge = role === 'visiteur' ? 'Visiteur' : 'Étudiant';
  const subParts =
    role === 'etudiant'
      ? [filiere, niveau, ville]
      : [
          user?.visiteurType === 'bachelier'
            ? 'Bachelier'
            : user?.visiteurType === 'particulier'
              ? 'Particulier'
              : '',
          ville,
        ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <Text style={styles.greeting}>Bonjour, {prenom} 👋</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{roleBadge}</Text>
          </View>
        </View>
        <Text style={styles.sub}>
          {subParts.filter(Boolean).join(' · ')}
        </Text>
      </View>

      <Text style={styles.section}>Alertes & échéances</Text>
      {alerts.map((a) => (
        <AlertCard key={a.id} item={a} />
      ))}

      <Text style={styles.section}>Raccourcis</Text>
      <ShortcutButton
        emoji="🎓"
        label="Univs / Bacheliers"
        subtitle={`${universities.length} établissements — annuaire nouveaux bacheliers`}
        onPress={() => router.push('/(tabs)/univs')}
      />
      <ShortcutButton
        emoji="🔑"
        label="Logement"
        subtitle="Trouver une chambre près du campus"
        onPress={() => router.push('/(tabs)/logement')}
      />
      <ShortcutButton
        emoji="💼"
        label="Stages & jobs"
        subtitle="Stages, jobs étudiants et alternances"
        onPress={() => router.push('/(tabs)/stages')}
      />

      <Text style={styles.section}>À faire</Text>
      <View style={styles.todoCard}>
        {todos.map((t) => (
          <TodoItemRow key={t.id} item={t} />
        ))}
      </View>

      <Text style={styles.footer}>Goci Campus · Côte d&apos;Ivoire · Prototype MVP</Text>
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
  greeting: { color: '#fff', fontSize: 24, fontWeight: '800', flexShrink: 1 },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  roleBadgeText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  sub: { color: '#CCFBF1', marginTop: 6, fontSize: 14 },
  section: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
    marginTop: Theme.spacing.md,
  },
  todoCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.md,
    paddingHorizontal: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  footer: {
    textAlign: 'center',
    color: Theme.colors.muted,
    fontSize: 12,
    marginTop: Theme.spacing.xl,
  },
});
