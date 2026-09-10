import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LogementCard } from '@/components/LogementCard';
import { Theme } from '@/constants/theme';
import {
  BUDGET_FILTERS,
  LOGEMENT_TYPES,
  QUARTIER_FILTERS,
  logements as baseLogements,
  mailUrl,
  matchesBudgetFilter,
  matchesQuartierFilter,
  telUrl,
  whatsappUrl,
  type BudgetFilter,
  type Logement,
  type LogementType,
  type QuartierFilter,
} from '@/data/logements';
import { mergeLogements } from '@/lib/logementStorage';

type TypeFilter = 'Tous' | LogementType;

const TYPE_FILTERS: TypeFilter[] = ['Tous', ...LOGEMENT_TYPES];

async function openUrl(url: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Erreur', 'Ouverture impossible.');
  }
}

function promptContact(item: Logement) {
  const hasTel = !!item.contactTel?.trim();
  const hasWa = !!(item.whatsapp?.trim() || item.contactTel?.trim());
  const hasMail = !!item.contactEmail?.trim();
  const waNumber = item.whatsapp || item.contactTel;
  if (!hasTel && !hasMail && !hasWa) {
    Alert.alert('Contact', 'Ouvrez l’annonce source pour contacter l’annonceur.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Voir la source',
        onPress: () => item.sourceUrl && void openUrl(item.sourceUrl),
      },
    ]);
    return;
  }
  const buttons: Array<{
    text: string;
    style?: 'cancel' | 'destructive' | 'default';
    onPress?: () => void;
  }> = [{ text: 'Annuler', style: 'cancel' }];
  if (hasTel) {
    buttons.push({ text: 'Appeler', onPress: () => void openUrl(telUrl(item.contactTel!)) });
  }
  if (hasWa && waNumber) {
    buttons.push({
      text: 'WhatsApp',
      onPress: () =>
        void openUrl(
          whatsappUrl(
            waNumber,
            `Bonjour, je suis intéressé(e) par « ${item.titre} » (${item.quartier}).`
          )
        ),
    });
  }
  if (hasMail) {
    buttons.push({
      text: 'E-mail',
      onPress: () =>
        void openUrl(mailUrl(item.contactEmail!, `Demande logement — ${item.titre}`)),
    });
  }
  Alert.alert(
    'Contacter',
    [item.contactNom, item.contactTel, item.contactEmail].filter(Boolean).join(' · '),
    buttons
  );
}

export default function LogementListScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Logement[]>(baseLogements);
  const [query, setQuery] = useState('');
  const [budget, setBudget] = useState<BudgetFilter>('Tous');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('Tous');
  const [quartier, setQuartier] = useState<QuartierFilter>('Tous');

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      void mergeLogements(baseLogements).then((merged) => {
        if (alive) setItems(merged);
      });
      return () => {
        alive = false;
      };
    }, [])
  );

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((l) => {
      if (l.type === 'Catalogue' && typeFilter !== 'Tous') {
        // keep catalogue visible only when type = Tous or when searching catalogue keywords
      }
      if (!matchesBudgetFilter(budget, l.prix)) return false;
      if (typeFilter !== 'Tous' && l.type !== typeFilter) return false;
      if (!matchesQuartierFilter(quartier, l.quartier)) return false;
      if (!q) return true;
      return (
        (l.titre ?? '').toLowerCase().includes(q) ||
        (l.quartier ?? '').toLowerCase().includes(q) ||
        (l.type ?? '').toLowerCase().includes(q) ||
        (l.description ?? '').toLowerCase().includes(q) ||
        (l.sourceName ?? '').toLowerCase().includes(q) ||
        (l.contactNom ?? '').toLowerCase().includes(q)
      );
    });
  }, [items, query, budget, typeFilter, quartier]);

  return (
    <View style={styles.container}>
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={Theme.colors.muted} style={styles.searchIcon} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Quartier, titre, source…"
          placeholderTextColor={Theme.colors.muted}
          style={styles.search}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.primaryBtn}
          onPress={() => router.push('/(tabs)/logement/publier')}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.primaryBtnText}>Publier</Text>
        </Pressable>
        <Pressable
          style={styles.secondaryBtn}
          onPress={() => router.push('/(tabs)/logement/mes-annonces')}>
          <Ionicons name="person-outline" size={16} color={Theme.colors.primary} />
          <Text style={styles.secondaryBtnText}>Mes annonces</Text>
        </Pressable>
      </View>

      <Text style={styles.filterLabel}>Budget / mois</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}>
        {BUDGET_FILTERS.map((f) => {
          const active = f === budget;
          return (
            <Pressable
              key={f}
              onPress={() => setBudget(f)}
              style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

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
              style={[styles.chip, active && styles.chipActiveAlt]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={styles.filterLabel}>Quartier</Text>
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
              {data.length} annonce{data.length > 1 ? 's' : ''} · sources publiques · Abidjan
            </Text>
            <Text style={styles.disclaimerTop}>
              Annonces agrégées — vérifier et négocier sur la source. Attention arnaques / frais de
              visite.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="home-outline" size={40} color={Theme.colors.primary} />
            <Text style={styles.emptyTitle}>Aucune annonce trouvée</Text>
            <Text style={styles.emptySub}>
              Essayez un autre quartier, un autre budget, ou publiez la vôtre.
            </Text>
            <Pressable
              style={styles.emptyBtn}
              onPress={() => router.push('/(tabs)/logement/publier')}>
              <Text style={styles.emptyBtnText}>Publier une annonce</Text>
            </Pressable>
          </View>
        }
        ListFooterComponent={
          <Text style={styles.disclaimer}>
            Annonces agrégées — vérifier et négocier sur la source. Attention arnaques / frais de
            visite.
          </Text>
        }
        renderItem={({ item }) => (
          <LogementCard
            item={item}
            onPress={() => router.push(`/(tabs)/logement/${item.id}`)}
            onContact={() => promptContact(item)}
          />
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
    fontSize: 12,
    lineHeight: 17,
    marginBottom: Theme.spacing.sm,
  },
  disclaimer: {
    textAlign: 'center',
    color: Theme.colors.muted,
    fontSize: 12,
    marginTop: Theme.spacing.md,
    lineHeight: 18,
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
  emptyBtn: {
    marginTop: 16,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Theme.radius.sm,
  },
  emptyBtnText: { color: '#fff', fontWeight: '700' },
});
