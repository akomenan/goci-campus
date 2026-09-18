import { useCallback, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { GlassButton } from '@/components/GlassButton';
import {
  loadAnnoncesForOwner,
  unpublishAnnonce,
  type AnnonceKind,
  type ObsoAnnonce,
} from '@/lib/obsoAnnonces';

const REASONS: Record<AnnonceKind, string[]> = {
  stage: ['Expiré', 'Reporté', 'Autres raisons'],
  logement: ['Indisponible', 'En négociation', 'Autres raisons'],
  ecole: ['Autres raisons'],
};

function titleFor(a: ObsoAnnonce): string {
  if (a.kind === 'logement') return a.typeLogement ? `${a.typeLogement} — ${a.quartier}` : 'Logement';
  if (a.kind === 'stage') return a.titre || 'Stage / Job';
  return a.nomEcole || 'École';
}

function kindLabel(k: AnnonceKind): string {
  if (k === 'logement') return 'Logement';
  if (k === 'stage') return 'Stage / Job';
  return 'École';
}

export default function MesAnnoncesScreen() {
  const { user } = useAuth();
  const [items, setItems] = useState<ObsoAnnonce[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState('');

  const reload = useCallback(() => {
    if (!user) return;
    void loadAnnoncesForOwner(user.id).then(setItems);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  async function confirmUnpublish(a: ObsoAnnonce, reason: string) {
    if (!user) return;
    const finalReason = reason === 'Autres raisons' ? customReason.trim() : reason;
    if (reason === 'Autres raisons' && !finalReason) {
      Alert.alert('Raison requise', 'Écris pourquoi tu dépublies.');
      return;
    }
    await unpublishAnnonce(a.id, user.id, finalReason);
    setOpenId(null);
    setCustomReason('');
    reload();
    Alert.alert('Dépublié', 'L’annonce n’est plus visible.');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Aucune annonce publiée</Text>
          <Text style={styles.emptyBody}>
            Utilise « PARTAGER UNE ANNONCE » sur ton profil pour en ajouter.
          </Text>
        </View>
      ) : (
        items.map((a) => (
          <View key={a.id} style={styles.card}>
            <Text style={styles.kind}>{kindLabel(a.kind)}</Text>
            <Text style={styles.title}>{titleFor(a)}</Text>
            {a.description ? (
              <Text style={styles.desc} numberOfLines={3}>
                {a.description}
              </Text>
            ) : null}
            <GlassButton
              label="Dépublier"
              variant="danger"
              onPress={() => {
                setCustomReason('');
                setOpenId(openId === a.id ? null : a.id);
              }}
              style={{ marginTop: 12 }}
            />
            {openId === a.id ? (
              <View style={styles.reasons}>
                <Text style={styles.reasonTitle}>Pourquoi dépublier ?</Text>
                {REASONS[a.kind].map((r) => (
                  <Pressable
                    key={r}
                    style={styles.reasonItem}
                    onPress={() => {
                      if (r === 'Autres raisons') {
                        // keep menu open for text
                        setCustomReason((prev) => prev);
                      } else {
                        void confirmUnpublish(a, r);
                      }
                    }}>
                    <Text style={styles.reasonText}>{r}</Text>
                  </Pressable>
                ))}
                {(a.kind === 'ecole' || true) && (
                  <>
                    <Text style={styles.label}>Précise (si « Autres raisons »)</Text>
                    <TextInput
                      style={styles.input}
                      value={customReason}
                      onChangeText={setCustomReason}
                      placeholder="Écris la raison…"
                      placeholderTextColor={Theme.colors.muted}
                    />
                    <GlassButton
                      label="Confirmer la dépublication"
                      variant="secondary"
                      onPress={() => void confirmUnpublish(a, 'Autres raisons')}
                      style={{ marginTop: 10 }}
                    />
                  </>
                )}
              </View>
            ) : null}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  content: { padding: Theme.spacing.md, paddingBottom: 40 },
  empty: { ...Theme.glass, borderRadius: Theme.radius.lg, padding: Theme.spacing.lg },
  emptyTitle: { fontWeight: '800', fontSize: 18, color: Theme.colors.text },
  emptyBody: { marginTop: 8, color: Theme.colors.muted, lineHeight: 20 },
  card: {
    ...Theme.glass,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  kind: { fontSize: 12, fontWeight: '800', color: Theme.colors.primary },
  title: { marginTop: 4, fontSize: 17, fontWeight: '800', color: Theme.colors.text },
  desc: { marginTop: 8, color: Theme.colors.muted, lineHeight: 20 },
  reasons: {
    marginTop: 12,
    borderRadius: Theme.radius.md,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.06)',
    padding: 12,
  },
  reasonTitle: { fontWeight: '800', marginBottom: 8, color: Theme.colors.text },
  reasonItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(15,23,42,0.06)',
  },
  reasonText: { fontWeight: '700', color: Theme.colors.text },
  label: { marginTop: 10, fontSize: 12, fontWeight: '700', color: Theme.colors.muted },
  input: {
    marginTop: 6,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Theme.colors.text,
  },
});
