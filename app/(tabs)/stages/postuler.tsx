import { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/theme';
import {
  getOffreById,
  mailUrl,
  offres as baseOffres,
  whatsappUrl,
  type Offre,
} from '@/data/stages';
import { addCandidature, loadUserOffres } from '@/lib/stageStorage';

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

export default function PostulerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [item, setItem] = useState<Offre | undefined>(() =>
    id ? getOffreById(String(id)) : undefined
  );
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
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

  if (!id || !item) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={36} color={Theme.colors.muted} />
        <Text style={styles.missing}>Offre introuvable</Text>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Retour</Text>
        </Pressable>
      </View>
    );
  }

  const waNumber = item.whatsapp || item.contactTel;
  const defaultMessage = `Bonjour,\n\nJe souhaite postuler au poste « ${item.titre} » chez ${item.entreprise}.\n\nCordialement,\n${prenom || '[Prénom]'} ${nom || '[Nom]'}`;

  const buildBody = () => {
    const lm = message.trim() || defaultMessage;
    return [
      lm,
      '',
      '—',
      `Candidat : ${prenom.trim()} ${nom.trim()}`,
      `E-mail : ${email.trim()}`,
      tel.trim() ? `Tél : ${tel.trim()}` : null,
      item.sourceUrl ? `Offre source : ${item.sourceUrl}` : null,
      'Envoyé via PROTTECTOR',
    ]
      .filter(Boolean)
      .join('\n');
  };

  const onSubmit = async () => {
    if (!nom.trim() || !prenom.trim()) {
      Alert.alert('Identité', 'Indiquez votre nom et prénom.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('E-mail', 'Indiquez un e-mail valide pour vous recontacter.');
      return;
    }

    setSaving(true);
    try {
      await addCandidature({
        offreId: item.id,
        nom,
        prenom,
        email,
        tel,
        message: message.trim() || defaultMessage,
      });

      const subject = item.emailSubject || `Candidature — ${item.titre}`;
      const body = buildBody();

      if (item.contactEmail?.trim()) {
        await openUrl(mailUrl(item.contactEmail, subject, body));
        Alert.alert(
          'Candidature enregistrée',
          'Votre messagerie s’ouvre avec le message prérempli. Joignez CV et LM, puis envoyez.',
          [
            { text: 'Mes candidatures', onPress: () => router.replace('/(tabs)/stages/mes-candidatures') },
            { text: 'OK', onPress: () => router.back() },
          ]
        );
      } else if (item.applyUrl?.trim()) {
        await openUrl(item.applyUrl);
        Alert.alert(
          'Candidature enregistrée',
          'Ouvrez le formulaire / portail d’origine pour finaliser. Votre brouillon est dans Mes candidatures.',
          [
            { text: 'Mes candidatures', onPress: () => router.replace('/(tabs)/stages/mes-candidatures') },
            { text: 'OK', onPress: () => router.back() },
          ]
        );
      } else if (item.sourceUrl?.trim()) {
        await openUrl(item.sourceUrl);
        Alert.alert(
          'Candidature enregistrée',
          'Aucun e-mail public : l’annonce source est ouverte. Finalisez sur le site d’origine.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert(
          'Candidature enregistrée',
          'Aucun canal public de candidature. Contactez le recruteur autrement si possible.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    } catch {
      Alert.alert('Erreur', 'Impossible d’enregistrer la candidature.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.offerTitle}>{item.titre}</Text>
        <Text style={styles.offerMeta}>
          {item.entreprise} · {item.lieu}
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Nom</Text>
          <TextInput
            style={styles.input}
            placeholder="Kouassi"
            placeholderTextColor={Theme.colors.muted}
            value={nom}
            onChangeText={setNom}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Prénom</Text>
          <TextInput
            style={styles.input}
            placeholder="Awa"
            placeholderTextColor={Theme.colors.muted}
            value={prenom}
            onChangeText={setPrenom}
            autoCapitalize="words"
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="vous@email.com"
            placeholderTextColor={Theme.colors.muted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Téléphone (optionnel)</Text>
          <TextInput
            style={styles.input}
            placeholder="+225 07 …"
            placeholderTextColor={Theme.colors.muted}
            value={tel}
            onChangeText={setTel}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Message / lettre de motivation courte</Text>
          <TextInput
            style={[styles.input, styles.area]}
            placeholder={defaultMessage}
            placeholderTextColor={Theme.colors.muted}
            value={message}
            onChangeText={setMessage}
            multiline
            textAlignVertical="top"
          />
        </View>

        <Pressable
          style={[styles.btn, saving && { opacity: 0.7 }]}
          disabled={saving}
          onPress={() => void onSubmit()}>
          <Ionicons name="paper-plane-outline" size={20} color="#fff" />
          <Text style={styles.btnText}>
            {saving
              ? 'Envoi…'
              : item.contactEmail
                ? 'Enregistrer & ouvrir e-mail'
                : item.applyUrl
                  ? 'Enregistrer & ouvrir candidature'
                  : 'Enregistrer & ouvrir la source'}
          </Text>
        </Pressable>

        {waNumber ? (
          <Pressable
            style={styles.waBtn}
            onPress={() =>
              void openUrl(
                whatsappUrl(
                  waNumber,
                  message.trim() ||
                    `Bonjour, je m’appelle ${prenom} ${nom} et je souhaite postuler à « ${item.titre} ».`
                )
              )
            }>
            <Ionicons name="logo-whatsapp" size={20} color="#166534" />
            <Text style={styles.waBtnText}>WhatsApp</Text>
          </Pressable>
        ) : null}

        {item.sourceUrl ? (
          <Pressable style={styles.sourceBtn} onPress={() => void openUrl(item.sourceUrl)}>
            <Ionicons name="open-outline" size={18} color={Theme.colors.primaryDark} />
            <Text style={styles.sourceBtnText}>Voir l’offre source</Text>
          </Pressable>
        ) : null}

        <Text style={styles.disclaimer}>
          Offres agrégées depuis sources publiques — vérifier sur le site d’origine. Joignez toujours
          votre CV depuis votre messagerie ou le portail du recruteur.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: Theme.colors.background },
  content: { padding: Theme.spacing.md, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 24 },
  missing: { color: Theme.colors.muted, fontWeight: '600' },
  backBtn: {
    marginTop: 12,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Theme.radius.sm,
  },
  backBtnText: { color: '#fff', fontWeight: '700' },
  offerTitle: { fontSize: 18, fontWeight: '800', color: Theme.colors.text },
  offerMeta: { marginTop: 4, marginBottom: Theme.spacing.md, color: Theme.colors.muted, fontWeight: '600' },
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.muted,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radius.sm,
    padding: 12,
    fontSize: 15,
    color: Theme.colors.text,
    backgroundColor: Theme.colors.background,
  },
  area: { minHeight: 140 },
  btn: {
    marginTop: Theme.spacing.lg,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.lg,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 15, flexShrink: 1, textAlign: 'center' },
  waBtn: {
    marginTop: Theme.spacing.sm,
    backgroundColor: '#DCFCE7',
    borderRadius: Theme.radius.lg,
    padding: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  waBtnText: { color: '#166534', fontWeight: '800', fontSize: 15 },
  sourceBtn: {
    marginTop: Theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
  },
  sourceBtnText: { color: Theme.colors.primaryDark, fontWeight: '700' },
  disclaimer: {
    marginTop: Theme.spacing.md,
    textAlign: 'center',
    color: Theme.colors.muted,
    fontSize: 12,
    lineHeight: 18,
  },
});
