export type LogementType = 'Chambre' | 'Studio' | 'Colocation' | 'Appartement' | 'Catalogue';

export type Logement = {
  id: string;
  titre: string;
  /** null = prix non affiché sur la source → « Voir prix sur source » */
  prix: number | null;
  devise: string;
  periode: string;
  quartier: string;
  ville: string;
  type: LogementType;
  surface: string;
  description: string;
  equipements: string[];
  contactNom: string;
  contactTel?: string;
  contactEmail?: string;
  whatsapp?: string;
  sourceUrl?: string;
  sourceName?: string;
  /** Note candidature / conditions (visite, caution…) telle que sur la source */
  note?: string;
  disponible: boolean;
  verifie: boolean;
  mine?: boolean;
  accent: string;
};

export const LOGEMENT_TYPES: LogementType[] = [
  'Chambre',
  'Studio',
  'Colocation',
  'Appartement',
];

export const QUARTIER_FILTERS = [
  'Tous',
  'Yopougon',
  'Cocody',
  'Angré',
  'Riviera',
  'Plateau',
  'Abobo',
  'Marcory',
  'Koumassi',
  '2 Plateaux',
  'Bingerville',
  'Treichville',
] as const;

export type QuartierFilter = (typeof QUARTIER_FILTERS)[number];

export type BudgetFilter = 'Tous' | '≤40k' | '40–70k' | '70–120k' | '>120k' | 'Sans prix';

export const BUDGET_FILTERS: BudgetFilter[] = [
  'Tous',
  '≤40k',
  '40–70k',
  '70–120k',
  '>120k',
  'Sans prix',
];

export function matchesBudgetFilter(filter: BudgetFilter, prix: number | null): boolean {
  if (filter === 'Tous') return true;
  if (filter === 'Sans prix') return prix == null;
  if (prix == null) return false;
  if (filter === '≤40k') return prix <= 40000;
  if (filter === '40–70k') return prix > 40000 && prix <= 70000;
  if (filter === '70–120k') return prix > 70000 && prix <= 120000;
  return prix > 120000;
}

export function matchesQuartierFilter(filter: QuartierFilter, quartier: string): boolean {
  if (filter === 'Tous') return true;
  const q = quartier.toLowerCase();
  const f = filter.toLowerCase();
  if (f === '2 plateaux') {
    return q.includes('plateaux') || q.includes('2 plateaux') || q.includes('deux plateaux');
  }
  return q.includes(f) || f.includes(q.split(/[\s/,-]/)[0]?.toLowerCase() ?? '');
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

export function formatPrix(prix: number | null | undefined, devise = 'FCFA'): string {
  if (prix == null || !Number.isFinite(prix)) return 'Voir prix sur source';
  return `${prix.toLocaleString('fr-FR')} ${devise}`;
}

const TYPE_ICONS: Record<LogementType, string> = {
  Chambre: 'bed-outline',
  Studio: 'home-outline',
  Colocation: 'people-outline',
  Appartement: 'business-outline',
  Catalogue: 'grid-outline',
};

export function iconForType(type: LogementType): string {
  return TYPE_ICONS[type] ?? 'home-outline';
}

/**
 * Annonces agrégées depuis sources publiques CoinAfrique (sept. 2026).
 * verifie=true si sourceUrl + contact (tél/email/whatsapp) issus de la page ou du seed vérifié.
 * Aucun téléphone / e-mail / prix inventé.
 */
export const logements: Logement[] = [];

export function getLogementById(id: string, extra: Logement[] = []): Logement | undefined {
  return [...extra, ...logements].find((l) => l.id === id);
}
