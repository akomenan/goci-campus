import { useState } from 'react';
import {
  ActivityIndicator,
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
import { Theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { ProttectorLogo } from '@/components/ProttectorLogo';

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
        <Text style={styles.proto}>Proto local — données sur cet appareil</Text>

        <View style={styles.card}>
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

          <Pressable
            style={[styles.primaryBtn, busy && styles.buttonDisabled]}
            onPress={onSubmit}
            disabled={busy}>
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Se connecter</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>Pas encore de compte ?</Text>
          <Text style={styles.ctaSub}>Inscription en quelques minutes</Text>
          <Pressable
            style={styles.secondaryBtn}
            onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.secondaryBtnText}>Créer un compte</Text>
          </Pressable>
        </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Theme.colors.background },
  content: { paddingBottom: 40 },
  darkBand: {
    alignSelf: 'stretch',
    width: '100%',
    backgroundColor: '#F97316',
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 28,
    paddingHorizontal: Theme.spacing.md,
  },
  body: { padding: Theme.spacing.md, paddingTop: Theme.spacing.lg },
  logo: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: Theme.colors.primary },
  subtitle: { marginTop: 10, color: 'rgba(255,255,255,0.65)', fontSize: 15 },
  proto: {
    textAlign: 'center',
    color: Theme.colors.muted,
    fontSize: 12,
    marginBottom: Theme.spacing.md,
  },
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    shadowColor: '#0F766E',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: Theme.colors.text,
    backgroundColor: Theme.colors.background,
    marginBottom: 8,
  },
  error: { color: Theme.colors.danger, marginTop: 4, marginBottom: 8, fontSize: 13 },
  primaryBtn: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: Theme.spacing.sm,
    shadowColor: '#0F766E',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  buttonDisabled: { opacity: 0.7 },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 16, letterSpacing: 0.3 },
  ctaBox: {
    marginTop: Theme.spacing.lg,
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.text,
    textAlign: 'center',
  },
  ctaSub: {
    marginTop: 4,
    marginBottom: Theme.spacing.md,
    color: Theme.colors.muted,
    textAlign: 'center',
    fontSize: 13,
  },
  secondaryBtn: {
    alignSelf: 'stretch',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Theme.colors.primary,
  },
  secondaryBtnText: {
    color: Theme.colors.primaryDark,
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
