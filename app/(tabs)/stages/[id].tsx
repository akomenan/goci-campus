import { useCallback, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/theme';
import {
  colorForOffreType,
  getOffreById,
  iconForOffreType,
  mailUrl,
  offres as baseOffres,
  telUrl,
  whatsappUrl,
  type Offre,
} from '@/data/stages';
import { loadUserOffres } from '@/lib/stageStorage';

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

export default function StageDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<Offre | undefined>(() => getOffreById(String(id)));

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      void loadUserOffres().then((user) => {
        if (!alive) return;
        setItem(getOffreById(String(id), user) ?? getOffreById(String(id), baseOffres));
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
        <Text style={styles.missing}>Offre introuvable</Text>
      </View>
    );
  }

  const accent = item.accent || colorForOffreType(item.type);
  const icon = iconForOffreType(item.type) as keyof typeof Ionicons.glyphMap;
  const hasTel = !!item.contactTel?.trim();
  const hasWa = !!(item.whatsapp?.trim() || item.contactTel?.trim());
  const hasMail = !!item.contactEmail?.trim();
  const waNumber = item.whatsapp || item.contactTel;

  const onContact = () => {
    if (!hasTel && !hasMail && !hasWa) {
      Alert.alert(
        'Contact',
        'Aucun contact direct publié. Ouvrez l’annonce source pour postuler.',
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
              `Bonjour, je souhaite postuler à « ${item.titre} » chez ${item.entreprise}.`
            )
          ),
      });
    }
    if (hasMail) {
      buttons.push({
        text: 'E-mail',
        onPress: () =>
          void openUrl(mailUrl(item.contactEmail!, item.emailSubject || `Candidature — ${item.titre}`)),
      });
    }
    Alert.alert(
      'Contacter',
      [item.entreprise, item.contactTel, item.contactEmail].filter(Boolean).join(' · '),
      buttons
    );
  };

  const onReport = () => {
    Alert.alert(
      'Signaler cette offre',
      'Confirmez-vous le signalement ? L’équipe PROTTECTOR pourra la vérifier.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Signaler',
          style: 'destructive',
          onPress: () =>
            Alert.alert('Merci', 'Offre signalée. Nous regarderons ça rapidement.'),
        },
      ]
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
          <Text style={styles.domaineBadge}>{item.domaine}</Text>
          {item.verifie ? (
            <View style={styles.verifRow}>
              <VerifiedCheck />
              <Text style={styles.verifText}>Vérifié</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.titre}>{item.titre}</Text>
        <Text style={styles.entreprise}>{item.entreprise}</Text>

        <View style={styles.locRow}>
          <Ionicons name="location-outline" size={16} color={Theme.colors.muted} />
          <Text style={styles.locText}>{item.lieu}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Infos</Text>
        {item.duree ? <InfoRow icon="time-outline" label="Durée" value={item.duree} /> : null}
        <InfoRow icon="briefcase-outline" label="Type" value={item.type} />
        <InfoRow icon="grid-outline" label="Domaine" value={item.domaine} />
        <InfoRow icon="location-outline" label="Lieu" value={item.lieu} />
        {item.remuneration ? (
          <InfoRow icon="cash-outline" label="Rémunération" value={item.remuneration} />
        ) : null}
        {item.datePublication ? (
          <InfoRow icon="calendar-outline" label="Publié / relevé" value={item.datePublication} />
        ) : null}
        {item.dateLimite ? (
          <InfoRow icon="alarm-outline" label="Date limite" value={item.dateLimite} />
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Description</Text>
        <Text style={styles.desc}>{item.description}</Text>
      </View>

      {item.competences?.length ? (
        <View style={styles.card}>
          <Text style={styles.section}>Compétences</Text>
          <View style={styles.tags}>
            {item.competences.map((c) => (
              <View key={c} style={styles.tag}>
                <Text style={styles.tagText}>{c}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.section}>Source</Text>
        <Text style={styles.sourceName}>{item.sourceName}</Text>
        {item.sourceUrl ? (
          <Pressable style={styles.sourceBtn} onPress={() => void openUrl(item.sourceUrl)}>
            <Ionicons name="open-outline" size={18} color={Theme.colors.primaryDark} />
            <Text style={styles.sourceBtnText}>Voir l’offre source</Text>
          </Pressable>
        ) : (
          <Text style={styles.muted}>Annonce locale (pas d’URL source)</Text>
        )}
      </View>

      {(hasTel || hasMail || hasWa) && (
        <View style={styles.card}>
          <Text style={styles.section}>Contact publié</Text>
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
                      `Bonjour, je souhaite postuler à « ${item.titre} » chez ${item.entreprise}.`
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
                    mailUrl(item.contactEmail!, item.emailSubject || `Candidature — ${item.titre}`)
                  )
                }>
                <Ionicons name="mail-outline" size={18} color={Theme.colors.primaryDark} />
                <Text style={styles.softBtnText}>E-mail</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      )}

      <Pressable
        style={styles.applyBtn}
        onPress={() => router.push(`/(tabs)/stages/postuler?id=${item.id}`)}>
        <Ionicons name="paper-plane-outline" size={20} color="#fff" />
        <Text style={styles.applyBtnText}>Postuler</Text>
      </Pressable>

      <Pressable style={styles.contactBtn} onPress={onContact}>
        <Ionicons name="chatbubble-ellipses-outline" size={20} color={Theme.colors.primaryDark} />
        <Text style={styles.contactBtnText}>Contacter</Text>
      </Pressable>

      <Pressable style={styles.reportBtn} onPress={onReport}>
        <Ionicons name="flag-outline" size={16} color={Theme.colors.danger} />
        <Text style={styles.reportBtnText}>Signaler cette offre</Text>
      </Pressable>

      <Text style={styles.disclaimer}>
        Offres agrégées depuis sources publiques — vérifier sur le site d’origine.
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
  domaineBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.colors.muted,
    backgroundColor: '#F1F5F9',
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
  entreprise: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.primaryDark,
  },
  locRow: { marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 4 },
  locText: { color: Theme.colors.muted, fontWeight: '600', fontSize: 14, flex: 1 },
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
  desc: { fontSize: 15, color: Theme.colors.muted, lineHeight: 22 },
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
  infoLabel: { fontSize: 12, color: Theme.colors.muted, fontWeight: '600' },
  infoValue: { fontSize: 15, color: Theme.colors.text, fontWeight: '700', marginTop: 2 },
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
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: Theme.colors.primarySoft,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Theme.radius.sm,
  },
  sourceBtnText: { color: Theme.colors.primaryDark, fontWeight: '700', fontSize: 13 },
  muted: { color: Theme.colors.muted, fontSize: 13 },
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
  applyBtn: {
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
  applyBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  contactBtn: {
    marginHorizontal: Theme.spacing.md,
    marginTop: Theme.spacing.sm,
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  contactBtnText: { color: Theme.colors.primaryDark, fontWeight: '800', fontSize: 16 },
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
