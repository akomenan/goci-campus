import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/theme';
import { formatPrix, iconForType, type Logement } from '@/data/logements';

function VerifiedCheck() {
  return (
    <View style={styles.checkPill} accessibilityLabel="Vérifié">
      <Ionicons name="checkmark" size={11} color="#FFFFFF" />
    </View>
  );
}

export function LogementCard({
  item,
  onPress,
  onContact,
}: {
  item: Logement;
  onPress: () => void;
  onContact?: () => void;
}) {
  const accent = item.accent || Theme.colors.primary;
  const icon = iconForType(item.type) as keyof typeof Ionicons.glyphMap;
  const hasContact = !!(
    item.contactTel?.trim() ||
    item.whatsapp?.trim() ||
    item.contactEmail?.trim()
  );

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
            {item.type ?? 'Logement'}
          </Text>
          {item.sourceName ? (
            <Text style={styles.sourceBadge}>Source · {item.sourceName}</Text>
          ) : null}
          {!item.disponible ? (
            <Text style={styles.indispo}>Indisponible</Text>
          ) : item.mine ? (
            <Text style={styles.mineChip}>Ma publ.</Text>
          ) : null}
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.titre} numberOfLines={2}>
            {item.titre || 'Annonce'}
          </Text>
          {item.verifie ? <VerifiedCheck /> : null}
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Ionicons name="location-outline" size={13} color={Theme.colors.muted} />
            <Text style={styles.metaText} numberOfLines={1}>
              {item.quartier || 'Abidjan'}{item.ville ? `, ${item.ville}` : ''}
            </Text>
          </View>
        </View>

        <Text style={styles.prix}>
          {formatPrix(item.prix)}
          {item.prix != null ? <Text style={styles.periode}> / {item.periode}</Text> : null}
        </Text>

        {hasContact && onContact ? (
          <Pressable
            style={styles.contactChip}
            onPress={(e) => {
              e.stopPropagation?.();
              onContact();
            }}
            hitSlop={8}>
            <Ionicons name="chatbubble-ellipses-outline" size={14} color={Theme.colors.primaryDark} />
            <Text style={styles.contactChipText}>Contacter</Text>
          </Pressable>
        ) : null}
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
  sourceBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: Theme.colors.muted,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
  },
  indispo: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.colors.danger,
    backgroundColor: '#FEE2E2',
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
  prix: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.primaryDark,
  },
  periode: { fontSize: 12, fontWeight: '500', color: Theme.colors.muted },
  contactChip: {
    marginTop: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Theme.colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  contactChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.primaryDark,
  },
});
