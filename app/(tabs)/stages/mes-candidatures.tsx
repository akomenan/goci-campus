import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StageCard } from '@/components/StageCard';
import { Theme } from '@/constants/theme';
import {
  getOffreById,
  mesCandidatures as seedCandidatures,
  offres as baseOffres,
  type Candidature,
  type Offre,
} from '@/data/stages';
import { loadUserOffres, mergeCandidatures, mergeOffres } from '@/lib/stageStorage';

const statutColor: Record<string, string> = {
  Envoyée: Theme.colors.muted,
  'En cours': Theme.colors.primary,
  Entretien: Theme.colors.warning,
  Acceptée: Theme.colors.success,
  Refusée: Theme.colors.danger,
};

export default function MesCandidaturesScreen() {
  const router = useRouter();
  const [cands, setCands] = useState<Candidature[]>([]);
  const [allOffres, setAllOffres] = useState<Offre[]>(baseOffres);
  const [published, setPublished] = useState<Offre[]>([]);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      void (async () => {
        const [mergedOffres, mergedCands, userOffres] = await Promise.all([
          mergeOffres(baseOffres),
          mergeCandidatures(seedCandidatures),
          loadUserOffres(),
        ]);
        if (!alive) return;
        setAllOffres(mergedOffres);
        setCands(mergedCands);
        const fromBase = baseOffres.filter((o) => o.mine);
        const ids = new Set(userOffres.map((o) => o.id));
        setPublished([...userOffres, ...fromBase.filter((o) => !ids.has(o.id))]);
      })();
      return () => {
        alive = false;
      };
    }, [])
  );

  const emptyAll = cands.length === 0 && published.length === 0;

  if (emptyAll) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyBox}>
          <Ionicons name="document-text-outline" size={40} color={Theme.colors.primary} />
          <Text style={styles.emptyTitle}>Rien pour l’instant</Text>
          <Text style={styles.emptySub}>
            Postulez à une offre vérifiée ou publiez une annonce locale : tout reste sur cet
            appareil.
          </Text>
          <Pressable style={styles.emptyBtn} onPress={() => router.push('/(tabs)/stages')}>
            <Text style={styles.emptyBtnText}>Voir les offres</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.list}
      data={cands}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View>
          <Text style={styles.sectionTitle}>Mes candidatures ({cands.length})</Text>
          {cands.length === 0 ? (
            <Text style={styles.mutedBlock}>Aucune candidature enregistrée.</Text>
          ) : null}
        </View>
      }
      ListFooterComponent={
        <View style={styles.footerBlock}>
          <Text style={styles.sectionTitle}>Mes offres publiées ({published.length})</Text>
          {published.length === 0 ? (
            <View style={styles.emptyMini}>
              <Text style={styles.mutedBlock}>Pas encore d’offre publiée.</Text>
              <Pressable
                style={styles.emptyBtn}
                onPress={() => router.push('/(tabs)/stages/publier')}>
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.emptyBtnText}>Publier</Text>
              </Pressable>
            </View>
          ) : (
            published.map((item) => (
              <StageCard
                key={item.id}
                item={item}
                onPress={() => router.push(`/(tabs)/stages/${item.id}`)}
              />
            ))
          )}
          <Text style={styles.disclaimer}>
            Offres agrégées depuis sources publiques — vérifier sur le site d’origine.
          </Text>
        </View>
      }
      renderItem={({ item }) => {
        const offre = getOffreById(item.offreId, allOffres);
        const color = statutColor[item.statut] ?? Theme.colors.muted;
        return (
          <Pressable
            style={styles.card}
            onPress={() => offre && router.push(`/(tabs)/stages/${offre.id}`)}>
            <View style={styles.row}>
              <Text style={[styles.badge, { backgroundColor: color + '22', color }]}>
                {item.statut}
              </Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text style={styles.titre}>{offre?.titre ?? 'Offre'}</Text>
            <Text style={styles.entreprise}>{offre?.entreprise}</Text>
            <View style={styles.metaRow}>
              <Ionicons name="briefcase-outline" size={13} color={Theme.colors.muted} />
              <Text style={styles.meta}>
                {offre?.type} · {offre?.domaine} · {offre?.lieu}
              </Text>
            </View>
            {item.prenom || item.nom ? (
              <Text style={styles.candName}>
                {item.prenom} {item.nom}
              </Text>
            ) : null}
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  list: { padding: Theme.spacing.md, paddingBottom: 40 },
  sectionTitle: {
    color: Theme.colors.text,
    fontWeight: '800',
    fontSize: 15,
    marginBottom: Theme.spacing.sm,
    marginTop: 4,
  },
  mutedBlock: { color: Theme.colors.muted, marginBottom: Theme.spacing.md, fontSize: 13 },
  footerBlock: { marginTop: Theme.spacing.lg },
  emptyMini: { marginBottom: Theme.spacing.md },
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
  },
  date: { fontSize: 12, color: Theme.colors.muted },
  titre: { marginTop: 8, fontSize: 15, fontWeight: '800', color: Theme.colors.text },
  entreprise: { marginTop: 4, color: Theme.colors.primaryDark, fontWeight: '700' },
  metaRow: { marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta: { color: Theme.colors.muted, fontSize: 13, fontWeight: '600', flex: 1 },
  candName: { marginTop: 6, fontSize: 12, color: Theme.colors.muted, fontWeight: '600' },
  emptyBox: {
    margin: Theme.spacing.md,
    marginTop: 48,
    alignItems: 'center',
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  emptySub: {
    marginTop: 8,
    textAlign: 'center',
    color: Theme.colors.muted,
    lineHeight: 20,
    fontSize: 14,
  },
  emptyBtn: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Theme.radius.sm,
    alignSelf: 'flex-start',
  },
  emptyBtnText: { color: '#fff', fontWeight: '700' },
  disclaimer: {
    textAlign: 'center',
    color: Theme.colors.muted,
    fontSize: 11,
    marginTop: Theme.spacing.md,
    lineHeight: 16,
  },
});
