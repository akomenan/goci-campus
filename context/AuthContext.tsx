import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { StudentProfile, UserRole } from '@/data/profile';
import { allocateUsername, buildBaseUsername, resolveRole } from '@/data/profile';
import {
  AuthUser,
  ensureSchoolerUsernames,
  loadSessionUserId,
  loadUsers,
  matchesLogin,
  normalizeLogin,
  publicUser,
  saveSessionUserId,
  saveUsers,
} from '@/lib/authStorage';

export type SessionUser = StudentProfile & { id: string };

export type SignUpSchoolerInput = {
  role: 'schooler';
  prenom: string;
  nom: string;
  telephone: string;
  email?: string;
  password: string;
  ville?: string;
  universite?: string;
  filiere?: string;
  niveau?: string;
};

export type SignUpObsoInput = {
  role: 'obso';
  prenom: string;
  nom: string;
  telephone: string;
  email?: string;
  password: string;
  ville?: string;
  obsoActivite?: string;
};

export type SignUpInput = SignUpSchoolerInput | SignUpObsoInput;

export type ProfileUpdateInput = Partial<
  Pick<
    StudentProfile,
    | 'photoUri'
    | 'biographie'
    | 'centresInteret'
    | 'ville'
    | 'universite'
    | 'filiere'
    | 'niveau'
    | 'email'
    | 'telephone'
    | 'prenom'
    | 'nom'
    | 'username'
    | 'obsoActivite'
  >
>;

type AuthContextValue = {
  user: SessionUser | null;
  loading: boolean;
  signIn: (login: string, password: string) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (patch: ProfileUpdateInput) => Promise<void>;
  changePassword: (current: string, next: string) => Promise<void>;
  closeAccount: (password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function makeId(): string {
  return `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

async function assertUniqueContact(users: AuthUser[], telephone: string, email: string) {
  const phoneKey = normalizeLogin(telephone);
  if (users.some((u) => normalizeLogin(u.telephone) === phoneKey)) {
    throw new Error('Ce numéro de téléphone est déjà inscrit.');
  }
  if (email) {
    const emailKey = normalizeLogin(email);
    if (users.some((u) => normalizeLogin(u.email || '') === emailKey)) {
      throw new Error('Cet e-mail est déjà inscrit.');
    }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [loaded, sessionId] = await Promise.all([loadUsers(), loadSessionUserId()]);
        const users = await ensureSchoolerUsernames(loaded);
        if (cancelled) return;
        if (sessionId) {
          const found = users.find((u) => u.id === sessionId);
          if (found) setUser(publicUser(found));
          else await saveSessionUserId(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (login: string, password: string) => {
    const trimmedLogin = login.trim();
    if (!trimmedLogin || !password) {
      throw new Error('Indique ton téléphone/e-mail et ton mot de passe.');
    }
    if (password.length < 4) {
      throw new Error('Le mot de passe doit avoir au moins 4 caractères.');
    }
    const users = await ensureSchoolerUsernames(await loadUsers());
    const found = users.find((u) => matchesLogin(u, trimmedLogin) && u.password === password);
    if (!found) throw new Error('Identifiants incorrects.');
    await saveSessionUserId(found.id);
    setUser(publicUser(found));
  }, []);

  const signUp = useCallback(async (input: SignUpInput) => {
    const prenom = input.prenom.trim();
    const nom = input.nom.trim();
    const telephone = input.telephone.trim();
    const email = (input.email || '').trim();
    const password = input.password;

    if (!prenom || !nom || !telephone) {
      throw new Error('Merci de remplir prénom, nom et téléphone.');
    }
    if (password.length < 4) {
      throw new Error('Le mot de passe doit avoir au moins 4 caractères.');
    }

    const users = await loadUsers();
    await assertUniqueContact(users, telephone, email);

    const role: UserRole = input.role === 'obso' ? 'obso' : 'schooler';
    let username: string | undefined;
    if (role === 'schooler') {
      const taken = new Set(
        users.map((u) => (u.username || '').toLowerCase()).filter(Boolean),
      );
      username = allocateUsername(buildBaseUsername(prenom, nom), taken);
    }

    const newUser: AuthUser = {
      id: makeId(),
      role,
      prenom,
      nom,
      telephone,
      email,
      password,
      username,
      ville: (input.ville || '').trim(),
      ...(role === 'schooler'
        ? {
            universite: (input as SignUpSchoolerInput).universite?.trim() || '',
            filiere: (input as SignUpSchoolerInput).filiere?.trim() || '',
            niveau: (input as SignUpSchoolerInput).niveau?.trim() || '',
          }
        : {
            obsoActivite: (input as SignUpObsoInput).obsoActivite?.trim() || '',
          }),
    };

    await saveUsers([...users, newUser]);
    await saveSessionUserId(newUser.id);
    setUser(publicUser(newUser));
  }, []);

  const signOut = useCallback(async () => {
    await saveSessionUserId(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (patch: ProfileUpdateInput) => {
      if (!user) throw new Error('Non connecté.');
      const users = await loadUsers();
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx < 0) throw new Error('Compte introuvable.');
      const current = users[idx];

      if (patch.username !== undefined) {
        const nextName = patch.username.trim();
        if (!nextName) throw new Error('Nom d’utilisateur vide.');
        const clash = users.some(
          (u) =>
            u.id !== user.id &&
            (u.username || '').toLowerCase() === nextName.toLowerCase(),
        );
        if (clash) throw new Error('Ce nom d’utilisateur est déjà pris.');
        patch = { ...patch, username: nextName };
      }

      const next: AuthUser = {
        ...current,
        ...patch,
        email: patch.email !== undefined ? patch.email.trim() : current.email,
        telephone:
          patch.telephone !== undefined ? patch.telephone.trim() : current.telephone,
      };
      const updated = [...users];
      updated[idx] = next;
      await saveUsers(updated);
      setUser(publicUser(next));
    },
    [user],
  );

  const changePassword = useCallback(
    async (currentPass: string, nextPass: string) => {
      if (!user) throw new Error('Non connecté.');
      if (nextPass.length < 4) throw new Error('Nouveau mot de passe trop court.');
      const users = await loadUsers();
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx < 0) throw new Error('Compte introuvable.');
      if (users[idx].password !== currentPass) {
        throw new Error('Mot de passe actuel incorrect.');
      }
      const updated = [...users];
      updated[idx] = { ...users[idx], password: nextPass };
      await saveUsers(updated);
    },
    [user],
  );

  const closeAccount = useCallback(
    async (password: string) => {
      if (!user) throw new Error('Non connecté.');
      const users = await loadUsers();
      const found = users.find((u) => u.id === user.id);
      if (!found || found.password !== password) {
        throw new Error('Mot de passe incorrect.');
      }
      await saveUsers(users.filter((u) => u.id !== user.id));
      await saveSessionUserId(null);
      setUser(null);
    },
    [user],
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signUp,
      signOut,
      updateProfile,
      changePassword,
      closeAccount,
    }),
    [user, loading, signIn, signUp, signOut, updateProfile, changePassword, closeAccount],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function useUserRole(): UserRole {
  const { user } = useAuth();
  return resolveRole(user);
}
