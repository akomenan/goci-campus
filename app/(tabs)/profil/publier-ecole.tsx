import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { GlassButton } from '@/components/GlassButton';
import { addAnnonce } from '@/lib/obsoAnnonces';

export default function PublierEcoleScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [nomEcole, setNom] = useState('');
  const [ville, setVille] = useState('');
  const [typeEcole, setType] = useState('');
  const [filieres, setFilieres] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState(user?.telephone || '');
  const [siteWeb, setSite] = useState('');
  const [busy, setBusy] = useState(false);

  const ready = useMemo(
    () =>
      !!(
        nomEcole.trim() &&
        ville.trim() &&
        typeEcole.trim() &&
        filieres.trim() &&
        description.trim() &&
        contact.trim()
      ),
    [nomEcole, ville, typeEcole, filieres, description, contact],
  );

  async function onPublish() {
    if (!user || !ready) return;
    setBusy(true);
    try {
      await addAnnonce({
        ownerId: user.id,
        kind: 'ecole',
        nomEcole: nomEcole.trim(),
        ville: ville.trim(),
        typeEcole: typeEcole.trim(),
        filieres: filieres.trim(),
        description: description.trim(),
        contact: contact.trim(),
        siteWeb: siteWeb.trim(),
      });
      Alert.alert('Publié', 'Les infos de ton école sont partagées.');
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
        <Text style={styles.label}>Nom de l’école *</Text>
        <TextInput style={styles.input} value={nomEcole} onChangeText={setNom} />
        <Text style={styles.label}>Ville *</Text>
        <TextInput style={styles.input} value={ville} onChangeText={setVille} />
        <Text style={styles.label}>Type (université, école, institute…) *</Text>
        <TextInput style={styles.input} value={typeEcole} onChangeText={setType} />
        <Text style={styles.label}>Filières *</Text>
        <TextInput style={styles.input} value={filieres} onChangeText={setFilieres} placeholder="Ex. Droit, Informatique…" placeholderTextColor={Theme.colors.muted} />
        <Text style={styles.label}>Description *</Text>
        <TextInput style={[styles.input, styles.multi]} value={description} onChangeText={setDescription} multiline />
        <Text style={styles.label}>Contact *</Text>
        <TextInput style={styles.input} value={contact} onChangeText={setContact} />
        <Text style={styles.label}>Site web (optionnel)</Text>
        <TextInput style={styles.input} value={siteWeb} onChangeText={setSite} autoCapitalize="none" />
        <GlassButton label="PUBLIER" onPress={onPublish} busy={busy} disabled={!ready} style={{ marginTop: 18 }} />
        {!ready ? <Text style={styles.hint}>Le bouton s’active quand les champs obligatoires sont remplis.</Text> : null}
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
  hint: { marginTop: 10, color: Theme.colors.muted, fontSize: 12, textAlign: 'center' },
});
