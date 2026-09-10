import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/theme';
import { colorForOffreType, iconForOffreType, type Offre } from '@/data/stages';

function VerifiedCheck() {
  return (
    <View style={styles.checkPill} accessibilityLabel="Vérifié">
      <Ionicons name="checkmark" size={11} color="#FFFFFF" />
    </View>
  );
}

export function StageCard({ item, onPress }: { item: Offre; onPress: () => void }) {
  const accent = item.accent || colorForOffreType(item.type);
  const icon = iconForOffreType(item.type) as keyof typeof Ionicons.glyphMap;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.92, transform: [{ scale: 0.995 }] },
      ]}>
      <View style={[styles.thumb, { backgroundColor: accent + '22' }]}>
        <View style={[styles.thumbInner, { backgroundColor: accent }]}>
          <Ionicons name={icon} size={26} color="#FFFFFF" />
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.badges}>
          <Text style={[styles.typeBadge, { color: accent, backgroundColor: accent + '18' }]}>
            {item.type}
          </Text>
          <Text style={styles.domaineBadge}>{item.domaine}</Text>
          {item.mine ? <Text style={styles.mineChip}>Ma publ.</Text> : null}
          {item.expiree ? <Text style={styles.expireChip}>Expirée</Text> : null}
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.titre} numberOfLines={2}>
            {item.titre}
          </Text>
          {item.verifie ? <VerifiedCheck /> : null}
        </View>

        <Text style={styles.entreprise} numberOfLines={1}>
          {item.entreprise}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Ionicons name="location-outline" size={13} color={Theme.colors.muted} />
            <Text style={styles.metaText} numberOfLines={1}>
              {item.quartier || item.lieu}
            </Text>
          </View>
        </View>

        {item.remuneration ? (
          <Text style={styles.remu} numberOfLines={1}>
            {item.remuneration}
          </Text>
        ) : null}

        <Text style={styles.source} numberOfLines={1}>
          Source · {item.sourceName}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md + 2,
    marginBottom: Theme.spacing.sm + 2,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    gap: 12,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: Theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  typeBadge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
  },
  domaineBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: Theme.colors.muted,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
  },
  mineChip: {
    fontSize: 10,
    fontWeight: '800',
    color: Theme.colors.primaryDark,
    backgroundColor: Theme.colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
  },
  expireChip: {
    fontSize: 10,
    fontWeight: '800',
    color: Theme.colors.danger,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
  },
  titleRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titre: {
    flex: 1,
    flexShrink: 1,
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.text,
    letterSpacing: -0.2,
  },
  checkPill: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  entreprise: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.primaryDark,
  },
  metaRow: { marginTop: 8, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    maxWidth: '100%',
  },
  metaText: { fontSize: 12, fontWeight: '600', color: Theme.colors.muted, flexShrink: 1 },
  remu: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '800',
    color: Theme.colors.primaryDark,
  },
  source: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '600',
    color: Theme.colors.muted,
  },
});
