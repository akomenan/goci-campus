import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/theme';
import { getUniversityLogoSource } from '@/data/universityLogos';
import { getSigleInitials, resolveCategorie, type University } from '@/data/universities';

function VerifiedCheck() {
  return (
    <View style={styles.checkPill} accessibilityLabel="Vérifié">
      <Text style={styles.checkMark}>✓</Text>
    </View>
  );
}

export function UniversityCard({
  item,
  onPress,
}: {
  item: University;
  onPress: () => void;
}) {
  const isPublic = item.type === 'publique';
  const badgeColor = isPublic ? Theme.colors.primary : '#7C3AED';
  const initials = getSigleInitials(item.sigle);
  const logo = getUniversityLogoSource(item.id, item.logoUrl);
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = !!logo && !logoFailed;
  const cat = resolveCategorie(item);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.92, transform: [{ scale: 0.995 }] }]}>
      <View style={styles.topRow}>
        <View style={[styles.avatar, { backgroundColor: badgeColor + '18' }]}>
          {showLogo ? (
            <Image
              source={logo}
              style={styles.logo}
              resizeMode="contain"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <Text style={[styles.avatarText, { color: badgeColor }]}>{initials}</Text>
          )}
        </View>
        <View style={styles.topMeta}>
          <View style={styles.badges}>
            <Text style={[styles.badge, { backgroundColor: badgeColor + '18', color: badgeColor }]}>
              {isPublic ? 'Publique' : 'Privée'}
            </Text>
            <Text style={styles.catChip}>
              {cat === 'grande_ecole' ? 'Grande école' : 'Université'}
            </Text>
            {item.mentionMesrs ? (
              <Text style={styles.mesrsChip}>Mention {item.mentionMesrs}</Text>
            ) : null}
          </View>
          <Text style={styles.sigle}>{item.sigle}</Text>
        </View>
      </View>
      <View style={styles.nameRow}>
        <Text style={styles.nom}>{item.nom}</Text>
        <VerifiedCheck />
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.cityChip}>📍 {item.ville}</Text>
        <Text style={[styles.typeChip, { color: badgeColor, backgroundColor: badgeColor + '14' }]}>
          {isPublic ? 'Publique' : 'Privée'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
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
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: { width: 42, height: 42 },
  avatarText: { fontWeight: '800', fontSize: 13 },
  topMeta: { flex: 1 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
  },
  catChip: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: Theme.colors.primarySoft,
    color: Theme.colors.primaryDark,
  },
  mesrsChip: {
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#FEF3C7',
    color: '#B45309',
  },
  sigle: { marginTop: 5, fontSize: 12, color: Theme.colors.muted, fontWeight: '700' },
  nameRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  nom: {
    flexShrink: 1,
    fontSize: 17,
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
  checkMark: { color: '#FFFFFF', fontSize: 11, fontWeight: '900', lineHeight: 12 },
  metaRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  cityChip: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.muted,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  typeChip: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
});
