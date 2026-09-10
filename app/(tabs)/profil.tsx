import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import {
  RECHERCHE_OPTIONS,
  resolveRole,
  roleLabel,
} from '@/data/profile';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '—'}</Text>
    </View>
  );
}

export default function ProfilScreen() {
  const { user, signOut, updateProfile } = useAuth();
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [biographie, setBiographie] = useState('');
  const [parcours, setParcours] = useState('');
  const [ambitions, setAmbitions] = useState('');

  async function onSignOut() {
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
    }
  }

  function startEdit() {
    if (!user) return;
    setBiographie(user.biographie || '');
    setParcours(user.parcours || '');
    setAmbitions(user.ambitions || '');
    setEditing(true);
  }

  async function onSaveEnrichment() {
    setSaving(true);
    try {
      await updateProfile({
        biographie: biographie.trim(),
        parcours: parcours.trim(),
        ambitions: ambitions.trim(),
      });
      setEditing(false);
    } catch (e) {
      Alert.alert('Erreur', e instanceof Error ? e.message : 'Enregistrement impossible.');
    } finally {
      setSaving(false);
    }
  }

  async function onPickPhoto() {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          'Permission requise',
          'Autorise l’accès à la galerie pour choisir une photo de profil.',
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (result.canceled || !result.assets?.[0]?.uri) return;
      await updateProfile({ photoUri: result.assets[0].uri });
    } catch (e) {
      Alert.alert('Erreur', e instanceof Error ? e.message : 'Photo impossible.');
    }
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={Theme.colors.primary} />
      </View>
    );
  }

  const role = resolveRole(user);
  const isEtudiant = role === 'etudiant';
  const initials = `${user.prenom?.[0] ?? ''}${user.nom?.[0] ?? ''}`.toUpperCase() || '?';
  const recherchesLabel =
    (user.recherches || [])
      .map((id) => RECHERCHE_OPTIONS.find((o) => o.id === id)?.label || id)
      .join(', ') || '—';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarCard}>
        {isEtudiant ? (
          <Pressable onPress={onPickPhoto} style={styles.avatarPress}>
            {user.photoUri ? (
              <Image source={{ uri: user.photoUri }} style={styles.photo} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            )}
            <Text style={styles.photoHint}>📷 Changer la photo</Text>
          </Pressable>
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}
        <Text style={styles.name}>
          {user.prenom} {user.nom}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{roleLabel(user)}</Text>
        </View>
      </View>

      {isEtudiant ? (
        <>
          <View style={styles.card}>
            <Text style={styles.section}>Informations</Text>
            <Field label="Ville" value={user.ville || ''} />
            <Field label="Université" value={user.universite || ''} />
            <Field label="Filière" value={user.filiere || ''} />
            <Field label="Niveau" value={user.niveau || ''} />
            <Field label="E-mail" value={user.email || ''} />
            <Field label="Téléphone" value={user.telephone} />
          </View>

          <View style={styles.card}>
            <View style={styles.sectionRow}>
              <Text style={styles.section}>Mon profil enrichi</Text>
              {!editing ? (
                <Pressable onPress={startEdit}>
                  <Text style={styles.editLink}>Modifier</Text>
                </Pressable>
              ) : null}
            </View>

            {editing ? (
              <>
                <Text style={styles.label}>Biographie</Text>
                <TextInput
                  style={[styles.input, styles.multiline]}
                  value={biographie}
                  onChangeText={setBiographie}
                  multiline
                  placeholder="Parle un peu de toi…"
                  placeholderTextColor={Theme.colors.muted}
                />
                <Text style={styles.label}>Parcours</Text>
                <TextInput
                  style={[styles.input, styles.multiline]}
                  value={parcours}
                  onChangeText={setParcours}
                  multiline
                  placeholder="Études, expériences…"
                  placeholderTextColor={Theme.colors.muted}
                />
                <Text style={styles.label}>Ambitions professionnelles</Text>
                <TextInput
                  style={[styles.input, styles.multiline]}
                  value={ambitions}
                  onChangeText={setAmbitions}
                  multiline
                  placeholder="Tes objectifs…"
                  placeholderTextColor={Theme.colors.muted}
                />
                <View style={styles.editActions}>
                  <Pressable
                    style={styles.cancelBtn}
                    onPress={() => setEditing(false)}
                    disabled={saving}>
                    <Text style={styles.cancelText}>Annuler</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.saveBtn, saving && { opacity: 0.7 }]}
                    onPress={onSaveEnrichment}
                    disabled={saving}>
                    {saving ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.saveText}>Enregistrer</Text>
                    )}
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Field label="Biographie" value={user.biographie || ''} />
                <Field label="Parcours" value={user.parcours || ''} />
                <Field label="Ambitions professionnelles" value={user.ambitions || ''} />
              </>
            )}
          </View>
        </>
      ) : (
        <View style={styles.card}>
          <Text style={styles.section}>Informations</Text>
          <Field label="Téléphone" value={user.telephone} />
          <Field label="E-mail" value={user.email || ''} />
          {user.visiteurType === 'bachelier' ? (
            <>
              <Field label="Année du bac" value={user.anneeBac || ''} />
              <Field label="Ville" value={user.ville || ''} />
            </>
          ) : null}
          {user.visiteurType === 'particulier' ? (
            <Field label="Je cherche" value={recherchesLabel} />
          ) : null}
          <Text style={styles.visitorNote}>
            Profil simple Visiteur — photo, bio et parcours sont réservés aux comptes Étudiant.
          </Text>
        </View>
      )}

      <Pressable
        style={[styles.logout, busy && styles.logoutDisabled]}
        onPress={onSignOut}
        disabled={busy}>
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.logoutText}>Déconnexion</Text>
        )}
      </Pressable>

      <Text style={styles.hint}>Proto local — données sur cet appareil</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  centered: { alignItems: 'center', justifyContent: 'center' },
  content: { padding: Theme.spacing.md, paddingBottom: 40 },
  avatarCard: {
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  avatarPress: { alignItems: 'center' },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
    backgroundColor: Theme.colors.border,
  },
  photoHint: { color: Theme.colors.primary, fontWeight: '700', fontSize: 13, marginBottom: 8 },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '800' },
  name: { fontSize: 22, fontWeight: '800', color: Theme.colors.text },
  badge: {
    marginTop: 8,
    backgroundColor: Theme.colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: { color: Theme.colors.primaryDark, fontWeight: '800', fontSize: 13 },
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: Theme.spacing.md,
  },
  section: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  editLink: { color: Theme.colors.primary, fontWeight: '800' },
  field: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  label: { fontSize: 12, color: Theme.colors.muted, fontWeight: '600', marginBottom: 4, marginTop: 8 },
  value: { fontSize: 15, color: Theme.colors.text, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: Theme.colors.text,
    backgroundColor: Theme.colors.background,
  },
  multiline: { minHeight: 88, textAlignVertical: 'top' },
  editActions: { flexDirection: 'row', gap: 10, marginTop: Theme.spacing.md },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  cancelText: { fontWeight: '700', color: Theme.colors.muted },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.primary,
  },
  saveText: { color: '#fff', fontWeight: '800' },
  visitorNote: {
    marginTop: Theme.spacing.md,
    color: Theme.colors.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  logout: {
    marginTop: Theme.spacing.sm,
    backgroundColor: Theme.colors.danger,
    borderRadius: Theme.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutDisabled: { opacity: 0.7 },
  logoutText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  hint: {
    marginTop: Theme.spacing.lg,
    textAlign: 'center',
    color: Theme.colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
});
