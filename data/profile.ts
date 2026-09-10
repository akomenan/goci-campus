export type UserRole = 'etudiant' | 'visiteur';
export type VisiteurType = 'bachelier' | 'particulier';
export type RechercheBesoin = 'ecole' | 'logement' | 'stage' | 'autre';

export type StudentProfile = {
  prenom: string;
  nom: string;
  telephone: string;
  email: string;
  /** Existing accounts without role are treated as etudiant */
  role?: UserRole;
  visiteurType?: VisiteurType;
  /** Student academic fields — required for etudiant */
  ville?: string;
  universite?: string;
  filiere?: string;
  niveau?: string;
  /** Bachelier optionals */
  anneeBac?: string;
  /** Particulier optionals */
  recherches?: RechercheBesoin[];
  /** Student enrichment (profil) */
  photoUri?: string;
  biographie?: string;
  parcours?: string;
  ambitions?: string;
};

/** @deprecated Prefer session user from AuthContext — kept as fallback labels */
export const profile: StudentProfile = {
  prenom: 'Amos',
  nom: 'Kouassi',
  ville: 'Abidjan',
  universite: 'Université Félix Houphouët-Boigny (UFHB)',
  filiere: 'Informatique',
  niveau: 'L3',
  email: 'amos.kouassi@etudiant.ufhb.edu.ci',
  telephone: '+225 07 00 00 00 00',
  role: 'etudiant',
};

export const NIVEAUX = ['L1', 'L2', 'L3', 'M1', 'M2', 'Autre'] as const;
export type Niveau = (typeof NIVEAUX)[number];

export const RECHERCHE_OPTIONS: { id: RechercheBesoin; label: string }[] = [
  { id: 'ecole', label: 'École' },
  { id: 'logement', label: 'Logement' },
  { id: 'stage', label: 'Stage' },
  { id: 'autre', label: 'Autre' },
];

export function resolveRole(user: { role?: UserRole } | null | undefined): UserRole {
  return user?.role === 'visiteur' ? 'visiteur' : 'etudiant';
}

export function roleLabel(user: StudentProfile | null | undefined): string {
  const role = resolveRole(user);
  if (role === 'visiteur') {
    if (user?.visiteurType === 'bachelier') return 'Visiteur · Bachelier';
    if (user?.visiteurType === 'particulier') return 'Visiteur · Particulier';
    return 'Visiteur';
  }
  return user?.niveau ? `Étudiant · ${user.niveau}` : 'Étudiant';
}
