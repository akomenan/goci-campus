import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { resolveRole, roleBadge } from '@/data/profile';
import { GlassButton } from '@/components/GlassButton';

export default function ProfilScreen() {
  const { user, signOut, updateProfile } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={Theme.colors.primary} />
      </View>
    );
  }

  const isObso = resolveRole(user) === 'obso';
  const badge = roleBadge(user);
  const initials = `${user.prenom?.[0] ?? ''}${user.nom?.[0] ?? ''}`.toUpperCase() || '?';

  async function onSignOut() {
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
    }
  }

  async function onPickPhoto() {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission requise', 'Autorise l’accès à la galerie.');
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <Pressable onPress={onPickPhoto} style={styles.avatarPress}>
          {user.photoUri ? (
            <Image source={{ uri: user.photoUri }} style={styles.photo} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          )}
        </Pressable>
        <Text style={styles.name}>
          {user.prenom} {user.nom}
        </Text>
        <View style={[styles.badge, isObso ? styles.badgeObso : styles.badgeSchooler]}>
          <Text style={[styles.badgeText, isObso && styles.badgeTextObso]}>{badge}</Text>
        </View>
        <Text style={styles.userId}>ID : {user.id}</Text>
        <Text style={styles.idHint}>
          {isObso
            ? 'Les SCHOOLER peuvent te retrouver avec cet ID.'
            : 'Partage cet ID pour que d’autres SCHOOLER te retrouvent.'}
        </Text>
      </View>

      {isObso ? (
        <View style={styles.obsoBlock}>
          <GlassButton
            label="PARTAGER UNE ANNONCE"
            onPress={() => setMenuOpen((v) => !v)}
            style={{ marginBottom: 8 }}
          />
          {menuOpen ? (
            <View style={styles.dropdown}>
              <Pressable
                style={styles.dropItem}
                onPress={() => {
                  setMenuOpen(false);
                  router.push('/(tabs)/profil/publier-logement');
                }}>
                <Text style={styles.dropText}>Logement</Text>
              </Pressable>
              <Pressable
                style={styles.dropItem}
                onPress={() => {
                  setMenuOpen(false);
                  router.push('/(tabs)/profil/publier-stage');
                }}>
                <Text style={styles.dropText}>Stage / Job</Text>
              </Pressable>
              <Pressable
                style={[styles.dropItem, styles.dropItemLast]}
                onPress={() => {
                  setMenuOpen(false);
                  router.push('/(tabs)/profil/publier-ecole');
                }}>
                <Text style={styles.dropText}>Mon école</Text>
              </Pressable>
            </View>
          ) : null}

          <GlassButton
            label="MES ANNONCES"
            variant="secondary"
            onPress={() => router.push('/(tabs)/profil/mes-annonces')}
            style={{ marginTop: 12 }}
          />

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Infos OBSO</Text>
            <Text style={styles.infoLine}>Tél. {user.telephone}</Text>
            {user.email ? <Text style={styles.infoLine}>{user.email}</Text> : null}
            {user.ville ? <Text style={styles.infoLine}>{user.ville}</Text> : null}
            {user.obsoActivite ? (
              <Text style={styles.infoLine}>{user.obsoActivite}</Text>
            ) : null}
          </View>
        </View>
      ) : (
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Infos SCHOOLER</Text>
          <Text style={styles.infoLine}>Tél. {user.telephone}</Text>
          {user.email ? <Text style={styles.infoLine}>{user.email}</Text> : null}
          {user.ville ? <Text style={styles.infoLine}>Ville : {user.ville}</Text> : null}
          {user.universite ? (
            <Text style={styles.infoLine}>École : {user.universite}</Text>
          ) : null}
          {user.filiere ? <Text style={styles.infoLine}>Filière : {user.filiere}</Text> : null}
          {user.niveau ? <Text style={styles.infoLine}>Niveau : {user.niveau}</Text> : null}
          <Text style={styles.schoolerNote}>
            Tu viens pour trouver école, logement, stages/jobs, lire les briefs, et te
            retrouver entre SCHOOLER via votre ID.
          </Text>
        </View>
      )}

      <GlassButton
        label="Déconnexion"
        variant="danger"
        onPress={onSignOut}
        busy={busy}
        style={{ marginTop: 8 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  centered: { alignItems: 'center', justifyContent: 'center' },
  content: { padding: Theme.spacing.md, paddingBottom: 48 },
  heroCard: {
    ...Theme.glass,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  avatarPress: { alignItems: 'center' },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  photo: { width: 84, height: 84, borderRadius: 42, marginBottom: 10 },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '800' },
  name: { fontSize: 22, fontWeight: '800', color: Theme.colors.text },
  badge: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeSchooler: { backgroundColor: Theme.colors.primarySoft },
  badgeObso: { backgroundColor: 'rgba(249,115,22,0.18)' },
  badgeText: { fontWeight: '800', fontSize: 13, color: Theme.colors.primaryDark },
  badgeTextObso: { color: Theme.colors.orange },
  userId: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  idHint: {
    marginTop: 4,
    fontSize: 12,
    color: Theme.colors.muted,
    textAlign: 'center',
    lineHeight: 17,
  },
  obsoBlock: { marginBottom: Theme.spacing.md },
  dropdown: {
    ...Theme.glass,
    borderRadius: Theme.radius.md,
    overflow: 'hidden',
    marginBottom: 4,
  },
  dropItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(15,23,42,0.06)',
  },
  dropItemLast: { borderBottomWidth: 0 },
  dropText: { fontWeight: '700', fontSize: 15, color: Theme.colors.text },
  infoCard: {
    ...Theme.glass,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  infoTitle: { fontWeight: '800', fontSize: 16, marginBottom: 8, color: Theme.colors.text },
  infoLine: { color: Theme.colors.text, marginBottom: 4, fontSize: 14 },
  schoolerNote: {
    marginTop: 12,
    color: Theme.colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
});

