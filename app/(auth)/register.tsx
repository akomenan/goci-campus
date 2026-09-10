import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { Theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import {
  NIVEAUX,
  RECHERCHE_OPTIONS,
  type RechercheBesoin,
} from '@/data/profile';
import { universities } from '@/data/universities';
import { ProttectorLogo } from '@/components/ProttectorLogo';

type RegisterMode = 'etudiant' | 'bachelier' | 'particulier';

function parseMode(raw: string | string[] | undefined): RegisterMode {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v === 'bachelier' || v === 'particulier' || v === 'etudiant') return v;
  if (v === 'visiteur') return 'bachelier';
  return 'etudiant';
}

const MODE_LABEL: Record<RegisterMode, string> = {
  etudiant: 'Étudiant',
  bachelier: 'Bachelier',
  particulier: 'Particulier',
};

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const params = useLocalSearchParams<{ mode?: string; type?: string }>();
  const [mode, setMode] = useState<RegisterMode>(() =>
    parseMode(params.mode ?? params.type),
  );
  const [jeSuisOpen, setJeSuisOpen] = useState(false);

  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ville, setVille] = useState('');
  const [universite, setUniversite] = useState('');
  const [filiere, setFiliere] = useState('');
  const [niveau, setNiveau] = useState<(typeof NIVEAUX)[number]>('L1');
  const [anneeBac, setAnneeBac] = useState('');
  const [recherches, setRecherches] = useState<RechercheBesoin[]>([]);
  const [univOpen, setUnivOpen] = useState(false);
  const [niveauOpen, setNiveauOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const univOptions = useMemo(
    () =>
      universities.map((u) => ({
        id: u.id,
        label: `${u.sigle} — ${u.nom}`,
        ville: u.ville,
      })),
    [],
  );

  const intro =
    mode === 'etudiant'
      ? 'Compte Étudiant — université, filière et niveau.'
      : mode === 'bachelier'
        ? 'Compte Bachelier — formulaire court, orientation.'
        : 'Compte Particulier — dis-nous ce que tu cherches.';

  const jeSuisLabel =
    mode === 'etudiant' ? 'JE SUIS' : `JE SUIS · ${MODE_LABEL[mode]}`;

  function selectMode(next: RegisterMode) {
    setMode(next);
    setJeSuisOpen(false);
    setError(null);
  }

  function toggleRecherche(id: RechercheBesoin) {
    setRecherches((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function onSubmit() {
    setError(null);
    setBusy(true);
    try {
      if (mode === 'etudiant') {
        await signUp({
          role: 'etudiant',
          prenom,
          nom,
          telephone,
          email,
          password,
          ville,
          universite,
          filiere,
          niveau,
        });
      } else {
        await signUp({
          role: 'visiteur',
          visiteurType: mode,
          prenom,
          nom,
          telephone,
          email,
          password,
          anneeBac: mode === 'bachelier' ? anneeBac : undefined,
          ville: mode === 'bachelier' ? ville : undefined,
          recherches: mode === 'particulier' ? recherches : undefined,
        });
      }
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
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <View style={styles.darkBand}>
          <ProttectorLogo height={44} />
        </View>
        <View style={styles.body}>
        <Text style={styles.proto}>Proto local — données sur cet appareil</Text>
        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.intro}>{intro}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Prénom *</Text>
          <TextInput
            style={styles.input}
            value={prenom}
            onChangeText={setPrenom}
            placeholder="Ex. Amos"
            placeholderTextColor={Theme.colors.muted}
          />

          <Text style={styles.label}>Nom *</Text>
          <TextInput
            style={styles.input}
            value={nom}
            onChangeText={setNom}
            placeholder="Ex. Kouassi"
            placeholderTextColor={Theme.colors.muted}
          />

          <Text style={styles.label}>Téléphone *</Text>
          <TextInput
            style={styles.input}
            value={telephone}
            onChangeText={setTelephone}
            keyboardType="phone-pad"
            placeholder="+225 07 …"
            placeholderTextColor={Theme.colors.muted}
          />

          <Text style={styles.label}>E-mail (optionnel)</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="toi@email.com"
            placeholderTextColor={Theme.colors.muted}
          />

          <Text style={styles.label}>Mot de passe *</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Au moins 4 caractères"
            placeholderTextColor={Theme.colors.muted}
          />

          {mode === 'etudiant' ? (
            <>
              <Text style={styles.label}>Ville *</Text>
              <TextInput
                style={styles.input}
                value={ville}
                onChangeText={setVille}
                placeholder="Ex. Abidjan"
                placeholderTextColor={Theme.colors.muted}
              />

              <Text style={styles.label}>Université *</Text>
              <Pressable style={styles.picker} onPress={() => setUnivOpen(true)}>
                <Text
                  style={universite ? styles.pickerValue : styles.pickerPlaceholder}
                  numberOfLines={2}>
                  {universite || 'Choisir une université'}
                </Text>
                <Text style={styles.chevron}>▾</Text>
              </Pressable>
              <TextInput
                style={[styles.input, { marginTop: 8 }]}
                value={universite}
                onChangeText={setUniversite}
                placeholder="Ou taper le nom de l’université"
                placeholderTextColor={Theme.colors.muted}
              />

              <Text style={styles.label}>Filière *</Text>
              <TextInput
                style={styles.input}
                value={filiere}
                onChangeText={setFiliere}
                placeholder="Ex. Informatique"
                placeholderTextColor={Theme.colors.muted}
              />

              <Text style={styles.label}>Niveau *</Text>
              <Pressable style={styles.picker} onPress={() => setNiveauOpen(true)}>
                <Text style={styles.pickerValue}>{niveau}</Text>
                <Text style={styles.chevron}>▾</Text>
              </Pressable>
            </>
          ) : null}

          {mode === 'bachelier' ? (
            <>
              <Text style={styles.label}>Année du bac (optionnel)</Text>
              <TextInput
                style={styles.input}
                value={anneeBac}
                onChangeText={setAnneeBac}
                keyboardType="number-pad"
                placeholder="Ex. 2026"
                placeholderTextColor={Theme.colors.muted}
              />
              <Text style={styles.label}>Ville (optionnel)</Text>
              <TextInput
                style={styles.input}
                value={ville}
                onChangeText={setVille}
                placeholder="Ex. Abidjan"
                placeholderTextColor={Theme.colors.muted}
              />
            </>
          ) : null}

          {mode === 'particulier' ? (
            <>
              <Text style={styles.label}>Je cherche… (optionnel)</Text>
              <View style={styles.chips}>
                {RECHERCHE_OPTIONS.map((opt) => {
                  const active = recherches.includes(opt.id);
                  return (
                    <Pressable
                      key={opt.id}
                      onPress={() => toggleRecherche(opt.id)}
                      style={[styles.chip, active && styles.chipActive]}>
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : null}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={[styles.primaryBtn, busy && styles.buttonDisabled]}
            onPress={onSubmit}
            disabled={busy}>
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Créer mon compte</Text>
            )}
          </Pressable>
        </View>

        <Pressable style={styles.jeSuisBtn} onPress={() => setJeSuisOpen(true)}>
          <Text style={styles.jeSuisBtnText}>{jeSuisLabel}</Text>
          <Text style={styles.jeSuisHint}>Changer le type de compte</Text>
        </Pressable>

        {mode !== 'etudiant' ? (
          <Pressable onPress={() => selectMode('etudiant')} style={styles.studentLinkWrap}>
            <Text style={styles.studentLink}>Formulaire étudiant</Text>
          </Pressable>
        ) : null}

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Déjà inscrit ? </Text>
          <Link href="/(auth)/login" style={styles.link}>
            Se connecter
          </Link>
        </View>
        </View>
      </ScrollView>

      <Modal visible={jeSuisOpen} animationType="slide" transparent>
        <Pressable style={styles.sheetOverlay} onPress={() => setJeSuisOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Je suis…</Text>
            <Text style={styles.sheetSub}>Choisis le profil qui te correspond</Text>

            {mode !== 'etudiant' ? (
              <Pressable
                style={styles.sheetOption}
                onPress={() => selectMode('etudiant')}>
                <Text style={styles.sheetOptionEmoji}>🎓</Text>
                <View style={styles.sheetOptionBody}>
                  <Text style={styles.sheetOptionTitle}>Étudiant</Text>
                  <Text style={styles.sheetOptionSub}>
                    Déjà inscrit à l’université ou grande école
                  </Text>
                </View>
              </Pressable>
            ) : null}

            <Pressable
              style={[styles.sheetOption, mode === 'bachelier' && styles.sheetOptionActive]}
              onPress={() => selectMode('bachelier')}>
              <Text style={styles.sheetOptionEmoji}>📘</Text>
              <View style={styles.sheetOptionBody}>
                <Text style={styles.sheetOptionTitle}>Bachelier</Text>
                <Text style={styles.sheetOptionSub}>
                  Nouveau bachelier — orientation & écoles
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={[styles.sheetOption, mode === 'particulier' && styles.sheetOptionActive]}
              onPress={() => selectMode('particulier')}>
              <Text style={styles.sheetOptionEmoji}>👤</Text>
              <View style={styles.sheetOptionBody}>
                <Text style={styles.sheetOptionTitle}>Particulier</Text>
                <Text style={styles.sheetOptionSub}>
                  Parent ou visiteur — école, logement, stage
                </Text>
              </View>
            </Pressable>

            <Pressable style={styles.sheetClose} onPress={() => setJeSuisOpen(false)}>
              <Text style={styles.sheetCloseText}>Fermer</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={univOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choisir une université</Text>
            <ScrollView style={styles.modalList}>
              {univOptions.map((u) => (
                <Pressable
                  key={u.id}
                  style={styles.modalItem}
                  onPress={() => {
                    setUniversite(u.label);
                    if (!ville.trim()) setVille(u.ville);
                    setUnivOpen(false);
                  }}>
                  <Text style={styles.modalItemText}>{u.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable style={styles.modalClose} onPress={() => setUnivOpen(false)}>
              <Text style={styles.modalCloseText}>Fermer</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={niveauOpen} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: 360 }]}>
            <Text style={styles.modalTitle}>Niveau</Text>
            {NIVEAUX.map((n) => (
              <Pressable
                key={n}
                style={styles.modalItem}
                onPress={() => {
                  setNiveau(n);
                  setNiveauOpen(false);
                }}>
                <Text style={styles.modalItemText}>{n}</Text>
              </Pressable>
            ))}
            <Pressable style={styles.modalClose} onPress={() => setNiveauOpen(false)}>
              <Text style={styles.modalCloseText}>Fermer</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Theme.colors.background },
  content: { paddingBottom: 48 },
  darkBand: {
    alignSelf: 'stretch',
    width: '100%',
    backgroundColor: '#F97316',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: Theme.spacing.md,
  },
  body: { padding: Theme.spacing.md, paddingTop: Theme.spacing.md },
  proto: {
    textAlign: 'center',
    color: Theme.colors.muted,
    fontSize: 12,
    marginBottom: Theme.spacing.sm,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  intro: {
    textAlign: 'center',
    color: Theme.colors.muted,
    fontSize: 14,
    marginTop: 6,
    marginBottom: Theme.spacing.md,
    lineHeight: 20,
  },
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    shadowColor: '#0F766E',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
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
  },
  picker: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: Theme.colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  pickerValue: { flex: 1, color: Theme.colors.text, fontSize: 15, fontWeight: '600' },
  pickerPlaceholder: { flex: 1, color: Theme.colors.muted, fontSize: 15 },
  chevron: { color: Theme.colors.primary, fontSize: 16, fontWeight: '700' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Theme.colors.background,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  chipActive: {
    backgroundColor: Theme.colors.primarySoft,
    borderColor: Theme.colors.primary,
  },
  chipText: { color: Theme.colors.muted, fontWeight: '700', fontSize: 13 },
  chipTextActive: { color: Theme.colors.primaryDark },
  error: { color: Theme.colors.danger, marginTop: 10, fontSize: 13 },
  primaryBtn: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: Theme.spacing.md,
    shadowColor: '#0F766E',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  buttonDisabled: { opacity: 0.7 },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 16, letterSpacing: 0.3 },
  jeSuisBtn: {
    marginTop: Theme.spacing.lg,
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Theme.colors.primary,
    shadowColor: '#0F766E',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  jeSuisBtnText: {
    color: Theme.colors.primaryDark,
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 1.2,
  },
  jeSuisHint: { marginTop: 4, color: Theme.colors.muted, fontSize: 12 },
  studentLinkWrap: { alignItems: 'center', marginTop: Theme.spacing.md },
  studentLink: {
    color: Theme.colors.primary,
    fontWeight: '700',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Theme.spacing.lg,
    flexWrap: 'wrap',
  },
  footerText: { color: Theme.colors.muted },
  link: { color: Theme.colors.primary, fontWeight: '700' },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Theme.colors.card,
    borderTopLeftRadius: Theme.radius.xl,
    borderTopRightRadius: Theme.radius.xl,
    padding: Theme.spacing.md,
    paddingBottom: 28,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 999,
    backgroundColor: Theme.colors.border,
    marginBottom: Theme.spacing.md,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.text,
    textAlign: 'center',
  },
  sheetSub: {
    textAlign: 'center',
    color: Theme.colors.muted,
    fontSize: 13,
    marginTop: 4,
    marginBottom: Theme.spacing.md,
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.background,
    marginBottom: 10,
  },
  sheetOptionActive: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.primarySoft,
  },
  sheetOptionEmoji: { fontSize: 22 },
  sheetOptionBody: { flex: 1 },
  sheetOptionTitle: { fontWeight: '800', fontSize: 16, color: Theme.colors.text },
  sheetOptionSub: { marginTop: 2, color: Theme.colors.muted, fontSize: 12, lineHeight: 17 },
  sheetClose: { alignItems: 'center', paddingVertical: 12, marginTop: 4 },
  sheetCloseText: { color: Theme.colors.primary, fontWeight: '800', fontSize: 15 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Theme.colors.card,
    borderTopLeftRadius: Theme.radius.xl,
    borderTopRightRadius: Theme.radius.xl,
    maxHeight: '75%',
    padding: Theme.spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  modalList: { maxHeight: 420 },
  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  modalItemText: { fontSize: 15, color: Theme.colors.text, fontWeight: '600' },
  modalClose: {
    marginTop: Theme.spacing.md,
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalCloseText: { color: Theme.colors.primary, fontWeight: '800', fontSize: 16 },
});
