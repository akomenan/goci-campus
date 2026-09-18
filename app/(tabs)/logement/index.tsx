import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/theme';

export default function LogementListScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>Logement — bientôt</Text>
        <Text style={styles.body}>
          Les annonces arriveront quand on aura contacté des propriétaires et vérifié les
          offres. Pour l’instant, cette partie est vide exprès : pas de fausses chambres.
        </Text>
        <Text style={styles.note}>
          Objectif : t’aider à trouver un toit près du campus, en confiance.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  content: { padding: Theme.spacing.md, paddingBottom: 40 },
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  title: { fontSize: 20, fontWeight: '800', color: Theme.colors.text },
  body: { marginTop: 12, fontSize: 15, lineHeight: 22, color: Theme.colors.muted },
  note: { marginTop: 16, fontSize: 14, fontWeight: '600', color: Theme.colors.primary },
});
