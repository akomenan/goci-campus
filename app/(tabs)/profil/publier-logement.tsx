import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { GlassButton } from '@/components/GlassButton';
import { LOGEMENT_TYPES, addAnnonce } from '@/lib/obsoAnnonces';

export default function PublierLogementScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [ville, setVille] = useState('');
  const [typeLogement, setType] = useState('');
  const [description, setDescription] = useState('');
  const [quartier, setQuartier] = useState('');
  const [prix, setPrix] = useState('');
  const [telephone, setTelephone] = useState(user?.telephone || '');
  const [busy, setBusy] = useState(false);

  const ready = useMemo(
    () =>
      !!(
        ville.trim() &&
        typeLogement.trim() &&
        description.trim() &&
        quartier.trim() &&
        prix.trim() &&
        telephone.trim()
      ),
    [ville, typeLogement, description, quartier, prix, telephone],
  );

  async function onPublish() {
    if (!user || !ready) return;
    setBusy(true);
    try {
      await addAnnonce({
        ownerId: user.id,
        kind: 'logement',
        ville: ville.trim(),
        typeLogement,
        description: description.trim(),
        quartier: quartier.trim(),
        prix: prix.trim(),
        telephone: telephone.trim(),
      });
      Alert.alert('Publié', 'Ton annonce logement est en ligne.');
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
        <Text style={styles.label}>Ville *</Text>
        <TextInput style={styles.input} value={ville} onChangeText={setVille} placeholder="Abidjan" placeholderTextColor={Theme.colors.muted} />
        <Text style={styles.label}>Type de logement *</Text>
        <View style={styles.chips}>
          {LOGEMENT_TYPES.map((t) => (
            <Pressable key={t} onPress={() => setType(t)} style={[styles.chip, typeLogement === t && styles.chipOn]}>
              <Text style={[styles.chipText, typeLogement === t && styles.chipTextOn]}>{t}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.label}>Quartier *</Text>
        <TextInput style={styles.input} value={quartier} onChangeText={setQuartier} placeholder="Cocody, Yopougon…" placeholderTextColor={Theme.colors.muted} />
        <Text style={styles.label}>Prix du loyer *</Text>
        <TextInput style={styles.input} value={prix} onChangeText={setPrix} keyboardType="numeric" placeholder="Ex. 50000" placeholderTextColor={Theme.colors.muted} />
        <Text style={styles.label}>Description *</Text>
        <TextInput style={[styles.input, styles.multi]} value={description} onChangeText={setDescription} multiline placeholder="Détails utiles…" placeholderTextColor={Theme.colors.muted} />
        <Text style={styles.label}>Numéro (Appel & WhatsApp) *</Text>
        <TextInput style={styles.input} value={telephone} onChangeText={setTelephone} keyboardType="phone-pad" />
        <GlassButton
          label="PUBLIER"
          onPress={onPublish}
          busy={busy}
          disabled={!ready}
          style={{ marginTop: 18 }}
        />
        {!ready ? (
          <Text style={styles.hint}>Le bouton s’active quand tous les champs sont remplis.</Text>
        ) : null}
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
