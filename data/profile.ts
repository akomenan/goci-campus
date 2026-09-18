export type UserRole = 'schooler' | 'obso';

/** Legacy roles still present in local storage */
type LegacyRole = 'etudiant' | 'visiteur';

export type StudentProfile = {
  prenom: string;
  nom: string;
  telephone: string;
  email: string;
  /** schooler | obso — legacy etudiant/visiteur migrated via resolveRole */
  role?: UserRole | LegacyRole;
  ville?: string;
  universite?: string;
  filiere?: string;
  niveau?: string;
  photoUri?: string;
  biographie?: string;
  parcours?: string;
  ambitions?: string;
  /** Optional free label for OBSO (ex: propriétaire, recruteur) */
  obsoActivite?: string;
  /** @deprecated legacy */
  visiteurType?: string;
  anneeBac?: string;
  recherches?: string[];
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

/** @deprecated use roleBadge */
export function roleLabel(user: StudentProfile | null | undefined): string {
  return roleBadge(user);
}
