import { useMemo, useState } from 'react';
import { FlatList, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { UniversityCard } from '@/components/UniversityCard';
import { Theme } from '@/constants/theme';
import {
  ORIENTATION_MESRS_URL,
  VILLE_FILTERS,
  matchesVilleFilter,
  resolveCategorie,
  universities,
  type UniversityCategorie,
  type UniversityType,
  type VilleFilter,
} from '@/data/universities';

type TypeFilter = 'Toutes' | 'Publique' | 'Privée';
type CatFilter = 'Toutes' | 'Universités' | 'Grandes écoles';

const TYPE_FILTERS: TypeFilter[] = ['Toutes', 'Publique', 'Privée'];
const CAT_FILTERS: CatFilter[] = ['Toutes', 'Universités', 'Grandes écoles'];

function matchesType(filter: TypeFilter, type: UniversityType): boolean {
  if (filter === 'Toutes') return true;
  if (filter === 'Publique') return type === 'publique';
  return type === 'privée';
}

function matchesCat(filter: CatFilter, cat: UniversityCategorie): boolean {
  if (filter === 'Toutes') return true;
  if (filter === 'Universités') return cat === 'universite';
  return cat === 'grande_ecole';
}

export default function UnivsListScreen() {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('Toutes');
  const [catFilter, setCatFilter] = useState<CatFilter>('Toutes');
  const [villeFilter, setVilleFilter] = useState<VilleFilter>('Toutes');
  const [query, setQuery] = useState('');

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return universities.filter((u) => {
      if (!matchesType(typeFilter, u.type)) return false;
      if (!matchesCat(catFilter, resolveCategorie(u))) return false;
      if (!matchesVilleFilter(villeFilter, u.ville)) return false;
      if (!q) return true;
      const inFilieres = (u.filieres ?? []).some((f) => f.toLowerCase().includes(q));
      return (
        (u.nom ?? '').toLowerCase().includes(q) ||
        (u.sigle ?? '').toLowerCase().includes(q) ||
        (u.ville ?? '').toLowerCase().includes(q) ||
        (u.adresse ?? '').toLowerCase().includes(q) ||
        inFilieres
      );
    });
  }, [typeFilter, catFilter, villeFilter, query]);

  return (
    <View style={styles.container}>
      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Rechercher nom, ville ou filière…"
          placeholderTextColor={Theme.colors.muted}
          style={styles.search}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.filters}>
        {TYPE_FILTERS.map((f) => {
          const active = f === typeFilter;
          return (
            <Pressable
              key={f}
              onPress={() => setTypeFilter(f)}
              style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.filters}>
        {CAT_FILTERS.map((f) => {
          const active = f === catFilter;
          return (
            <Pressable
              key={f}
              onPress={() => setCatFilter(f)}
              style={[styles.chip, active && styles.chipActiveAlt]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.villeRow}>
        <Text style={styles.villeLabel}>Ville</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.villeList}>
          {VILLE_FILTERS.map((item) => {
            const active = item === villeFilter;
            return (
              <Pressable
                key={item}
                onPress={() => setVilleFilter(item)}
                style={[styles.villeChip, active && styles.villeChipActive]}>
                <Text style={[styles.villeChipText, active && styles.villeChipTextActive]}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <Pressable
              style={styles.banner}
              onPress={() => void Linking.openURL(ORIENTATION_MESRS_URL)}>
              <Text style={styles.bannerTitle}>Orientation officielle bacheliers</Text>
              <Text style={styles.bannerSub}>bac.mesrs-ci.net · Ouvrir le portail MESRS</Text>
            </Pressable>
            <Text style={styles.count}>
              {data.length} établissement(s) · Nouveaux bacheliers
            </Text>
          </View>
        }
        ListFooterComponent={
          <Text style={styles.footerNote}>
            Liste non exhaustive — établissements connus / vérifiables. Vérifiez toujours sur
            bac.mesrs-ci.net
          </Text>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun résultat pour cette recherche.</Text>
        }
        renderItem={({ item }) => (
          <UniversityCard
            item={item}
            onPress={() => router.push(`/(tabs)/univs/${item.id}`)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  searchWrap: {
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.md,
  },
  search: {
    backgroundColor: Theme.colors.card,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Theme.colors.text,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.sm,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Theme.colors.card,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  chipActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  chipActiveAlt: {
    backgroundColor: Theme.colors.primaryDark,
    borderColor: Theme.colors.primaryDark,
  },
  chipText: { color: Theme.colors.muted, fontWeight: '700', fontSize: 13 },
  chipTextActive: { color: '#fff' },
  villeRow: { marginTop: 4, marginBottom: 4 },
  villeLabel: {
    paddingHorizontal: Theme.spacing.md,
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.muted,
    marginBottom: 6,
  },
  villeList: { paddingHorizontal: Theme.spacing.md, gap: 8 },
  villeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  villeChipActive: {
    backgroundColor: Theme.colors.primaryDark,
  },
  villeChipText: { color: Theme.colors.primaryDark, fontWeight: '700', fontSize: 12 },
  villeChipTextActive: { color: '#fff' },
  list: { paddingHorizontal: Theme.spacing.md, paddingBottom: 24 },
  banner: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  bannerTitle: { color: '#fff', fontWeight: '800', fontSize: 15 },
  bannerSub: { color: '#CCFBF1', marginTop: 4, fontSize: 12 },
  count: { color: Theme.colors.muted, marginBottom: Theme.spacing.sm, fontSize: 13 },
  empty: { color: Theme.colors.muted, textAlign: 'center', marginTop: 24 },
  footerNote: {
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
    textAlign: 'center',
    color: Theme.colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
