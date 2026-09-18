export type UserRole = 'schooler' | 'obso';

type LegacyRole = 'etudiant' | 'visiteur';

export type StudentProfile = {
  prenom: string;
  nom: string;
  telephone: string;
  email: string;
  role?: UserRole | LegacyRole;
  /** Public SCHOOLER handle, e.g. AmosKomenan */
  username?: string;
  ville?: string;
  universite?: string;
  filiere?: string;
  niveau?: string;
  photoUri?: string;
  biographie?: string;
  centresInteret?: string;
  obsoActivite?: string;
  visiteurType?: string;
  anneeBac?: string;
  recherches?: string[];
  parcours?: string;
  ambitions?: string;
};

export const NIVEAUX = ['Collège', 'Lycée', 'L1', 'L2', 'L3', 'M1', 'M2', 'Autre'] as const;
export type Niveau = (typeof NIVEAUX)[number];

export function resolveRole(user: { role?: string } | null | undefined): UserRole {
  const r = user?.role;
  if (r === 'obso' || r === 'visiteur') return 'obso';
  return 'schooler';
}

export function roleBadge(user: StudentProfile | null | undefined): 'SCHOOLER' | 'OBSO' {
  return resolveRole(user) === 'obso' ? 'OBSO' : 'SCHOOLER';
}

export function roleLabel(user: StudentProfile | null | undefined): string {
  return roleBadge(user);
}

function cap(word: string): string {
  const w = word.trim();
  if (!w) return '';
  return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
}

/** Jean + Kouadio → JeanKouadio ; Amos + Komenan … → AmosKomenan */
export function buildBaseUsername(prenom: string, nom: string): string {
  const first = cap((prenom || '').trim().split(/\s+/).filter(Boolean)[0] || '');
  const family = cap((nom || '').trim().split(/\s+/).filter(Boolean)[0] || '');
  const base = `${first}${family}`.replace(/[^a-zA-ZÀ-ÿ0-9]/g, '');
  return base || 'Schooler';
}

export function allocateUsername(base: string, taken: Set<string>): string {
  const key = (s: string) => s.toLowerCase();
  if (!taken.has(key(base))) return base;
  for (let i = 0; i < 40; i++) {
    const digits = String(Math.floor(1000 + Math.random() * 9000));
    const candidate = `${digits}${base}`;
    if (!taken.has(key(candidate))) return candidate;
  }
  return `${Date.now().toString().slice(-4)}${base}`;
}
