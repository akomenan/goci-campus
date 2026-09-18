import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { ProttectorLogo } from '@/components/ProttectorLogo';
import { GlassButton } from '@/components/GlassButton';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    setError(null);
    setBusy(true);
    try {
      await signIn(login, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Connexion impossible.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <View style={styles.darkBand}>
          <ProttectorLogo height={48} />
          <Text style={styles.subtitle}>Connexion</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.glassCard}>
            <Text style={styles.label}>Téléphone ou e-mail</Text>
            <TextInput
              style={styles.input}
              value={login}
              onChangeText={setLogin}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="+225 … ou toi@email.com"
              placeholderTextColor={Theme.colors.muted}
            />
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Au moins 4 caractères"
              placeholderTextColor={Theme.colors.muted}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <GlassButton label="Se connecter" onPress={onSubmit} busy={busy} style={{ marginTop: 12 }} />
          </View>

          <Text style={styles.or}>Pas encore de compte ?</Text>
          <Text style={styles.orSub}>Choisis ton type d’inscription</Text>

          <GlassButton
            label="S’inscrire en SCHOOLER"
            variant="primary"
            onPress={() => router.push('/(auth)/register')}
            style={{ marginBottom: 10 }}
          />
          <Text style={styles.hint}>Élèves, étudiants…</Text>

          <GlassButton
            label="S’inscrire en OBSO"
            variant="secondary"
            onPress={() => router.push('/(auth)/register-obso')}
            style={{ marginTop: 14 }}
          />
          <Text style={styles.hint}>
            Visiteurs, particuliers, chefs d’entreprise, propriétaires…
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Theme.colors.background },
  content: { paddingBottom: 40 },
  darkBand: {
    backgroundColor: Theme.colors.orange,
    paddingTop: 56,
    paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  subtitle: { marginTop: 8, color: 'rgba(255,255,255,0.95)', fontWeight: '700', fontSize: 16 },
  body: { padding: Theme.spacing.md, marginTop: -12 },
  glassCard: {
    ...Theme.glass,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  label: { fontSize: 12, fontWeight: '700', color: Theme.colors.muted, marginBottom: 6, marginTop: 8 },
  input: {
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Theme.colors.text,
  },
  error: { color: Theme.colors.danger, marginTop: 10, fontWeight: '600' },
  or: { fontSize: 16, fontWeight: '800', color: Theme.colors.text, textAlign: 'center' },
  orSub: { textAlign: 'center', color: Theme.colors.muted, marginBottom: 14, marginTop: 4 },
  hint: { textAlign: 'center', color: Theme.colors.muted, fontSize: 12, marginTop: 6 },
});
