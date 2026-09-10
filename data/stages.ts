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
export const offres: Offre[] = [
  {
    id: 's-orange-money',
    titre: 'Opportunités de stage — Orange Money CI (campagne)',
    entreprise: 'Orange Money Côte d’Ivoire',
    type: 'Stage',
    domaine: 'Finance/Digital',
    lieu: 'Abidjan',
    ville: 'Abidjan',
    description:
      'Campagne publique Orange Money CI : nombreuses opportunités de stage. Envoyer CV + lettre de motivation à l’adresse de recrutement externe communiquée sur LinkedIn Orange Côte d’Ivoire.',
    sourceUrl:
      'https://fr.linkedin.com/posts/orange-c-te-d%27ivoire_rejoinslelive-orangemoneyci-empowerment-activity-7487899475051433984-q6RA',
    sourceName: 'LinkedIn — Orange Côte d’Ivoire',
    contactEmail: 'recrutementsexternes.oci@orange.com',
    emailSubject: 'Candidature stage — Orange Money CI',
    datePublication: '2026-07-28',
    competences: ['Finance', 'Digital', 'Mobile money'],
    verifie: true,
    accent: '#F97316',
  },
  {
    id: 's-fidra-pepites',
    titre: 'Stage-École BTS — Programme FIDRA Pépites',
    entreprise: 'FIDRA',
    type: 'Stage',
    domaine: 'Commerce',
    lieu: 'Abidjan — Cocody 2 Plateaux',
    ville: 'Abidjan',
    quartier: 'Cocody',
    description:
      'Programme FIDRA Pépites : coaching, accompagnement et immersion en entreprise. Profils BTS Gestion Commerciale ou Archivistique, admissibles BTS 2026. Siège Cocody 2 Plateaux, Boulevard des Martyrs. Objet mail : FPEPITES (+ profil).',
    sourceUrl: 'https://projobivoire.com/jobs/stage-ecole-bts-programme-fidra-pepites/',
    sourceName: 'ProJobIvoire',
    contactEmail: 'recrutement@fidra.ci',
    emailSubject: 'FPEPITES',
    datePublication: '2026-09-07',
    dateLimite: '2026-09-27',
    duree: 'Stage-école',
    competences: ['Gestion commerciale', 'Archivistique'],
    verifie: true,
    accent: '#7C3AED',
  },
  {
    id: 's-sgci-rh',
    titre: 'Stagiaire Développement RH (4706)',
    entreprise: 'Société Générale Côte d’Ivoire',
    type: 'Stage',
    domaine: 'RH',
    lieu: 'Abidjan — Plateau',
    ville: 'Abidjan',
    quartier: 'Plateau',
    description:
      'Stage pré-emploi DRH : recrutement, chasse de talents, fiches de poste, onboarding, organisation design et marque employeur. Bac+5 (RH, psycho/socio, école de commerce). 6 à 12 mois, 100 % présentiel.',
    sourceUrl:
      'https://yop.l-frii.com/stages/postulez-massivement-pour-un-stage-pre-emploi-chez-societe-generale',
    sourceName: 'YOP L-FRII / SGCI',
    applyUrl: 'https://bit.ly/46xrkNJ',
    datePublication: '2026-09-02',
    duree: '6 à 12 mois',
    competences: ['Recrutement', 'RH', 'LinkedIn'],
    verifie: true,
    accent: '#DC2626',
  },
  {
    id: 's-pnud-ia',
    titre: 'Stagiaire Informaticien en Intelligence Artificielle',
    entreprise: 'PNUD Côte d’Ivoire',
    type: 'Stage',
    domaine: 'Data/IA',
    lieu: 'Abidjan',
    ville: 'Abidjan',
    description:
      'Appui IA / data science au bureau PNUD CI (gouvernance démocratique & développement durable inclusif) : AILA, écosystème IA, POC, UniPod, visualisations. Master (ou dernière année / diplômé < 1 an) en IA, Data Science, Informatique, Statistique ou maths appliquées. Français requis.',
    sourceUrl:
      'https://yop.l-frii.com/recrutement-de-stagiaires-au-bureau-du-pnud-septembre-2026/',
    sourceName: 'YOP L-FRII / UNvacancies',
    applyUrl: 'https://unvacancies.org/jobs/stagiaire-informaticien-en-intelligence-artificielle-DP-36748',
    datePublication: '2026-09-07',
    dateLimite: '2026-09-14',
    duree: 'Stage PNUD',
    competences: ['Python', 'ML', 'Power BI', 'SQL'],
    verifie: true,
    accent: '#0284C7',
  },
  {
    id: 's-pnud-ddi',
    titre: 'Stagiaire Développement Durable et Inclusif',
    entreprise: 'PNUD Côte d’Ivoire',
    type: 'Stage',
    domaine: 'Développement',
    lieu: 'Abidjan',
    ville: 'Abidjan',
    description:
      'Stage équipe Développement Durable Inclusif (DDI) : plans d’investissement CDN/NDC, économie circulaire, économie bleue, éco-construction. Master environnement, développement durable, climat ou connexe. Candidature via portail carrières PNUD.',
    sourceUrl:
      'https://jobera.com/job/united-nations-development-programme-stagiaire-developpement-durable-et-inclusif-f063d53a/',
    sourceName: 'Jobera / UNDP',
    applyUrl: 'https://www.undp.org/careers',
    datePublication: '2026-09-04',
    competences: ['Climat', 'CDN', 'Économie circulaire'],
    verifie: true,
    accent: '#059669',
  },
  {
    id: 's-heetch-flotte',
    titre: 'Stagiaire Operation Agent — Gestionnaire de Flotte VTC',
    entreprise: 'Heetch',
    type: 'Stage',
    domaine: 'Ops/Logistique',
    lieu: 'Abidjan',
    ville: 'Abidjan',
    description:
      'Accompagner le développement Fleetch en Côte d’Ivoire : performance opérationnelle et financière d’un parc de véhicules loués aux chauffeurs partenaires. Profil passionné logistique / terrain / efficacité. Candidature via annonce Heetch / Jobera.',
    sourceUrl:
      'https://jobera.com/job/heetch-stagiaire-operation-agent-gestionnaire-de-flotte-vtc-h-f-8ab2acb2/',
    sourceName: 'Jobera / Heetch',
    applyUrl:
      'https://jobera.com/job/heetch-stagiaire-operation-agent-gestionnaire-de-flotte-vtc-h-f-8ab2acb2/',
    datePublication: '2026-09-02',
    competences: ['Ops', 'Flotte', 'Logistique'],
    verifie: true,
    accent: '#FF2D55',
  },
  {
    id: 's-vendo-data',
    titre: 'Stagiaire Data Analyst IA (Stage École)',
    entreprise: 'Vendoprone',
    type: 'Stage',
    domaine: 'Data/IA',
    lieu: 'Abidjan — Cocody Palmeraie',
    ville: 'Abidjan',
    quartier: 'Cocody',
    description:
      'Stage école Data Analyst IA : transformation digitale et génération de leads B2B (Fintech, Logistique, Agro). Licence 3 Informatique, Data Science, Maths appliquées, Statistiques ou IA. Postuler via l’espace carrière Vendoprone.',
    sourceUrl: 'https://carriere.vendoprone.africa/',
    sourceName: 'Vendoprone Carrières',
    applyUrl: 'https://carriere.vendoprone.africa/',
    contactTel: '+225 07 14 38 73 26',
    whatsapp: '+2250714387326',
    datePublication: '2026-08-31',
    competences: ['Data', 'IA', 'Analytics'],
    verifie: true,
    accent: '#6366F1',
  },
  {
    id: 's-vendo-graph',
    titre: 'Stagiaire Graphiste / Designer Graphique (H/F)',
    entreprise: 'Vendoprone',
    type: 'Stage',
    domaine: 'Marketing/Com',
    lieu: 'Abidjan — Cocody Palmeraie',
    ville: 'Abidjan',
    quartier: 'Cocody',
    description:
      'Stage graphisme / design pour l’équipe Vendoprone. BAC+2 ou BTS Communication Visuelle, Design Graphique, Infographie ou Beaux-Arts. Candidature via carriere.vendoprone.africa.',
    sourceUrl: 'https://carriere.vendoprone.africa/',
    sourceName: 'Vendoprone Carrières',
    applyUrl: 'https://carriere.vendoprone.africa/',
    contactTel: '+225 07 14 38 73 26',
    whatsapp: '+2250714387326',
    datePublication: '2026-08-31',
    competences: ['Design', 'Infographie', 'Canva'],
    verifie: true,
    accent: '#EC4899',
  },
  {
    id: 's-emploi-creator',
    titre: 'Stagiaire Digital Creator',
    entreprise: 'Annonceur (emploi.ci)',
    type: 'Stage',
    domaine: 'Marketing/Com',
    lieu: 'Abidjan (hybride)',
    ville: 'Abidjan',
    description:
      'Création et diffusion de contenus pour renforcer la communication digitale. Bac+1/+2, débutant / jeune diplômé com’ ou marketing digital. Postuler via emploi.ci (réf. 1986512).',
    sourceUrl:
      'https://www.emploi.ci/offre-emploi-cote-ivoire/stagiaire-digital-creator-abidjan-1986512',
    sourceName: 'emploi.ci',
    applyUrl:
      'https://www.emploi.ci/offre-emploi-cote-ivoire/stagiaire-digital-creator-abidjan-1986512',
    datePublication: '2026-08-05',
    remuneration: '< 150 000 FCFA (annoncé)',
    competences: ['Contenu digital', 'Réseaux sociaux'],
    verifie: true,
    accent: '#0EA5E9',
  },
  {
    id: 's-versus-ops',
    titre: 'Stagiaire Opérations Domestiques',
    entreprise: 'Versus Bank',
    type: 'Stage',
    domaine: 'Finance/Banque',
    lieu: 'Abidjan',
    ville: 'Abidjan',
    description:
      'Traitement des opérations bancaires (virements, chèques, moyens de paiement, compensation, back-office). Bac+2/3 Banque, Finance, Gestion ou Comptabilité ; expérience opérations / compensation obligatoire.',
    sourceUrl: 'https://yop.l-frii.com/opportunite-de-stage-a-versus-bank-01-septembre-2026/',
    sourceName: 'YOP L-FRII',
    contactEmail: 'recrutement@versusbank.com',
    emailSubject: 'Stagiaire Opérations Domestiques',
    datePublication: '2026-09-01',
    competences: ['Banque', 'Compensation', 'Back-office'],
    verifie: true,
    accent: '#1D4ED8',
  },
  {
    id: 's-fadox-it',
    titre: 'Stagiaire Assistant Projets IT & Solutions',
    entreprise: 'FADOX GROUP',
    type: 'Stage',
    domaine: 'Digital/IT',
    lieu: 'Abidjan — Cocody',
    ville: 'Abidjan',
    quartier: 'Cocody',
    description:
      'Appui au CTO : préparation, coordination et suivi de projets IT, études techniques, réponses aux appels d’offres, documents techniques et reporting. BAC+3 à BAC+5 Informatique / TI. Anglais un plus.',
    sourceUrl: 'https://ivoiremploi.com/stagiaire-assistant-projets-it-fadox/',
    sourceName: 'IvoirEmploi',
    contactEmail: 'recrutement@fadox.group',
    emailSubject: 'Candidature — Stagiaire Assistant Projets IT & Solutions',
    datePublication: '2026-08-21',
    dateLimite: '2026-08-26',
    competences: ['Gestion de projet', 'IT', 'Rédaction technique'],
    verifie: true,
    accent: '#64748B',
  },
  {
    id: 's-fact-rh',
    titre: 'Stagiaires Ressources Humaines (H/F) — 2 postes',
    entreprise: 'Fact SARL (Cabinet Fact)',
    type: 'Stage',
    domaine: 'RH',
    lieu: 'Abidjan — Abobo Samaké',
    ville: 'Abidjan',
    quartier: 'Abobo',
    description:
      'Gestion administrative du personnel, recrutement (tri CV, entretiens), audit/conseil RH, veille sociale. BAC+2/+3 RH. Résider Abobo, 2 Plateaux ou alentours. Disponibilité immédiate. Objet : candidature – STAGIAIRE RH – [votre commune].',
    sourceUrl:
      'https://projobivoire.com/jobs/stagiaires-ressources-humaines-h-f-cabinet-fact-abobo-samake/',
    sourceName: 'ProJobIvoire',
    contactEmail: 'recrutement.ivoire14@gmail.com',
    emailSubject: 'candidature – STAGIAIRE RH – Lieu d’habitation',
    datePublication: '2026-09-01',
    dateLimite: '2026-09-30',
    remuneration: '75 000 FCFA (annoncé)',
    competences: ['RH', 'Droit du travail', 'Excel'],
    verifie: true,
    accent: '#0D9488',
  },
  {
    id: 's-md-voyage',
    titre: 'Assistant Agence de Voyage (H/F) — Stage',
    entreprise: 'MD Holding International',
    type: 'Stage',
    domaine: 'Tourisme',
    lieu: 'Côte d’Ivoire',
    ville: 'Abidjan',
    description:
      'Accueil clients, dossiers et offres touristiques, procédures de réservation et billetterie. Étudiant(e) / diplômé(e) tourisme, hôtellerie, commerce ou gestion.',
    sourceUrl: 'https://projobivoire.com/jobs/assistant-agence-de-voyage-h-f-stage/',
    sourceName: 'ProJobIvoire',
    contactEmail: 'rh.mdholdingci@gmail.com',
    emailSubject: 'Candidature – Assistant Agence de Voyage',
    datePublication: '2026-09-04',
    dateLimite: '2026-09-20',
    competences: ['Tourisme', 'Accueil', 'Bureautique'],
    verifie: true,
    accent: '#EA580C',
  },
  {
    id: 's-even-tele',
    titre: 'Télévendeur / Téléconseiller (H/F)',
    entreprise: 'EVEN MEDIA INTERACTIVE',
    type: 'Job',
    domaine: 'Commerce',
    lieu: 'Abidjan — Riviera Attoban',
    ville: 'Abidjan',
    quartier: 'Riviera',
    description:
      'Société française à Abidjan depuis 7 ans. Appels entrants/sortants, formation assurée. 7 h/jour + pause rémunérée. Bonne élocution et maîtrise du français. Objet : Candidature au poste de télévendeur.',
    sourceUrl: 'https://projobivoire.com/jobs/televendeur-teleconseiller-h-f/',
    sourceName: 'ProJobIvoire',
    contactEmail: 'contact@emiciv.fr',
    emailSubject: 'Candidature au poste de télévendeur',
    datePublication: '2026-09-01',
    dateLimite: '2026-09-20',
    duree: 'Emploi / pré-emploi',
    competences: ['Télévente', 'Français', 'Relation client'],
    verifie: true,
    accent: '#D97706',
  },
  {
    id: 's-btech-com',
    titre: 'Stagiaires Commerciaux (H/F)',
    entreprise: 'B-TECH',
    type: 'Stage',
    domaine: 'Commerce',
    lieu: 'Abidjan — Angré',
    ville: 'Abidjan',
    quartier: 'Angré',
    description:
      'Prospection B2B/B2C de solutions numériques (logiciel, IA, marketing digital). Bac+2 Commerce, Gestion, Communication ou Marketing. Stage professionnel ou école ; possibilité CDI selon performances. Postuler via GoAfricaOnline.',
    sourceUrl: 'https://www.goafricaonline.com/ci/emploi/job-21387-stagiaires-commerciaux-hf',
    sourceName: 'GoAfricaOnline',
    applyUrl: 'https://www.goafricaonline.com/ci/emploi/job-21387-stagiaires-commerciaux-hf',
    datePublication: '2026-07-29',
    competences: ['Vente', 'Prospection', 'CRM'],
    verifie: true,
    accent: '#16A34A',
  },
  {
    id: 's-atalakou-com',
    titre: 'Stagiaire Chargé(e) de Communication et Marketing Digital',
    entreprise: 'Atalakou',
    type: 'Stage',
    domaine: 'Marketing/Com',
    lieu: 'Abidjan (Cocody / environs)',
    ville: 'Abidjan',
    quartier: 'Cocody',
    description:
      'Stratégie & contenus (Facebook, TikTok, LinkedIn), production vidéo, community management. Bac+2 Com’ / Marketing Digital. Canva, CapCut. Envoyer CV + exemples de contenus + lieu d’habitation.',
    sourceUrl:
      'https://emploi.educarriere.ci/offre-149760-stagiaire-chargee-de-communication-et-marketing-digital.html',
    sourceName: 'Educarriere.ci',
    contactEmail: 'contact@atalakou.site',
    emailSubject: 'Candidature Stage Communication & Marketing Digital',
    competences: ['Canva', 'CapCut', 'Community management'],
    verifie: true,
    accent: '#A855F7',
  },
  {
    id: 's-kele-cm',
    titre: 'Community Manager Stagiaire',
    entreprise: 'Kele Agency',
    type: 'Stage',
    domaine: 'Marketing/Com',
    lieu: 'Abidjan',
    ville: 'Abidjan',
    description:
      'Agence com’ Abidjan : calendrier éditorial, légendes, visuels Canva, modération, veille, reporting. Bac+2 à Bac+4 Com’ / Marketing Digital / Journalisme. Convention de stage obligatoire. Date limite 20/09/2026. Postuler via l’annonce ProJobIvoire.',
    sourceUrl: 'https://projobivoire.com/jobs/community-manager-stagiaire/',
    sourceName: 'ProJobIvoire',
    applyUrl: 'https://projobivoire.com/jobs/community-manager-stagiaire/',
    datePublication: '2026-08-13',
    dateLimite: '2026-09-20',
    competences: ['Canva', 'Instagram', 'TikTok', 'LinkedIn'],
    verifie: true,
    accent: '#DB2777',
  },
  {
    id: 's-green-fullstack',
    titre: 'Stagiaire Développeur·se Full Stack (React / Firebase / TypeScript)',
    entreprise: 'GREEN AGRO VALLEY CI',
    type: 'Stage',
    domaine: 'Digital/IT',
    lieu: 'Abidjan — Riviera Faya',
    ville: 'Abidjan',
    quartier: 'Riviera',
    description:
      'Développement web/mobile, UI responsive, intégration Firebase (auth, realtime, storage), tests et amélioration continue. Postuler via GoAfricaOnline.',
    sourceUrl:
      'https://www.goafricaonline.com/ci/emploi/job-18467-stagiaire-developpeurse-full-stack-react-firebase-typescript',
    sourceName: 'GoAfricaOnline',
    applyUrl:
      'https://www.goafricaonline.com/ci/emploi/job-18467-stagiaire-developpeurse-full-stack-react-firebase-typescript',
    datePublication: '2026-04-07',
    competences: ['React', 'Firebase', 'TypeScript'],
    verifie: true,
    accent: '#15803D',
  },
];

/** Candidatures démo vides — l’utilisateur construit la liste via Postuler. */
export const mesCandidatures: Candidature[] = [];

export function getOffreById(id: string, extra: Offre[] = []): Offre | undefined {
  return [...extra, ...offres].find((o) => o.id === id);
}

export function hasApplyPath(o: Offre): boolean {
  return !!(o.contactEmail?.trim() || o.applyUrl?.trim());
}
