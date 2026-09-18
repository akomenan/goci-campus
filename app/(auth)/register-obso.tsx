import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { GlassButton } from '@/components/GlassButton';

export default function RegisterObsoScreen() {
  const { signUp } = useAuth();
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ville, setVille] = useState('');
  const [obsoActivite, setObsoActivite] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const canSubmit = useMemo(
    () => prenom.trim() && nom.trim() && telephone.trim() && password.length >= 4,
    [prenom, nom, telephone, password],
  );

  async function onSubmit() {
    setError(null);
    setBusy(true);
    try {
      await signUp({
        role: 'obso',
        prenom,
        nom,
        telephone,
        email,
        password,
        ville,
        obsoActivite,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Inscription impossible.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.badge}>
          <Text style={styles.badgeText}>OBSO</Text>
        </View>
        <Text style={styles.title}>Créer un compte OBSO</Text>
        <Text style={styles.sub}>
          Observateur — visiteurs, particuliers, entreprises, propriétaires…
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Prénom *</Text>
          <TextInput style={styles.input} value={prenom} onChangeText={setPrenom} />
          <Text style={styles.label}>Nom *</Text>
          <TextInput style={styles.input} value={nom} onChangeText={setNom} />
          <Text style={styles.label}>Téléphone *</Text>
          <TextInput
            style={styles.input}
            value={telephone}
            onChangeText={setTelephone}
            keyboardType="phone-pad"
          />
          <Text style={styles.label}>E-mail (optionnel)</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.label}>Mot de passe *</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Text style={styles.label}>Ville (optionnel)</Text>
          <TextInput style={styles.input} value={ville} onChangeText={setVille} />
          <Text style={styles.label}>Tu es plutôt… (optionnel)</Text>
          <TextInput
            style={styles.input}
            value={obsoActivite}
            onChangeText={setObsoActivite}
            placeholder="Ex. propriétaire, recruteur, particulier…"
            placeholderTextColor={Theme.colors.muted}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <GlassButton
            label="Créer mon compte OBSO"
            onPress={onSubmit}
            busy={busy}
            disabled={!canSubmit}
            style={{ marginTop: 16 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Theme.colors.background },
  content: { padding: Theme.spacing.md, paddingBottom: 48 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(249,115,22,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 8,
  },
  badgeText: { color: Theme.colors.orange, fontWeight: '800', fontSize: 12 },
  title: { fontSize: 22, fontWeight: '800', color: Theme.colors.text },
  sub: { color: Theme.colors.muted, marginBottom: 16, marginTop: 4, lineHeight: 20 },
  card: { ...Theme.glass, borderRadius: Theme.radius.lg, padding: Theme.spacing.md },
  label: { fontSize: 12, fontWeight: '700', color: Theme.colors.muted, marginTop: 10, marginBottom: 6 },
  input: {
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Theme.colors.text,
  },
  error: { color: Theme.colors.danger, marginTop: 12, fontWeight: '600' },
});
