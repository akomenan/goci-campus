import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StudentProfile, UserRole } from '@/data/profile';
import {
  allocateUsername,
  buildBaseUsername,
  resolveRole,
} from '@/data/profile';

const USERS_KEY = 'estudy.users';
const SESSION_KEY = 'estudy.sessionUserId';

export type AuthUser = StudentProfile & {
  id: string;
  password: string;
};

export function normalizeUser(user: AuthUser): AuthUser {
  const role: UserRole = resolveRole(user);
  return { ...user, role, email: user.email || '' };
}

export async function loadUsers(): Promise<AuthUser[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as AuthUser[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeUser);
  } catch {
    return [];
  }
}

/** Ensure every SCHOOLER has a public username (e.g. AmosKomenan). */
export async function ensureSchoolerUsernames(users: AuthUser[]): Promise<AuthUser[]> {
  const taken = new Set(
    users.map((u) => (u.username || '').toLowerCase()).filter(Boolean),
  );
  let changed = false;
  const next = users.map((u) => {
    if (resolveRole(u) !== 'schooler') return u;
    if (u.username && u.username.trim()) return u;
    const base = buildBaseUsername(u.prenom, u.nom);
    const username = allocateUsername(base, taken);
    taken.add(username.toLowerCase());
    changed = true;
    return { ...u, username };
  });
  if (changed) await saveUsers(next);
  return next;
}

export async function saveUsers(users: AuthUser[]): Promise<void> {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users.map(normalizeUser)));
}

export async function loadSessionUserId(): Promise<string | null> {
  return AsyncStorage.getItem(SESSION_KEY);
}

export async function saveSessionUserId(userId: string | null): Promise<void> {
  if (userId == null) {
    await AsyncStorage.removeItem(SESSION_KEY);
  } else {
    await AsyncStorage.setItem(SESSION_KEY, userId);
  }
}

export function normalizeLogin(value: string): string {
  return value.trim().toLowerCase();
}

export function matchesLogin(user: AuthUser, login: string): boolean {
  const key = normalizeLogin(login);
  const phone = normalizeLogin(user.telephone);
  const email = normalizeLogin(user.email || '');
  const username = normalizeLogin(user.username || '');
  return (
    phone === key ||
    (email.length > 0 && email === key) ||
    (username.length > 0 && username === key)
  );
}

export function publicUser(user: AuthUser): StudentProfile & { id: string } {
  const { password: _password, ...rest } = normalizeUser(user);
  return rest;
}
