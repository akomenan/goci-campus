import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/theme';
import { OFFRE_TYPES, type OffreType } from '@/data/stages';
import { addUserOffre } from '@/lib/stageStorage';

const QUARTIER_SUGGESTIONS = [
  'Yopougon',
  'Cocody',
  'Plateau',
  'Abobo',
  'Marcory',
  'Koumassi',
  'Riviera',
  'Bingerville',
  'Treichville',
];

export default function PublierOffreScreen() {
  const router = useRouter();
  const [titre, setTitre] = useState('');
  const [type, setType] = useState<OffreType>('Stage');
  const [entreprise, setEntreprise] = useState('');
  const [domaine, setDomaine] = useState('');
  const [lieu, setLieu] = useState('');
  const [quartier, setQuartier] = useState('');
  const [description, setDescription] = useState('');
  const [remuneration, setRemuneration] = useState('');
  const [duree, setDuree] = useState('');
  const [contactTel, setContactTel] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [applyUrl, setApplyUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    if (!titre.trim()) {
      Alert.alert('Titre manquant', 'Indiquez un titre clair pour l’offre.');
      return;
    }
    if (!entreprise.trim()) {
      Alert.alert('Entreprise', 'Indiquez le nom de l’entreprise ou de l’organisation.');
      return;
    }
    if (!lieu.trim() && !quartier.trim()) {
      Alert.alert('Lieu', 'Indiquez un lieu ou un quartier (ex. Cocody, Plateau).');
      return;
    }
    if (!description.trim() || description.trim().length < 20) {
      Alert.alert('Description', 'Ajoutez quelques phrases utiles pour les étudiants.');
      return;
    }
    if (!contactTel.trim() && !contactEmail.trim() && !applyUrl.trim()) {
      Alert.alert('Contact', 'Ajoutez un téléphone, un e-mail ou un lien de candidature.');
      return;
    }

    const lieuFinal = lieu.trim() ? lieu.trim() : `Abidjan — ${quartier.trim()}`;

    setSaving(true);
    try {
      const item = await addUserOffre({
        titre,
        type,
        entreprise,
        domaine: domaine || 'Autre',
        lieu: lieuFinal,
        quartier: quartier || undefined,
        description,
        remuneration: remuneration || undefined,
        duree: duree || undefined,
        contactTel: contactTel || undefined,
        contactEmail: contactEmail || undefined,
        applyUrl: applyUrl || undefined,
        whatsapp: contactTel || undefined,
      });
      Alert.alert('Offre publiée', 'Elle apparaît localement dans la liste et Mes candidatures.', [
        { text: 'Voir', onPress: () => router.replace(`/(tabs)/stages/${item.id}`) },
        { text: 'OK', onPress: () => router.back() },
      ]);
      setTitre('');
      setEntreprise('');
      setDomaine('');
      setLieu('');
      setQuartier('');
      setDescription('');
      setRemuneration('');
      setDuree('');
      setContactTel('');
      setContactEmail('');
      setApplyUrl('');
      setType('Stage');
    } catch {
      Alert.alert('Erreur', 'Impossible d’enregistrer l’offre. Réessayez.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.intro}>
          Publiez un stage, un job ou une alternance (stockage local sur cet appareil). Pour les
          offres publiques, préférez les annonces vérifiées de la liste.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Titre</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex. Stage développement web"
            placeholderTextColor={Theme.colors.muted}
            value={titre}
            onChangeText={setTitre}
          />

          <Text style={styles.label}>Type</Text>
          <View style={styles.typeRow}>
            {OFFRE_TYPES.map((t) => {
              const active = t === type;
              return (
                <Pressable
                  key={t}
                  onPress={() => setType(t)}
                  style={[styles.typeChip, active && styles.typeChipActive]}>
                  <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>{t}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Entreprise</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom de l’entreprise"
            placeholderTextColor={Theme.colors.muted}
            value={entreprise}
            onChangeText={setEntreprise}
          />

          <Text style={styles.label}>Domaine</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex. Digital/IT, RH, Marketing/Com"
            placeholderTextColor={Theme.colors.muted}
            value={domaine}
            onChangeText={setDomaine}
          />

          <Text style={styles.label}>Lieu</Text>
          <TextInput
            style={styles.input}
            placeholder="Abidjan — Cocody"
            placeholderTextColor={Theme.colors.muted}
            value={lieu}
            onChangeText={setLieu}
          />

          <Text style={styles.label}>Quartier (optionnel)</Text>
          <TextInput
            style={styles.input}
            placeholder="Cocody, Yopougon…"
            placeholderTextColor={Theme.colors.muted}
            value={quartier}
            onChangeText={setQuartier}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestRow}>
            {QUARTIER_SUGGESTIONS.map((q) => (
              <Pressable
                key={q}
                style={styles.suggest}
                onPress={() => {
                  setQuartier(q);
                  if (!lieu.trim()) setLieu(`Abidjan — ${q}`);
                }}>
                <Text style={styles.suggestText}>{q}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={styles.label}>Rémunération (optionnel)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex. 50 000 FCFA/mois"
            placeholderTextColor={Theme.colors.muted}
            value={remuneration}
            onChangeText={setRemuneration}
          />

          <Text style={styles.label}>Durée (optionnel)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex. 3 mois"
            placeholderTextColor={Theme.colors.muted}
            value={duree}
            onChangeText={setDuree}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.area]}
            placeholder="Missions, profil, horaires…"
            placeholderTextColor={Theme.colors.muted}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.label}>Téléphone / WhatsApp</Text>
          <TextInput
            style={styles.input}
            placeholder="+225 07 …"
            placeholderTextColor={Theme.colors.muted}
            keyboardType="phone-pad"
            value={contactTel}
            onChangeText={setContactTel}
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="recrutement@entreprise.ci"
            placeholderTextColor={Theme.colors.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={contactEmail}
            onChangeText={setContactEmail}
          />

          <Text style={styles.label}>Lien de candidature (optionnel)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://…"
            placeholderTextColor={Theme.colors.muted}
            autoCapitalize="none"
            value={applyUrl}
            onChangeText={setApplyUrl}
          />
        </View>

        <Pressable
          style={[styles.btn, saving && { opacity: 0.7 }]}
          disabled={saving}
          onPress={() => void onSubmit()}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={styles.btnText}>{saving ? 'Publication…' : 'Publier l’offre'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: Theme.colors.background },
  content: { padding: Theme.spacing.md, paddingBottom: 40 },
  intro: { color: Theme.colors.muted, marginBottom: Theme.spacing.md, lineHeight: 20, fontSize: 14 },
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
  area: { minHeight: 110 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Theme.colors.background,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  typeChipActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  typeChipText: { color: Theme.colors.muted, fontWeight: '700', fontSize: 13 },
  typeChipTextActive: { color: '#fff' },
  suggestRow: { gap: 8, paddingTop: 8 },
  suggest: {
    backgroundColor: Theme.colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  suggestText: { color: Theme.colors.primaryDark, fontWeight: '700', fontSize: 12 },
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
  btnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
