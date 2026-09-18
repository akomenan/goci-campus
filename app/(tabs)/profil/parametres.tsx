import { useEffect, useState } from 'react';
import {
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
import { useRouter } from 'expo-router';
import { Theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { NIVEAUX, resolveRole } from '@/data/profile';
import { GlassButton } from '@/components/GlassButton';

type Section =
  | 'menu'
  | 'infos'
  | 'password'
  | 'username'
  | 'bio'
  | 'photo'
  | 'interets'
  | 'fermer';

export default function ParametresScreen() {
  const { user, updateProfile, changePassword, signOut, closeAccount } = useAuth();
  const router = useRouter();
  const [section, setSection] = useState<Section>('menu');
  const [busy, setBusy] = useState(false);

  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [ville, setVille] = useState('');
  const [universite, setUniversite] = useState('');
  const [filiere, setFiliere] = useState('');
  const [niveau, setNiveau] = useState('');
  const [obsoActivite, setObsoActivite] = useState('');

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [interets, setInterets] = useState('');
  const [curPass, setCurPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [closePass, setClosePass] = useState('');

  useEffect(() => {
    if (!user) return;
    setPrenom(user.prenom || '');
    setNom(user.nom || '');
    setTelephone(user.telephone || '');
    setEmail(user.email || '');
    setVille(user.ville || '');
    setUniversite(user.universite || '');
    setFiliere(user.filiere || '');
    setNiveau(user.niveau || '');
    setObsoActivite(user.obsoActivite || '');
    setUsername(user.username || '');
    setBio(user.biographie || '');
    setInterets(user.centresInteret || '');
  }, [user]);

  if (!user) return null;

  const isSchooler = resolveRole(user) === 'schooler';

  async function run(fn: () => Promise<void>, okMsg?: string) {
    setBusy(true);
    try {
      await fn();
      if (okMsg) Alert.alert('OK', okMsg);
      setSection('menu');
    } catch (e) {
      Alert.alert('Erreur', e instanceof Error ? e.message : 'Action impossible.');
    } finally {
      setBusy(false);
    }
  }

  async function onPickPhoto() {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission', 'Autorise l’accès à la galerie.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (result.canceled || !result.assets?.[0]?.uri) return;
      await run(
        () => updateProfile({ photoUri: result.assets![0].uri }),
        'Photo mise à jour.',
      );
    } catch (e) {
      Alert.alert('Erreur', e instanceof Error ? e.message : 'Photo impossible.');
    }
  }

  if (section === 'menu') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Paramètres</Text>
        <MenuRow label="Modifier le profil" onPress={() => setSection('infos')} />
        <MenuRow label="Mot de passe" onPress={() => setSection('password')} />
        {isSchooler ? (
          <MenuRow label="Nom d’utilisateur" onPress={() => setSection('username')} />
        ) : null}
        <MenuRow label="Bio" onPress={() => setSection('bio')} />
        <MenuRow label="Photo de profil" onPress={() => setSection('photo')} />
        {isSchooler ? (
          <MenuRow label="Centres d’intérêt" onPress={() => setSection('interets')} />
        ) : null}
        <MenuRow
          label="Déconnexion"
          danger
          onPress={() =>
            run(async () => {
              await signOut();
              router.replace('/(auth)/login');
            })
          }
        />
        <MenuRow label="Fermer le compte" danger onPress={() => setSection('fermer')} />
        <GlassButton
          label="Retour"
          variant="secondary"
          onPress={() => router.back()}
          style={{ marginTop: 16 }}
        />
      </ScrollView>
    );
  }

  if (section === 'photo') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Photo de profil</Text>
        {user.photoUri ? (
          <Image source={{ uri: user.photoUri }} style={styles.preview} />
        ) : (
          <View style={[styles.preview, styles.previewEmpty]}>
            <Text style={styles.previewEmptyText}>Aucune photo</Text>
          </View>
        )}
        <GlassButton label="Choisir une photo" onPress={onPickPhoto} busy={busy} />
        <GlassButton
          label="Retour"
          variant="secondary"
          onPress={() => setSection('menu')}
          style={{ marginTop: 10 }}
        />
      </ScrollView>
    );
  }

  if (section === 'infos') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Modifier le profil</Text>
        <Field label="Prénom" value={prenom} onChangeText={setPrenom} />
        <Field label="Nom" value={nom} onChangeText={setNom} />
        <Field
          label="Numéro"
          value={telephone}
          onChangeText={setTelephone}
          keyboardType="phone-pad"
        />
        <Field
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Field label="Ville / Commune" value={ville} onChangeText={setVille} />
        {isSchooler ? (
          <>
            <Field label="École" value={universite} onChangeText={setUniversite} />
            <Field label="Filière" value={filiere} onChangeText={setFiliere} />
            <Text style={styles.label}>Niveau</Text>
            <View style={styles.chips}>
              {NIVEAUX.map((n) => (
                <Pressable
                  key={n}
                  onPress={() => setNiveau(n)}
                  style={[styles.chip, niveau === n && styles.chipOn]}>
                  <Text style={[styles.chipText, niveau === n && styles.chipTextOn]}>{n}</Text>
                </Pressable>
              ))}
            </View>
          </>
        ) : (
          <Field label="Activité" value={obsoActivite} onChangeText={setObsoActivite} />
        )}
        <GlassButton
          label="Enregistrer"
          busy={busy}
          onPress={() =>
            run(
              () =>
                updateProfile({
                  prenom,
                  nom,
                  telephone,
                  email,
                  ville,
                  ...(isSchooler
                    ? { universite, filiere, niveau }
                    : { obsoActivite }),
                }),
              'Profil mis à jour.',
            )
          }
        />
        <GlassButton
          label="Retour"
          variant="secondary"
          onPress={() => setSection('menu')}
          style={{ marginTop: 10 }}
        />
      </ScrollView>
    );
  }

  if (section === 'password') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Mot de passe</Text>
        <Field
          label="Mot de passe actuel"
          value={curPass}
          onChangeText={setCurPass}
          secureTextEntry
        />
        <Field
          label="Nouveau mot de passe"
          value={newPass}
          onChangeText={setNewPass}
          secureTextEntry
        />
        <GlassButton
          label="Changer"
          busy={busy}
          onPress={() =>
            run(async () => {
              await changePassword(curPass, newPass);
              setCurPass('');
              setNewPass('');
            }, 'Mot de passe changé.')
          }
        />
        <GlassButton
          label="Retour"
          variant="secondary"
          onPress={() => setSection('menu')}
          style={{ marginTop: 10 }}
        />
      </ScrollView>
    );
  }

  if (section === 'username') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Nom d’utilisateur</Text>
        <Field
          label="ID"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <GlassButton
          label="Enregistrer"
          busy={busy}
          onPress={() =>
            run(() => updateProfile({ username }), 'Nom d’utilisateur mis à jour.')
          }
        />
        <GlassButton
          label="Retour"
          variant="secondary"
          onPress={() => setSection('menu')}
          style={{ marginTop: 10 }}
        />
      </ScrollView>
    );
  }

  if (section === 'bio') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Bio</Text>
        <Text style={styles.label}>Texte</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={bio}
          onChangeText={setBio}
          multiline
          placeholderTextColor={Theme.colors.muted}
        />
        <GlassButton
          label="Enregistrer"
          busy={busy}
          onPress={() =>
            run(() => updateProfile({ biographie: bio }), 'Bio enregistrée.')
          }
        />
        <GlassButton
          label="Retour"
          variant="secondary"
          onPress={() => setSection('menu')}
          style={{ marginTop: 10 }}
        />
      </ScrollView>
    );
  }

  if (section === 'interets') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Centres d’intérêt</Text>
        <Text style={styles.label}>Liste</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={interets}
          onChangeText={setInterets}
          multiline
          placeholder="Ex. tech, sport, musique"
          placeholderTextColor={Theme.colors.muted}
        />
        <GlassButton
          label="Enregistrer"
          busy={busy}
          onPress={() =>
            run(
              () => updateProfile({ centresInteret: interets }),
              'Centres d’intérêt enregistrés.',
            )
          }
        />
        <GlassButton
          label="Retour"
          variant="secondary"
          onPress={() => setSection('menu')}
          style={{ marginTop: 10 }}
        />
      </ScrollView>
    );
  }

  // fermer
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Fermer le compte</Text>
      <Field
        label="Mot de passe"
        value={closePass}
        onChangeText={setClosePass}
        secureTextEntry
      />
      <GlassButton
        label="Fermer définitivement"
        variant="danger"
        busy={busy}
        onPress={() =>
          Alert.alert('Confirmer', 'Supprimer ce compte ?', [
            { text: 'Annuler', style: 'cancel' },
            {
              text: 'Fermer',
              style: 'destructive',
              onPress: () =>
                run(async () => {
                  await closeAccount(closePass);
                  router.replace('/(auth)/login');
                }),
            },
          ])
        }
      />
      <GlassButton
        label="Retour"
        variant="secondary"
        onPress={() => setSection('menu')}
        style={{ marginTop: 10 }}
      />
    </ScrollView>
  );
}

function MenuRow({
  label,
  onPress,
  danger,
}: {
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Text style={[styles.rowText, danger && styles.rowDanger]}>{label}</Text>
    </Pressable>
  );
}

function Field({
  label,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences';
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholderTextColor={Theme.colors.muted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  content: { padding: Theme.spacing.md, paddingBottom: 48 },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: 16,
  },
  row: {
    ...Theme.glass,
    borderRadius: Theme.radius.md,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  rowText: { fontWeight: '700', fontSize: 15, color: Theme.colors.text },
  rowDanger: { color: Theme.colors.danger || '#dc2626' },
  label: {
    fontWeight: '700',
    fontSize: 13,
    color: Theme.colors.muted,
    marginBottom: 6,
  },
  input: {
    ...Theme.glass,
    borderRadius: Theme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Theme.colors.text,
  },
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(15,23,42,0.06)',
  },
  chipOn: { backgroundColor: Theme.colors.primarySoft },
  chipText: { fontWeight: '600', color: Theme.colors.text, fontSize: 13 },
  chipTextOn: { color: Theme.colors.primaryDark },
  preview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 16,
  },
  previewEmpty: {
    backgroundColor: Theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewEmptyText: { color: Theme.colors.muted, fontWeight: '600' },
});
