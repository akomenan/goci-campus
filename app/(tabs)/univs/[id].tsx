import { useState } from 'react';
import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Theme } from '@/constants/theme';
import { getUniversityLogoSource } from '@/data/universityLogos';
import {
  ORIENTATION_MESRS_URL,
  SOCIAL_LABELS,
  formatPhoneDisplay,
  getSigleInitials,
  getUniversityById,
  resolveCategorie,
} from '@/data/universities';

async function openUrl(url: string) {
  try {
    const can = await Linking.canOpenURL(url);
    if (!can) {
      Alert.alert('Lien indisponible', 'Impossible d’ouvrir ce lien sur cet appareil.');
      return;
    }
    await Linking.openURL(url);
  } catch {
    Alert.alert('Erreur', 'Ouverture du lien impossible.');
  }
}

function VerifiedCheck() {
  return (
    <View style={styles.checkPill} accessibilityLabel="Vérifié">
      <Text style={styles.checkMark}>✓</Text>
    </View>
  );
}

export default function UniversityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = getUniversityById(String(id));
  const [logoFailed, setLogoFailed] = useState(false);

  if (!item) {
    return (
      <View style={styles.center}>
        <Text style={styles.missing}>Université introuvable</Text>
      </View>
    );
  }

  const isPublic = item.type === 'publique';
  const badgeColor = isPublic ? Theme.colors.primary : '#7C3AED';
  const initials = getSigleInitials(item.sigle);
  const logo = getUniversityLogoSource(item.id, item.logoUrl);
  const showLogo = !!logo && !logoFailed;
  const cat = resolveCategorie(item);
  const catLabel = cat === 'grande_ecole' ? 'Grande école' : 'Université';
  const hasContact = item.telephones.length > 0 || item.emails.length > 0 || !!item.siteWeb;

  const onContact = () => {
    if (item.telephones[0]) {
      void openUrl(`tel:${item.telephones[0]}`);
      return;
    }
    if (item.emails[0]) {
      void openUrl(`mailto:${item.emails[0]}`);
      return;
    }
    if (item.siteWeb) {
      void openUrl(item.siteWeb);
      return;
    }
    Alert.alert('Contact', 'Contact non disponible pour le moment.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable style={styles.banner} onPress={() => void openUrl(ORIENTATION_MESRS_URL)}>
        <Text style={styles.bannerTitle}>Orientation officielle bacheliers</Text>
        <Text style={styles.bannerSub}>Ouvrir bac.mesrs-ci.net</Text>
      </Pressable>

      <View style={styles.hero}>
        <View style={styles.heroTop}>
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
          <View style={styles.heroBadges}>
            <Text style={[styles.badge, { backgroundColor: badgeColor + '18', color: badgeColor }]}>
              {isPublic ? 'Publique' : 'Privée'}
            </Text>
            <Text style={styles.catChip}>{catLabel}</Text>
            {item.mentionMesrs ? (
              <Text style={styles.mesrsChip}>Mention MESRS {item.mentionMesrs}</Text>
            ) : null}
          </View>
        </View>
        <View style={styles.nameRow}>
          <Text style={styles.nom}>{item.nom}</Text>
          <VerifiedCheck />
        </View>
        <Text style={styles.sigle}>{item.sigle}</Text>
        <Text style={styles.desc}>{item.description}</Text>
      </View>

      <View style={styles.card}>
        <Row label="Ville / adresse" value={item.adresse} />
        <Row label="Type" value={`${isPublic ? 'Publique' : 'Privée'} · ${catLabel}`} />
        <Row label="Année d’existence / création" value={item.anneeCreation} />
      </View>

      {item.mentionMesrs ? (
        <View style={styles.card}>
          <Text style={styles.section}>Mention MESRS</Text>
          <Text style={styles.mesrsValue}>{item.mentionMesrs}</Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.section}>Filières</Text>
        {item.filieres.length === 0 ? (
          <Text style={styles.muted}>À confirmer auprès de l’établissement.</Text>
        ) : (
          <View style={styles.tags}>
            {item.filieres.map((f) => (
              <View key={f} style={styles.tag}>
                <Text style={styles.tagText}>{f}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Site web</Text>
        {item.siteWeb ? (
          <Pressable onPress={() => void openUrl(item.siteWeb!)}>
            <Text style={styles.link}>{item.siteWeb}</Text>
          </Pressable>
        ) : (
          <Text style={styles.muted}>Contact non disponible pour le moment.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Téléphones</Text>
        {item.telephones.length === 0 ? (
          <Text style={styles.muted}>Contact non disponible pour le moment.</Text>
        ) : (
          item.telephones.map((t) => (
            <Pressable key={t} onPress={() => void openUrl(`tel:${t}`)} style={styles.contactLine}>
              <Text style={styles.link}>{formatPhoneDisplay(t)}</Text>
            </Pressable>
          ))
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Emails</Text>
        {item.emails.length === 0 ? (
          <Text style={styles.muted}>Contact non disponible pour le moment.</Text>
        ) : (
          item.emails.map((e) => (
            <Pressable key={e} onPress={() => void openUrl(`mailto:${e}`)} style={styles.contactLine}>
              <Text style={styles.link}>{e}</Text>
            </Pressable>
          ))
        )}
      </View>

      {item.reseaux.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.section}>Réseaux sociaux</Text>
          <View style={styles.socialRow}>
            {item.reseaux.map((r) => (
              <Pressable
                key={r.network}
                style={styles.socialBtn}
                onPress={() => void openUrl(r.url)}>
                <Text style={styles.socialBtnText}>{SOCIAL_LABELS[r.network]}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.section}>FRAIS D’INSCRIPTION</Text>
        <Text style={styles.fraisValue}>
          {item.fraisInscriptionIndicatif ?? 'Se renseigner auprès de l’école'}
        </Text>
      </View>

      <Pressable
        style={[styles.contactBtn, !hasContact && styles.contactBtnMuted]}
        onPress={onContact}>
        <Text style={styles.contactBtnText}>Contacter</Text>
      </Pressable>

      <Text style={styles.disclaimer}>Infos à confirmer auprès de l’établissement.</Text>
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  content: { padding: Theme.spacing.md, paddingBottom: 48 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missing: { color: Theme.colors.muted },
  banner: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    shadowColor: Theme.colors.primaryDark,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  bannerTitle: { color: '#fff', fontWeight: '800', fontSize: 15 },
  bannerSub: { color: '#CCFBF1', marginTop: 4, fontSize: 12 },
  hero: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: { width: 50, height: 50 },
  avatarText: { fontWeight: '800', fontSize: 15 },
  catChip: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: Theme.colors.primarySoft,
    color: Theme.colors.primaryDark,
  },
  heroBadges: { flex: 1, gap: 6 },
  badge: {
    alignSelf: 'flex-start',
    fontWeight: '800',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  mesrsChip: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#FEF3C7',
    color: '#B45309',
  },
  nameRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  nom: {
    flexShrink: 1,
    fontSize: 24,
    fontWeight: '800',
    color: Theme.colors.text,
    letterSpacing: -0.4,
  },
  checkPill: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: { color: '#FFFFFF', fontSize: 12, fontWeight: '900', lineHeight: 13 },
  sigle: { marginTop: 6, fontSize: 15, color: Theme.colors.primaryDark, fontWeight: '700' },
  desc: { marginTop: 12, fontSize: 15, color: Theme.colors.muted, lineHeight: 22 },
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md + 2,
    marginBottom: Theme.spacing.sm + 2,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  section: {
    fontSize: 13,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: 10,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  mesrsValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#B45309',
  },
  fraisValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.primaryDark,
  },
  row: { marginBottom: 12 },
  rowLabel: { fontSize: 12, color: Theme.colors.muted, fontWeight: '600' },
  rowValue: { fontSize: 15, color: Theme.colors.text, fontWeight: '600', marginTop: 3 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    backgroundColor: Theme.colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: { color: Theme.colors.primaryDark, fontWeight: '600', fontSize: 12 },
  link: { color: Theme.colors.primary, fontWeight: '700', fontSize: 14 },
  muted: { color: Theme.colors.muted, fontSize: 13, lineHeight: 19 },
  contactLine: { paddingVertical: 4 },
  socialRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  socialBtn: {
    backgroundColor: Theme.colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Theme.radius.sm,
  },
  socialBtnText: { color: Theme.colors.primaryDark, fontWeight: '700', fontSize: 13 },
  contactBtn: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.lg,
    padding: 16,
    alignItems: 'center',
    marginTop: Theme.spacing.sm,
    shadowColor: Theme.colors.primaryDark,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  contactBtnMuted: { opacity: 0.85 },
  contactBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  disclaimer: {
    textAlign: 'center',
    color: Theme.colors.text,
    fontSize: 13,
    marginTop: Theme.spacing.lg,
    fontWeight: '800',
  },
});
