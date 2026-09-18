import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { GlassButton } from '@/components/GlassButton';
import { STAGE_TYPES, addAnnonce } from '@/lib/obsoAnnonces';

export default function PublierStageScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [titre, setTitre] = useState('');
  const [entreprise, setEntreprise] = useState('');
  const [typeOffre, setType] = useState('');
  const [domaine, setDomaine] = useState('');
  const [lieu, setLieu] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState(user?.telephone || '');
  const [busy, setBusy] = useState(false);

  const ready = useMemo(
    () =>
      !!(
        titre.trim() &&
        entreprise.trim() &&
        typeOffre.trim() &&
        domaine.trim() &&
        lieu.trim() &&
        description.trim() &&
        contact.trim()
      ),
    [titre, entreprise, typeOffre, domaine, lieu, description, contact],
  );

  async function onPublish() {
    if (!user || !ready) return;
    setBusy(true);
    try {
      await addAnnonce({
        ownerId: user.id,
        kind: 'stage',
        titre: titre.trim(),
        entreprise: entreprise.trim(),
        typeOffre,
        domaine: domaine.trim(),
        lieu: lieu.trim(),
        description: description.trim(),
        contact: contact.trim(),
      });
      Alert.alert('Publié', 'Ton offre stage/job est en ligne.');
      router.replace('/(tabs)/profil/mes-annonces');
    } catch (e) {
      Alert.alert('Erreur', e instanceof Error ? e.message : 'Publication impossible.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.label}>Titre *</Text>
        <TextInput style={styles.input} value={titre} onChangeText={setTitre} />
        <Text style={styles.label}>Entreprise *</Text>
        <TextInput style={styles.input} value={entreprise} onChangeText={setEntreprise} />
        <Text style={styles.label}>Type *</Text>
        <View style={styles.chips}>
          {STAGE_TYPES.map((t) => (
            <Pressable key={t} onPress={() => setType(t)} style={[styles.chip, typeOffre === t && styles.chipOn]}>
              <Text style={[styles.chipText, typeOffre === t && styles.chipTextOn]}>{t}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.label}>Domaine *</Text>
        <TextInput style={styles.input} value={domaine} onChangeText={setDomaine} placeholder="Com, IT, RH…" placeholderTextColor={Theme.colors.muted} />
        <Text style={styles.label}>Lieu *</Text>
        <TextInput style={styles.input} value={lieu} onChangeText={setLieu} />
        <Text style={styles.label}>Description *</Text>
        <TextInput style={[styles.input, styles.multi]} value={description} onChangeText={setDescription} multiline />
        <Text style={styles.label}>Contact (tél. / WhatsApp / e-mail) *</Text>
        <TextInput style={styles.input} value={contact} onChangeText={setContact} />
        <GlassButton label="PUBLIER" onPress={onPublish} busy={busy} disabled={!ready} style={{ marginTop: 18 }} />
        {!ready ? <Text style={styles.hint}>Le bouton s’active quand tout est renseigné.</Text> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  content: { padding: Theme.spacing.md, paddingBottom: 40 },
  card: { ...Theme.glass, borderRadius: Theme.radius.lg, padding: Theme.spacing.md },
  label: { fontSize: 12, fontWeight: '700', color: Theme.colors.muted, marginTop: 10, marginBottom: 6 },
  input: {
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Theme.colors.text,
  },
  multi: { minHeight: 100, textAlignVertical: 'top' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
  },
  chipOn: { backgroundColor: Theme.colors.primary },
  chipText: { fontWeight: '700', color: Theme.colors.text, fontSize: 13 },
  chipTextOn: { color: '#fff' },
  hint: { marginTop: 10, color: Theme.colors.muted, fontSize: 12, textAlign: 'center' },
});
