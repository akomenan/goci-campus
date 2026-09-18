export type OffreType = 'Stage' | 'Job' | 'Alternance';

export type Offre = {
  id: string;
  titre: string;
  entreprise: string;
  type: OffreType;
  domaine: string;
  lieu: string;
  ville: string;
  quartier?: string;
  description: string;
  sourceUrl: string;
  sourceName: string;
  contactEmail?: string;
  contactTel?: string;
  whatsapp?: string;
  applyUrl?: string;
  emailSubject?: string;
  remuneration?: string;
  duree?: string;
  competences?: string[];
  datePublication?: string;
  dateLimite?: string;
  verifie: boolean;
  expiree?: boolean;
  mine?: boolean;
  accent: string;
};

export type CandidatureStatut = 'Envoyée' | 'En cours' | 'Entretien' | 'Refusée' | 'Acceptée';

export type Candidature = {
  id: string;
  offreId: string;
  statut: CandidatureStatut;
  date: string;
  nom?: string;
  prenom?: string;
  email?: string;
  tel?: string;
  message?: string;
};

export const OFFRE_TYPES: OffreType[] = ['Stage', 'Job', 'Alternance'];

export const DOMAINE_FILTERS = [
  'Tous',
  'Marketing/Com',
  'Finance/Banque',
  'Digital/IT',
  'RH',
  'Commerce',
  'Développement',
  'Data/IA',
  'Tourisme',
  'Ops/Logistique',
] as const;

export type DomaineFilter = (typeof DOMAINE_FILTERS)[number];

export const QUARTIER_FILTERS = [
  'Tous',
  'Yopougon',
  'Cocody',
  'Plateau',
  'Abobo',
  'Marcory',
  'Koumassi',
  'Riviera',
  'Bingerville',
  'Treichville',
  'Angré',
] as const;

export type QuartierFilter = (typeof QUARTIER_FILTERS)[number];

export function matchesQuartierFilter(
  filter: QuartierFilter,
  quartier?: string,
  lieu?: string
): boolean {
  if (filter === 'Tous') return true;
  const hay = `${quartier ?? ''} ${lieu ?? ''}`.toLowerCase();
  return hay.includes(filter.toLowerCase());
}

export function matchesDomaineFilter(filter: DomaineFilter, domaine: string): boolean {
  if (filter === 'Tous') return true;
  return domaine.toLowerCase().includes(filter.toLowerCase().split('/')[0]!);
}

const TYPE_ICONS: Record<OffreType, string> = {
  Stage: 'school-outline',
  Job: 'briefcase-outline',
  Alternance: 'git-branch-outline',
};

const TYPE_COLORS: Record<OffreType, string> = {
  Stage: '#0D9488',
  Job: '#D97706',
  Alternance: '#7C3AED',
};

export function iconForOffreType(type: OffreType): string {
  return TYPE_ICONS[type] ?? 'briefcase-outline';
}

export function colorForOffreType(type: OffreType): string {
  return TYPE_COLORS[type] ?? '#0D9488';
}

export function phoneDigits(tel: string): string {
  return tel.replace(/\D/g, '');
}

export function whatsappUrl(tel: string, text?: string): string {
  const base = `https://wa.me/${phoneDigits(tel)}`;
  if (!text?.trim()) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function telUrl(tel: string): string {
  return `tel:${tel.replace(/\s/g, '')}`;
}

export function mailUrl(email: string, subject?: string, body?: string): string {
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${email}${params.length ? `?${params.join('&')}` : ''}`;
}

/**
 * Offres agrégées depuis sources publiques (sept. 2026).
 * verifie=true uniquement si sourceUrl + chemin de candidature (email ou applyUrl).
 * Aucun e-mail / téléphone inventé.
 */
export const offres: Offre[] = [];

/** Candidatures démo vides — l’utilisateur construit la liste via Postuler. */
export const mesCandidatures: Candidature[] = [];

export function getOffreById(id: string, extra: Offre[] = []): Offre | undefined {
  return [...extra, ...offres].find((o) => o.id === id);
}

export function hasApplyPath(o: Offre): boolean {
  return !!(o.contactEmail?.trim() || o.applyUrl?.trim());
}
