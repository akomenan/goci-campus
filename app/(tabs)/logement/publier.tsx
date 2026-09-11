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
import { LOGEMENT_TYPES, type LogementType } from '@/data/logements';
import { addUserLogement } from '@/lib/logementStorage';

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

export default function PublierLogementScreen() {
  const router = useRouter();
  const [titre, setTitre] = useState('');
  const [type, setType] = useState<LogementType>('Chambre');
  const [prix, setPrix] = useState('');
  const [quartier, setQuartier] = useState('');
  const [description, setDescription] = useState('');
  const [contactNom, setContactNom] = useState('');
  const [contactTel, setContactTel] = useState('');
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    const prixNum = Number(String(prix).replace(/\s/g, '').replace(',', '.'));
    if (!titre.trim()) {
      Alert.alert('Titre manquant', 'Indiquez un titre clair pour l’annonce.');
      return;
    }
    if (!Number.isFinite(prixNum) || prixNum <= 0) {
      Alert.alert('Prix invalide', 'Entrez un prix mensuel en FCFA (ex. 45000).');
      return;
    }
    if (!quartier.trim()) {
      Alert.alert('Quartier manquant', 'Indiquez le quartier (ex. Cocody, Yopougon).');
      return;
    }
    if (!description.trim() || description.trim().length < 20) {
      Alert.alert('Description', 'Ajoutez quelques phrases utiles pour les étudiants.');
      return;
    }
    if (!contactTel.trim()) {
      Alert.alert('Contact', 'Ajoutez un numéro WhatsApp ou téléphone.');
      return;
    }

    setSaving(true);
    try {
      const item = await addUserLogement({
        titre,
        type,
        prix: Math.round(prixNum),
        quartier,
        description,
        contactNom: contactNom || 'Annonceur',
        contactTel,
      });
      Alert.alert('Annonce publiée', 'Elle apparaît dans Mes annonces et dans la liste.', [
        {
          text: 'Voir',
          onPress: () => router.replace(`/(tabs)/logement/${item.id}`),
        },
        { text: 'OK', onPress: () => router.back() },
      ]);
      setTitre('');
      setPrix('');
      setQuartier('');
      setDescription('');
      setContactNom('');
      setContactTel('');
      setType('Chambre');
    } catch {
      Alert.alert('Erreur', 'Impossible d’enregistrer l’annonce. Réessayez.');
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
          Publiez une chambre, un studio ou une colocation à Abidjan. L’annonce reste sur cet
          appareil (Goci Campus).
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Titre</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex. Chambre meublée près de l’UFHB"
            placeholderTextColor={Theme.colors.muted}
            value={titre}
            onChangeText={setTitre}
          />

          <Text style={styles.label}>Type</Text>
          <View style={styles.typeRow}>
            {LOGEMENT_TYPES.map((t) => {
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

          <Text style={styles.label}>Prix (FCFA / mois)</Text>
          <TextInput
            style={styles.input}
            placeholder="45000"
            placeholderTextColor={Theme.colors.muted}
            keyboardType="numeric"
            value={prix}
            onChangeText={setPrix}
          />

          <Text style={styles.label}>Quartier</Text>
          <TextInput
            style={styles.input}
            placeholder="Cocody, Yopougon, Plateau…"
            placeholderTextColor={Theme.colors.muted}
            value={quartier}
            onChangeText={setQuartier}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestRow}>
            {QUARTIER_SUGGESTIONS.map((q) => (
              <Pressable key={q} style={styles.suggest} onPress={() => setQuartier(q)}>
                <Text style={styles.suggestText}>{q}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.area]}
            placeholder="Calme, proche campus, wifi, charges…"
            placeholderTextColor={Theme.colors.muted}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.label}>Votre prénom</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex. Adjoua"
            placeholderTextColor={Theme.colors.muted}
            value={contactNom}
            onChangeText={setContactNom}
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
        </View>

        <Pressable
          style={[styles.btn, saving && { opacity: 0.7 }]}
          disabled={saving}
          onPress={() => void onSubmit()}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={styles.btnText}>{saving ? 'Publication…' : 'Publier l’annonce'}</Text>
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
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
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
    shadowColor: Theme.colors.primaryDark,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
