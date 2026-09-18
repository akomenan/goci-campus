import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { StudentProfile, UserRole } from '@/data/profile';
import { resolveRole } from '@/data/profile';
import {
  AuthUser,
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
    | 'parcours'
    | 'ambitions'
    | 'ville'
    | 'universite'
    | 'filiere'
    | 'niveau'
    | 'email'
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
        const [users, sessionId] = await Promise.all([loadUsers(), loadSessionUserId()]);
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
    const users = await loadUsers();
    const found = users.find((u) => matchesLogin(u, trimmedLogin) && u.password === password);
    if (!found) throw new Error('Identifiants incorrects. Vérifie et réessaie.');
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
    const newUser: AuthUser = {
      id: makeId(),
      role,
      prenom,
      nom,
      telephone,
      email,
      password,
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
      const next: AuthUser = {
        ...current,
        ...patch,
        email: patch.email !== undefined ? patch.email.trim() : current.email,
      };
      const updated = [...users];
      updated[idx] = next;
      await saveUsers(updated);
      setUser(publicUser(next));
    },
    [user],
  );

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut, updateProfile }),
    [user, loading, signIn, signUp, signOut, updateProfile],
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
