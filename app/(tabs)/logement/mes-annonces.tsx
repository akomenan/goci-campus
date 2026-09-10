import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LogementCard } from '@/components/LogementCard';
import { Theme } from '@/constants/theme';
import { logements as baseLogements, type Logement } from '@/data/logements';
import { loadUserLogements } from '@/lib/logementStorage';

export default function MesAnnoncesScreen() {
  const router = useRouter();
  const [mine, setMine] = useState<Logement[]>([]);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      void (async () => {
        const user = await loadUserLogements();
        const fromBase = baseLogements.filter((l) => l.mine);
        const ids = new Set(user.map((l) => l.id));
        const merged = [...user, ...fromBase.filter((l) => !ids.has(l.id))];
        if (alive) setMine(merged);
      })();
      return () => {
        alive = false;
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      {mine.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="document-text-outline" size={40} color={Theme.colors.primary} />
          <Text style={styles.emptyTitle}>Pas encore d’annonce</Text>
          <Text style={styles.emptySub}>
            Publiez une chambre ou un studio : elle restera sur cet appareil et apparaîtra dans la
            liste.
          </Text>
          <Pressable
            style={styles.emptyBtn}
            onPress={() => router.push('/(tabs)/logement/publier')}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.emptyBtnText}>Publier</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={mine}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <Text style={styles.header}>
              {mine.length} annonce{mine.length > 1 ? 's' : ''} publiée
              {mine.length > 1 ? 's' : ''}
            </Text>
          }
          renderItem={({ item }) => (
            <LogementCard
              item={item}
              onPress={() => router.push(`/(tabs)/logement/${item.id}`)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  list: { padding: Theme.spacing.md },
  header: { color: Theme.colors.muted, marginBottom: Theme.spacing.sm, fontSize: 13 },
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
  },
  emptyBtnText: { color: '#fff', fontWeight: '700' },
});
