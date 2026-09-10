import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StageCard } from '@/components/StageCard';
import { Theme } from '@/constants/theme';
import {
  DOMAINE_FILTERS,
  OFFRE_TYPES,
  QUARTIER_FILTERS,
  matchesDomaineFilter,
  matchesQuartierFilter,
  offres as baseOffres,
  type DomaineFilter,
  type Offre,
  type OffreType,
  type QuartierFilter,
} from '@/data/stages';
import { mergeOffres } from '@/lib/stageStorage';

type TypeFilter = 'Tous' | OffreType;
const TYPE_FILTERS: TypeFilter[] = ['Tous', ...OFFRE_TYPES];

export default function StagesListScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Offre[]>(baseOffres);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('Tous');
  const [domaine, setDomaine] = useState<DomaineFilter>('Tous');
  const [quartier, setQuartier] = useState<QuartierFilter>('Tous');

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      void mergeOffres(baseOffres).then((merged) => {
        if (alive) setItems(merged);
      });
      return () => {
        alive = false;
      };
    }, [])
  );

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((o) => {
      if (o.expiree) return false;
      if (typeFilter !== 'Tous' && o.type !== typeFilter) return false;
      if (!matchesDomaineFilter(domaine, o.domaine)) return false;
      if (!matchesQuartierFilter(quartier, o.quartier, o.lieu)) return false;
      if (!q) return true;
      return (
        (o.titre ?? '').toLowerCase().includes(q) ||
        (o.entreprise ?? '').toLowerCase().includes(q) ||
        (o.lieu ?? '').toLowerCase().includes(q) ||
        (o.domaine ?? '').toLowerCase().includes(q) ||
        (o.quartier ?? '').toLowerCase().includes(q) ||
        (o.type ?? '').toLowerCase().includes(q) ||
        (o.description ?? '').toLowerCase().includes(q) ||
        (o.sourceName ?? '').toLowerCase().includes(q)
      );
    });
  }, [items, query, typeFilter, domaine, quartier]);

  return (
    <View style={styles.container}>
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={Theme.colors.muted} style={styles.searchIcon} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Titre, entreprise, domaine…"
          placeholderTextColor={Theme.colors.muted}
          style={styles.search}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.primaryBtn}
          onPress={() => router.push('/(tabs)/stages/publier')}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.primaryBtnText}>Publier</Text>
        </Pressable>
        <Pressable
          style={styles.secondaryBtn}
          onPress={() => router.push('/(tabs)/stages/mes-candidatures')}>
          <Ionicons name="document-text-outline" size={16} color={Theme.colors.primary} />
          <Text style={styles.secondaryBtnText}>Mes candidatures</Text>
        </Pressable>
      </View>

      <Text style={styles.filterLabel}>Type</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}>
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
      </ScrollView>

      <Text style={styles.filterLabel}>Domaine</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}>
        {DOMAINE_FILTERS.map((f) => {
          const active = f === domaine;
          return (
            <Pressable
              key={f}
              onPress={() => setDomaine(f)}
              style={[styles.chip, active && styles.chipActiveAlt]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={styles.filterLabel}>Quartier / zone</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}>
        {QUARTIER_FILTERS.map((f) => {
          const active = f === quartier;
          return (
            <Pressable
              key={f}
              onPress={() => setQuartier(f)}
              style={[styles.villeChip, active && styles.villeChipActive]}>
              <Text style={[styles.villeChipText, active && styles.villeChipTextActive]}>{f}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <Text style={styles.count}>
              {data.length} offre{data.length > 1 ? 's' : ''} · sources publiques · CI
            </Text>
            <Text style={styles.disclaimerTop}>
              Offres agrégées depuis sources publiques — vérifier sur le site d’origine.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="briefcase-outline" size={40} color={Theme.colors.primary} />
            <Text style={styles.emptyTitle}>Aucune offre trouvée</Text>
            <Text style={styles.emptySub}>
              Essayez un autre type, domaine ou quartier — ou publiez une annonce locale.
            </Text>
          </View>
        }
        ListFooterComponent={
          <Text style={styles.disclaimer}>
            Offres agrégées depuis sources publiques — vérifier sur le site d’origine.
          </Text>
        }
        renderItem={({ item }) => (
          <StageCard item={item} onPress={() => router.push(`/(tabs)/stages/${item.id}`)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  searchWrap: {
    marginHorizontal: Theme.spacing.md,
    marginTop: Theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radius.md,
    paddingHorizontal: 12,
  },
  searchIcon: { marginRight: 6 },
  search: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: Theme.colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.sm,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Theme.radius.sm,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Theme.colors.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Theme.radius.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  secondaryBtnText: { color: Theme.colors.primary, fontWeight: '700' },
  filterLabel: {
    paddingHorizontal: Theme.spacing.md,
    marginTop: Theme.spacing.sm,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.muted,
  },
  chipRow: { paddingHorizontal: Theme.spacing.md, gap: 8, paddingBottom: 2 },
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
  villeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Theme.colors.primarySoft,
  },
  villeChipActive: { backgroundColor: Theme.colors.primaryDark },
  villeChipText: { color: Theme.colors.primaryDark, fontWeight: '700', fontSize: 12 },
  villeChipTextActive: { color: '#fff' },
  list: { paddingHorizontal: Theme.spacing.md, paddingBottom: 28, paddingTop: 8 },
  count: { color: Theme.colors.muted, marginBottom: 4, fontSize: 13 },
  disclaimerTop: {
    color: Theme.colors.muted,
    fontSize: 11,
    marginBottom: Theme.spacing.sm,
    lineHeight: 16,
  },
  disclaimer: {
    textAlign: 'center',
    color: Theme.colors.muted,
    fontSize: 11,
    marginTop: Theme.spacing.md,
    marginBottom: 8,
    lineHeight: 16,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginTop: 8,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  emptySub: {
    marginTop: 6,
    textAlign: 'center',
    color: Theme.colors.muted,
    lineHeight: 20,
    fontSize: 14,
  },
});
