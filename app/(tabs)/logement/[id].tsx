import { useCallback, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/theme';
import {
  formatPrix,
  getLogementById,
  iconForType,
  logements as baseLogements,
  mailUrl,
  telUrl,
  whatsappUrl,
  type Logement,
} from '@/data/logements';
import { loadUserLogements } from '@/lib/logementStorage';

async function openUrl(url: string) {
  try {
    const can = await Linking.canOpenURL(url);
    if (!can) {
      Alert.alert('Lien indisponible', 'Impossible d’ouvrir ce lien sur cet appareil.');
      return;
    }
    await Linking.openURL(url);
  } catch {
    Alert.alert('Erreur', 'Ouverture impossible.');
  }
}

function VerifiedCheck() {
  return (
    <View style={styles.checkPill} accessibilityLabel="Vérifié">
      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={16} color={Theme.colors.primaryDark} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function LogementDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<Logement | undefined>(() => getLogementById(String(id)));

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      void loadUserLogements().then((user) => {
        if (!alive) return;
        setItem(getLogementById(String(id), user) ?? getLogementById(String(id), baseLogements));
      });
      return () => {
        alive = false;
      };
    }, [id])
  );

  if (!item) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={36} color={Theme.colors.muted} />
        <Text style={styles.missing}>Logement introuvable</Text>
      </View>
    );
  }

  const accent = item.accent || Theme.colors.primary;
  const icon = iconForType(item.type) as keyof typeof Ionicons.glyphMap;
  const hasTel = !!item.contactTel?.trim();
  const hasWa = !!(item.whatsapp?.trim() || item.contactTel?.trim());
  const hasMail = !!item.contactEmail?.trim();
  const waNumber = item.whatsapp || item.contactTel;

  const onReport = () => {
    Alert.alert(
      'Signaler cette annonce',
      'Confirmez-vous le signalement ? L’équipe PROTTECTOR pourra la vérifier.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Signaler',
          style: 'destructive',
          onPress: () =>
            Alert.alert('Merci', 'Annonce signalée. Nous regarderons ça rapidement.'),
        },
      ]
    );
  };

  const onContact = () => {
    if (!hasTel && !hasMail && !hasWa) {
      Alert.alert(
        'Contact',
        'Aucun contact direct publié. Ouvrez l’annonce source pour contacter l’annonceur.',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Voir la source',
            onPress: () => item.sourceUrl && void openUrl(item.sourceUrl),
          },
        ]
      );
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
          void openUrl(
            mailUrl(item.contactEmail!, `Demande logement — ${item.titre}`, undefined)
          ),
      });
    }
    Alert.alert(
      'Contacter',
      [item.contactNom, item.contactTel, item.contactEmail].filter(Boolean).join(' · '),
      buttons
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.photo, { backgroundColor: accent }]}>
        <Ionicons name={icon} size={56} color="#FFFFFF" />
        <Text style={styles.photoLabel}>{item.type}</Text>
      </View>

      <View style={styles.hero}>
        <View style={styles.badgeRow}>
          <Text style={[styles.typeBadge, { color: accent, backgroundColor: accent + '18' }]}>
            {item.type}
          </Text>
          <Text
            style={[
              styles.dispoBadge,
              {
                color: item.disponible ? Theme.colors.success : Theme.colors.danger,
                backgroundColor: item.disponible ? '#D1FAE5' : '#FEE2E2',
              },
            ]}>
            {item.disponible ? 'Disponible' : 'Indisponible'}
          </Text>
          {item.verifie ? (
            <View style={styles.verifRow}>
              <VerifiedCheck />
              <Text style={styles.verifText}>Vérifié</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.titre}>{item.titre}</Text>
        <Text style={styles.prix}>
          {formatPrix(item.prix)}
          {item.prix != null ? <Text style={styles.periode}> / {item.periode}</Text> : null}
        </Text>

        <View style={styles.locRow}>
          <Ionicons name="location-outline" size={16} color={Theme.colors.muted} />
          <Text style={styles.locText}>
            {item.quartier}, {item.ville}
            {item.surface && item.surface !== '—' ? ` · ${item.surface}` : ''}
          </Text>
        </View>
        {item.sourceName ? (
          <Text style={styles.sourceLine}>Source · {item.sourceName}</Text>
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Infos</Text>
        <InfoRow icon="home-outline" label="Type" value={item.type} />
        <InfoRow icon="location-outline" label="Quartier" value={`${item.quartier}, ${item.ville}`} />
        {item.surface && item.surface !== '—' ? (
          <InfoRow icon="resize-outline" label="Surface" value={item.surface} />
        ) : null}
        <InfoRow
          icon="cash-outline"
          label="Loyer"
          value={
            item.prix != null
              ? `${formatPrix(item.prix)} / ${item.periode}`
              : 'Voir prix sur source'
          }
        />
        {item.note ? <InfoRow icon="information-circle-outline" label="Note" value={item.note} /> : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Description</Text>
        <Text style={styles.desc}>{item.description}</Text>
      </View>

      {item.equipements?.length ? (
        <View style={styles.card}>
          <Text style={styles.section}>Équipements</Text>
          <View style={styles.tags}>
            {item.equipements.map((e) => (
              <View key={e} style={styles.tag}>
                <Text style={styles.tagText}>{e}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.section}>Source</Text>
        <Text style={styles.sourceName}>{item.sourceName || 'Locale'}</Text>
        {item.sourceUrl ? (
          <Pressable style={styles.sourceBtn} onPress={() => void openUrl(item.sourceUrl!)}>
            <Ionicons name="open-outline" size={18} color={Theme.colors.primaryDark} />
            <Text style={styles.sourceBtnText}>Voir l’annonce source</Text>
          </Pressable>
        ) : (
          <Text style={styles.muted}>Annonce locale (pas d’URL source)</Text>
        )}
      </View>

      {(hasTel || hasMail || hasWa) && (
        <View style={styles.card}>
          <Text style={styles.section}>Contact publié</Text>
          <Text style={styles.contactName}>{item.contactNom}</Text>
          <View style={styles.contactActions}>
            {hasTel ? (
              <Pressable
                style={styles.softBtn}
                onPress={() => void openUrl(telUrl(item.contactTel!))}>
                <Ionicons name="call-outline" size={18} color={Theme.colors.primaryDark} />
                <Text style={styles.softBtnText}>Appeler</Text>
              </Pressable>
            ) : null}
            {hasWa && waNumber ? (
              <Pressable
                style={[styles.softBtn, styles.waBtn]}
                onPress={() =>
                  void openUrl(
                    whatsappUrl(
                      waNumber,
                      `Bonjour, je suis intéressé(e) par « ${item.titre} » (${item.quartier}).`
                    )
                  )
                }>
                <Ionicons name="logo-whatsapp" size={18} color="#166534" />
                <Text style={[styles.softBtnText, { color: '#166534' }]}>WhatsApp</Text>
              </Pressable>
            ) : null}
            {hasMail ? (
              <Pressable
                style={styles.softBtn}
                onPress={() =>
                  void openUrl(
                    mailUrl(item.contactEmail!, `Demande logement — ${item.titre}`)
                  )
                }>
                <Ionicons name="mail-outline" size={18} color={Theme.colors.primaryDark} />
                <Text style={styles.softBtnText}>E-mail</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      )}

      <Pressable style={styles.contactBtn} onPress={onContact}>
        <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" />
        <Text style={styles.contactBtnText}>Contacter</Text>
      </Pressable>

      {item.sourceUrl ? (
        <Pressable style={styles.sourceCta} onPress={() => void openUrl(item.sourceUrl!)}>
          <Ionicons name="open-outline" size={18} color={Theme.colors.primaryDark} />
          <Text style={styles.sourceCtaText}>Voir l’annonce source</Text>
        </Pressable>
      ) : null}

      <Pressable style={styles.reportBtn} onPress={onReport}>
        <Ionicons name="flag-outline" size={16} color={Theme.colors.danger} />
        <Text style={styles.reportBtnText}>Signaler cette annonce</Text>
      </Pressable>

      <Text style={styles.disclaimer}>
        Annonces agrégées — vérifier et négocier sur la source. Attention arnaques / frais de
        visite. PROTTECTOR n’est pas l’annonceur.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  content: { paddingBottom: 48 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  missing: { color: Theme.colors.muted, fontWeight: '600' },
  photo: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoLabel: {
    color: '#CCFBF1',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  hero: {
    marginTop: -20,
    marginHorizontal: Theme.spacing.md,
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  typeBadge: {
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  dispoBadge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  verifRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  checkPill: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifText: { fontSize: 12, fontWeight: '700', color: '#16A34A' },
  titre: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: '800',
    color: Theme.colors.text,
    letterSpacing: -0.3,
  },
  prix: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: '800',
    color: Theme.colors.primaryDark,
  },
  periode: { fontSize: 14, fontWeight: '500', color: Theme.colors.muted },
  locRow: { marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 4 },
  locText: { color: Theme.colors.muted, fontWeight: '600', fontSize: 14, flex: 1 },
  sourceLine: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.muted,
  },
  card: {
    marginTop: Theme.spacing.sm + 2,
    marginHorizontal: Theme.spacing.md,
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md + 2,
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
  infoRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: { fontSize: 11, fontWeight: '700', color: Theme.colors.muted },
  infoValue: { fontSize: 14, fontWeight: '600', color: Theme.colors.text, marginTop: 2 },
  desc: { fontSize: 15, color: Theme.colors.muted, lineHeight: 22 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    backgroundColor: Theme.colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: { color: Theme.colors.primaryDark, fontWeight: '600', fontSize: 12 },
  sourceName: { fontSize: 15, fontWeight: '700', color: Theme.colors.text, marginBottom: 10 },
  sourceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Theme.colors.primarySoft,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: Theme.radius.sm,
    alignSelf: 'flex-start',
  },
  sourceBtnText: { color: Theme.colors.primaryDark, fontWeight: '700', fontSize: 14 },
  contactName: { fontSize: 16, fontWeight: '700', color: Theme.colors.text, marginBottom: 10 },
  contactActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  softBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Theme.colors.primarySoft,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Theme.radius.sm,
  },
  waBtn: { backgroundColor: '#DCFCE7' },
  softBtnText: { color: Theme.colors.primaryDark, fontWeight: '700', fontSize: 13 },
  muted: { color: Theme.colors.muted, fontSize: 13 },
  contactBtn: {
    marginHorizontal: Theme.spacing.md,
    marginTop: Theme.spacing.md,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.lg,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Theme.colors.primaryDark,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  contactBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  sourceCta: {
    marginHorizontal: Theme.spacing.md,
    marginTop: Theme.spacing.sm,
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  sourceCtaText: { color: Theme.colors.primaryDark, fontWeight: '800', fontSize: 15 },
  reportBtn: {
    marginTop: Theme.spacing.sm,
    padding: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  reportBtnText: { color: Theme.colors.danger, fontWeight: '600' },
  disclaimer: {
    textAlign: 'center',
    color: Theme.colors.muted,
    fontSize: 12,
    marginTop: Theme.spacing.sm,
    marginHorizontal: Theme.spacing.lg,
    lineHeight: 18,
  },
});
