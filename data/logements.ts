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
export const logements: Logement[] = [
  // --- Seeds vérifiés (contacts fournis + confirmés via index public CoinAfrique) ---
  {
    id: 'lg-ca-attoban-3308407',
    titre: 'Studio Cocody Riviera Attoban',
    prix: 90000,
    devise: 'FCFA',
    periode: 'mois',
    quartier: 'Cocody Riviera Attoban',
    ville: 'Abidjan',
    type: 'Studio',
    surface: '90 m²',
    description:
      'Grand studio à louer situé à la Riviera Attoban derrière Doraville, disponible au 1er étage avec balcon. Loyer 90 000 FCFA. Conditions : 5 mois (2-2-1). Prévoir les frais de visite.',
    equipements: ['Balcon', '1er étage', '1 salle de bain', '1 pièce'],
    contactNom: 'Jo Immobilier',
    contactTel: '+2250797452794',
    contactEmail: 'joimmobilier15@gmail.com',
    whatsapp: '+2250797452794',
    sourceUrl:
      'https://ci.coinafrique.com/annonce/appartements/location-studio-cocody-riviera-attoban-3308407',
    sourceName: 'CoinAfrique',
    note: 'Conditions 5 mois (2-2-1). Frais de visite à prévoir — vérifier sur la source.',
    disponible: true,
    verifie: true,
    accent: '#0D9488',
  },
  {
    id: 'lg-ca-angre-djorobite-3491245',
    titre: 'Studio Cocody Angré Djorobité',
    prix: 130000,
    devise: 'FCFA',
    periode: 'mois',
    quartier: 'Cocody Angré Djorobité',
    ville: 'Abidjan',
    type: 'Studio',
    surface: '—',
    description:
      'Cocody Angré Djorobité en allant sur la nouvelle voie. Global Business Immobilier Gloire de Dieu : jolis studios avec grande chambre, douche à deux entrées, cuisine, aération impeccable, non loin de la voie bitumée. Loyer 130 000 FCFA. Visite : 5 000 FCFA.',
    equipements: ['Grande chambre', 'Douche', 'Cuisine', 'Voie bitumée'],
    contactNom: 'Global Business Immobilier',
    contactTel: '+2250140312039',
    whatsapp: '+2250556691831',
    sourceUrl:
      'https://ci.coinafrique.com/annonce/appartements/location-studio-cocody-angre-djorobite-3491245',
    sourceName: 'CoinAfrique',
    note: 'Visite 5 000 FCFA — vérifier et négocier sur la source.',
    disponible: true,
    verifie: true,
    accent: '#0F766E',
  },
  {
    id: 'lg-ca-siporex-2833409',
    titre: 'Studio Yopougon Siporex',
    prix: 40000,
    devise: 'FCFA',
    periode: 'mois',
    quartier: 'Yopougon Siporex',
    ville: 'Abidjan',
    type: 'Studio',
    surface: '—',
    description:
      'Studio à louer à Yopougon Siporex, nouveau goudron, au 1er étage. Chambre, douche, WC, cuisine, placards, balcon — propre, nouvelle construction. Prix affiché sur CoinAfrique : 40 000 FCFA.',
    equipements: ['Chambre', 'Douche', 'WC', 'Cuisine', 'Placards', 'Balcon'],
    contactNom: 'Malick Toure',
    contactTel: '+2250102197362',
    contactEmail: 'malicktoure910@gmail.com',
    whatsapp: '+2250102197362',
    sourceUrl:
      'https://ci.coinafrique.com/annonce/appartements/location-studio-yopougon-siporex-2833409',
    sourceName: 'CoinAfrique',
    disponible: true,
    verifie: true,
    accent: '#14B8A6',
  },
  {
    id: 'lg-ca-ananeraie-2726629',
    titre: 'Studio Yopougon Ananeraie',
    prix: 40000,
    devise: 'FCFA',
    periode: 'mois',
    quartier: 'Yopougon Ananeraie',
    ville: 'Abidjan',
    type: 'Studio',
    surface: '20 m²',
    description:
      'Studio moderne à Yopougon Ananeraie (Sorbonne) : WC/douche, cuisine, placard, grande terrasse. Prix affiché sur CoinAfrique : 40 000 FCFA.',
    equipements: ['WC/douche', 'Cuisine', 'Placard', 'Grande terrasse'],
    contactNom: 'Kassi Roland',
    contactTel: '+2250143640204',
    contactEmail: 'kassiroland2000@gmail.com',
    whatsapp: '+2250143640204',
    sourceUrl:
      'https://ci.coinafrique.com/annonce/appartements/location-studio-yopougon-ananeraie-2726629',
    sourceName: 'CoinAfrique',
    disponible: true,
    verifie: true,
    accent: '#115E59',
  },

  // --- Listings relevés live sur CoinAfrique (contacts/prix lus sur la page) ---
  {
    id: 'lg-ca-attoban-6016521',
    titre: 'Studio Riviera Attoban (30e arr.)',
    prix: 150000,
    devise: 'FCFA',
    periode: 'mois',
    quartier: 'Cocody Riviera Attoban',
    ville: 'Abidjan',
    type: 'Studio',
    surface: '—',
    description:
      'À louer au 30e arrondissement (Attoban) en bordure de voie : studio au 1er étage, parking intérieur, jardin intérieur, balcon (pas grand), cadre sécurisé. Meublé passe. Loyer : 150 000 FCFA / mois (5 mois).',
    equipements: ['1er étage', 'Parking intérieur', 'Jardin', 'Balcon', 'Meublé passe'],
    contactNom: 'Accueil Rabbi Immobille',
    contactTel: '+2250748866138',
    contactEmail: 'jacques.lemissionnaire01@gmail.com',
    whatsapp: '+2250748866138',
    sourceUrl:
      'https://ci.coinafrique.com/annonce/appartements/location-studio-a-la-riviera-attoban-6016521',
    sourceName: 'CoinAfrique',
    note: 'Conditions 5 mois — vérifier sur la source.',
    disponible: true,
    verifie: true,
    accent: '#0D9488',
  },
  {
    id: 'lg-ca-palmeraie-6035533',
    titre: 'Studio Riviera Palmeraie Saint Viateur',
    prix: 85000,
    devise: 'FCFA',
    periode: 'mois',
    quartier: 'Cocody Riviera Palmeraie',
    ville: 'Abidjan',
    type: 'Studio',
    surface: '100 m²',
    description:
      'Très grand studio à Cocody Riviera Palmeraie Saint Viateur, constructions neuves derrière la cité SIPIM 4, rez-de-chaussée. Visite 5 000 F. Loyer indiqué : 85 000 × 5 (autre option 100 000 × 5 sur l’annonce).',
    equipements: ['Rez-de-chaussée', 'Nouvelle construction', '1 salle de bain'],
    contactNom: 'Sery Daï Immobilier',
    contactTel: '+2250574781520',
    whatsapp: '+2250574781520',
    sourceUrl:
      'https://ci.coinafrique.com/annonce/appartements/location-studio-a-cocody-riviera-palmeraie-saint-viateur-nouvelle-constructions-derriere-la-cite-sipim4-aurez-de-chaussee-visite-5000f-loyer-1-85-mille-x5-loyer-2-6035533',
    sourceName: 'CoinAfrique',
    note: 'Visite 5 000 F. Options de loyer sur l’annonce source.',
    disponible: true,
    verifie: true,
    accent: '#0F766E',
  },
  {
    id: 'lg-ca-nouveau-chu-5986544',
    titre: 'Studio Nouveau CHU Gestoci Y4',
    prix: 125000,
    devise: 'FCFA',
    periode: 'mois',
    quartier: 'Cocody Angré Nouveau CHU',
    ville: 'Abidjan',
    type: 'Studio',
    surface: '—',
    description:
      'Location Nouveau CHU Gestoci Y4 : grand studio américain — 1 grande chambre, 1 cuisine, 1 salle d’eau, accès bitumé, rez-de-chaussée. Uniquement habitation. Attestation de travail, bulletin de salaire, RIB demandés. Loyer : 125 000 FCFA. Réf. Imob Habib 8e.',
    equipements: ['Studio américain', 'Cuisine', 'Salle d’eau', 'Rez-de-chaussée', 'Accès bitumé'],
    contactNom: 'Imob Habib',
    contactTel: '+2250748715023',
    whatsapp: '+2250748715023',
    sourceUrl: 'https://ci.coinafrique.com/annonce/appartements/location-studio-nouveau-chu-5986544',
    sourceName: 'CoinAfrique',
    note: 'Justificatifs demandés (attestation travail, bulletin, RIB) — voir source.',
    disponible: true,
    verifie: true,
    accent: '#14B8A6',
  },
  {
    id: 'lg-ca-angre-chu-5699445',
    titre: 'Chambres Angré CHU Djorobité 1',
    prix: 50000,
    devise: 'FCFA',
    periode: 'mois',
    quartier: 'Cocody Angré CHU Djorobité',
    ville: 'Abidjan',
    type: 'Chambre',
    surface: '—',
    description:
      'Angré CHU – Djorobité, en face de la cité Harmonie : chambres allouées avec commodités, logement sécurisé, 50 000 FCFA / mois. Cadre calme et accessible, proche du CHU. Idéal budget étudiant / revenus modestes. Offre limitée.',
    equipements: ['Commodités', 'Sécurisé', 'Proche CHU'],
    contactNom: 'Yass Immobilier',
    contactTel: '+2250505428362',
    contactEmail: 'yassmarineymms@gmail.com',
    whatsapp: '+2250505428362',
    sourceUrl:
      'https://ci.coinafrique.com/annonce/chambres/location-chambres-angre-chu-djorobite-1-5699445',
    sourceName: 'CoinAfrique',
    disponible: true,
    verifie: true,
    accent: '#115E59',
  },
  {
    id: 'lg-ca-palmeraie-centre-5838011',
    titre: 'Chambre Cocody Riviera Palmeraie centre',
    prix: 70000,
    devise: 'FCFA',
    periode: 'mois',
    quartier: 'Cocody Riviera Palmeraie',
    ville: 'Abidjan',
    type: 'Chambre',
    surface: '—',
    description:
      'À louer chambre Cocody Riviera Palmeraie centre. Loyer : 70 000 FCFA. Conditions : 5 mois au total (annonce Mr Mia).',
    equipements: ['Chambre'],
    contactNom: 'Mr Mia',
    contactTel: '+2250777391078',
    contactEmail: 'romeomia1979@gmail.com',
    whatsapp: '+2250777391078',
    sourceUrl:
      'https://ci.coinafrique.com/annonce/chambres/a-louer-chambre-cocody-riviera-palmeraie-centre-5838011',
    sourceName: 'CoinAfrique',
    note: '5 mois en tout — vérifier sur la source.',
    disponible: true,
    verifie: true,
    accent: '#2DD4BF',
  },
  {
    id: 'lg-ca-angre-5431658',
    titre: 'Studio Cocody Angré (9e tranche / Attoban)',
    prix: 100000,
    devise: 'FCFA',
    periode: 'mois',
    quartier: 'Cocody Angré',
    ville: 'Abidjan',
    type: 'Studio',
    surface: '—',
    description:
      'Nouveau studio 100 000 FCFA, du rez-de-chaussée au 2e étage, entre la 9e tranche et Attoban, non loin de l’école Fred Épopée. Loyer 100 000 × 5 mois. Visite possible, frais de visite 5 000 F.',
    equipements: ['Rez-de-chaussée à 2e', 'Nouveau'],
    contactNom: 'Annonceur CoinAfrique',
    contactTel: '+2250171859315',
    whatsapp: '+2250171859315',
    sourceUrl: 'https://ci.coinafrique.com/annonce/chambres/location-studio-a-cocody-angre-5431658',
    sourceName: 'CoinAfrique',
    note: 'Visite 5 000 F · caution 5 mois — vérifier sur la source.',
    disponible: true,
    verifie: true,
    accent: '#0D9488',
  },
  {
    id: 'lg-ca-angre-9e-5543065',
    titre: 'Studio Angré 9e tranche (Star 14)',
    prix: 150000,
    devise: 'FCFA',
    periode: 'mois',
    quartier: 'Cocody Angré 9e tranche',
    ville: 'Abidjan',
    type: 'Studio',
    surface: '30 m²',
    description:
      'Studio à Angré 9e tranche, non loin de la cité Star 14. Accès facile, voie bitumée, sécurité / caméras, balcon d’aération. 4e étage. Loyer : 150 000 FCFA. Conditions : 5 mois.',
    equipements: ['Balcon', 'Sécurité', 'Caméras', 'Accès bitumé', '4e étage'],
    contactNom: 'Kouame Samuel',
    contactTel: '+2250757793702',
    whatsapp: '+2250757793702',
    sourceUrl:
      'https://ci.coinafrique.com/annonce/chambres/location-chambre-1-piece-cocody-angre-9-eme-tranche-5543065',
    sourceName: 'CoinAfrique',
    note: 'Conditions 5 mois — vérifier sur la source. Autre n° visible sur la page : +2250141286800.',
    disponible: true,
    verifie: true,
    accent: '#0F766E',
  },
  {
    id: 'lg-ca-djorogobite-5160897',
    titre: 'Studio américain Angré Djorogobité 1',
    prix: 150000,
    devise: 'FCFA',
    periode: 'mois',
    quartier: 'Cocody Angré Djorogobité',
    ville: 'Abidjan',
    type: 'Studio',
    surface: '—',
    description:
      'Grand studio américain à Angré Djorogobité 1, 3e étage, grand balcon, accès facile en bordure. Bureau ou habitation, meublé passe. 150 000 FCFA. Conditions 5 mois. Visite possible.',
    equipements: ['Studio américain', '3e étage', 'Grand balcon', 'Meublé passe'],
    contactNom: 'Annonceur CoinAfrique',
    contactTel: '+2250141516753',
    contactEmail: 'dahoulidi@gmail.com',
    whatsapp: '+2250141516753',
    sourceUrl:
      'https://ci.coinafrique.com/annonce/chambres/location-studio-a-angre-djorogobite-1-5160897',
    sourceName: 'CoinAfrique',
    note: 'Conditions 5 mois — vérifier sur la source.',
    disponible: true,
    verifie: true,
    accent: '#14B8A6',
  },
  {
    id: 'lg-ca-angre-star4-5968317',
    titre: 'Studio Angré Cité Star 4 (rénovation)',
    prix: 40000,
    devise: 'FCFA',
    periode: 'mois',
    quartier: 'Cocody Angré',
    ville: 'Abidjan',
    type: 'Studio',
    surface: '—',
    description:
      'Studio en rénovation à louer à Angré dans la cité Star 4. Prix affiché : 40 000 FCFA. Contacter l’annonceur pour l’état des travaux et la disponibilité.',
    equipements: ['En rénovation'],
    contactNom: 'Annonceur CoinAfrique',
    contactTel: '+2250748466502',
    contactEmail: 'yabrefadil@gmail.com',
    whatsapp: '+2250748466502',
    sourceUrl: 'https://ci.coinafrique.com/annonce/chambres/location-chambres-angre-5968317',
    sourceName: 'CoinAfrique',
    note: 'Bien en rénovation — vérifier l’état sur place via la source.',
    disponible: true,
    verifie: true,
    accent: '#115E59',
  },
  {
    id: 'lg-ca-marcory-5218187',
    titre: 'Studio meublé Marcory Zone 4',
    prix: 50000,
    devise: 'FCFA',
    periode: 'mois',
    quartier: 'Marcory Zone 4',
    ville: 'Abidjan',
    type: 'Studio',
    surface: '—',
    description:
      'Studio meublé à Marcory Zone 4 : vigiles jour/nuit, climatiseurs, internet fibre 50 Mb/s, Canal+, smart TV, cuisine équipée, chauffe-eau, en bordure de voie. Prix affiché sur CoinAfrique : 50 000 FCFA — confirmer période (mois/nuit) sur la source.',
    equipements: ['Meublé', 'Climatisation', 'Fibre', 'Cuisine équipée', 'Chauffe-eau', 'Vigiles'],
    contactNom: 'Rayonne Kelly Immobilier',
    contactTel: '+2250501161919',
    contactEmail: 'fl.structures@gmail.com',
    whatsapp: '+2250501161919',
    sourceUrl: 'https://ci.coinafrique.com/annonce/chambres/location-chambre-marcory-5218187',
    sourceName: 'CoinAfrique',
    note: 'Confirmer si le tarif est mensuel ou journalier sur l’annonce source.',
    disponible: true,
    verifie: true,
    accent: '#2DD4BF',
  },
  {
    id: 'lg-ca-koumassi-6042402',
    titre: 'Studio Koumassi Remblais',
    prix: 130000,
    devise: 'FCFA',
    periode: 'mois',
    quartier: 'Koumassi Remblais',
    ville: 'Abidjan',
    type: 'Studio',
    surface: '—',
    description:
      'Studio à Koumassi Remblais, immeuble Loboue, non loin du carrefour Canal après l’école La Rochelle, 1er étage. Composition : 1 chambre, 1 salle d’eau, 1 cuisine, 1 balcon. Loyer : 130 000 FCFA / mois.',
    equipements: ['1 chambre', 'Salle d’eau', 'Cuisine', 'Balcon', '1er étage'],
    contactNom: 'Annonceur CoinAfrique',
    contactTel: '+2250779595312',
    whatsapp: '+2250779595312',
    sourceUrl:
      'https://ci.coinafrique.com/annonce/chambres/location-studio-a-koumassi-remblais-6042402',
    sourceName: 'CoinAfrique',
    disponible: true,
    verifie: true,
    accent: '#0D9488',
  },
  {
    id: 'lg-ca-2plateaux-5308551',
    titre: 'Studio américain 2 Plateaux Vallon',
    prix: 200000,
    devise: 'FCFA',
    periode: 'mois',
    quartier: '2 Plateaux Vallon',
    ville: 'Abidjan',
    type: 'Studio',
    surface: '—',
    description:
      'Grand studio américain aux 2 Plateaux Vallon, dans une cité derrière la pharmacie Saint-Cécile. 2 douches/WC, split déjà installé, chauffe-eau, beaux carrelages. Loyer affiché : 200 000 FCFA.',
    equipements: ['Studio américain', '2 salles d’eau', 'Split', 'Chauffe-eau'],
    contactNom: 'Annonceur CoinAfrique',
    contactTel: '+2250545576781',
    whatsapp: '+2250545576781',
    sourceUrl: 'https://ci.coinafrique.com/annonce/chambres/location-chambre-2-plateaux-5308551',
    sourceName: 'CoinAfrique',
    disponible: true,
    verifie: true,
    accent: '#0F766E',
  },
  {
    id: 'lg-ca-yopougon-5764644',
    titre: 'Chambre-salon Yopougon Sorbonne Ananeraie',
    prix: 20000,
    devise: 'FCFA',
    periode: 'à confirmer',
    quartier: 'Yopougon Ananeraie',
    ville: 'Abidjan',
    type: 'Appartement',
    surface: '—',
    description:
      'Chambre-salon nouvelle construction à Yopougon Sorbonne Ananeraie, bordure de route, 3e étage, grande terrasse, cuisine équipée, chambre climatisée, fibre, TV connectée, Canal+. Deux WC, gazinière, frigo. NB : possible de laisser au prix d’un studio. Prix affiché : 20 000 FCFA — confirmer la période sur la source.',
    equipements: ['Climatisation', 'Fibre', 'Cuisine équipée', 'Terrasse', 'Frigo'],
    contactNom: 'Mt Services Résidences Meublées',
    contactTel: '+2250142063098',
    contactEmail: 'mtservicemanagement@gmail.com',
    whatsapp: '+2250142063098',
    sourceUrl: 'https://ci.coinafrique.com/annonce/chambres/location-chambre-yopougon-5764644',
    sourceName: 'CoinAfrique',
    note: 'Prix 20 000 CFA affiché — confirmer mois vs nuitée sur la source. Attention frais de visite.',
    disponible: true,
    verifie: true,
    accent: '#14B8A6',
  },

  // --- Entrée catalogue (pas un bailleur) ---
  {
    id: 'lg-ca-catalogue-chambres',
    titre: 'Parcourir les chambres / studios à Abidjan',
    prix: null,
    devise: 'FCFA',
    periode: '—',
    quartier: 'Abidjan',
    ville: 'Abidjan',
    type: 'Catalogue',
    surface: '—',
    description:
      'Catalogue CoinAfrique des chambres et studios à louer à Abidjan (Cocody, Yopougon, Angré, Marcory, etc.). Ouvrez la source pour filtrer et contacter les annonceurs. Les numéros ci-dessous sont l’aide / équipe commerciale CoinAfrique — PAS des bailleurs.',
    equipements: ['Catalogue public'],
    contactNom: 'Aide CoinAfrique',
    contactTel: '+2250585000024',
    contactEmail: 'commercial@coinafrique.com',
    whatsapp: '+2250594872441',
    sourceUrl: 'https://ci.coinafrique.com/ville/abidjan/chambres',
    sourceName: 'CoinAfrique',
    note:
      'Aide plateforme : +225 05 85 00 00 24 · +225 05 94 87 24 41 · +225 05 04 30 33 11. Ce ne sont pas des contacts de propriétaires.',
    disponible: true,
    verifie: true,
    accent: '#5EEAD4',
  },
];

export function getLogementById(id: string, extra: Logement[] = []): Logement | undefined {
  return [...extra, ...logements].find((l) => l.id === id);
}
