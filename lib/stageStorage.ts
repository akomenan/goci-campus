import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Candidature, Offre, OffreType } from '@/data/stages';

const OFFRES_KEY = 'prottector.stages.user';
const CAND_KEY = 'prottector.stages.candidatures';

export type PublishOffreInput = {
  titre: string;
  type: OffreType;
  entreprise: string;
  domaine?: string;
  lieu: string;
  quartier?: string;
  description: string;
  remuneration?: string;
  duree?: string;
  contactEmail?: string;
  contactTel?: string;
  whatsapp?: string;
  applyUrl?: string;
};

export type ApplyInput = {
  offreId: string;
  nom: string;
  prenom: string;
  email: string;
  tel?: string;
  message?: string;
};

function normalizeOffres(raw: unknown): Offre[] {
  if (!Array.isArray(raw)) return [];
  const out: Offre[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as Partial<Offre>;
    if (typeof o.id !== 'string' || !o.id) continue;
    out.push({
      id: o.id,
      titre: typeof o.titre === 'string' && o.titre ? o.titre : 'Offre',
      entreprise: typeof o.entreprise === 'string' && o.entreprise ? o.entreprise : 'Entreprise',
      type: (o.type as Offre['type']) || 'Stage',
      domaine: typeof o.domaine === 'string' && o.domaine ? o.domaine : 'Autre',
      lieu: typeof o.lieu === 'string' && o.lieu ? o.lieu : 'Abidjan',
      ville: typeof o.ville === 'string' && o.ville ? o.ville : 'Abidjan',
      quartier: typeof o.quartier === 'string' ? o.quartier : undefined,
      description: typeof o.description === 'string' ? o.description : '',
      sourceUrl: typeof o.sourceUrl === 'string' ? o.sourceUrl : '',
      sourceName: typeof o.sourceName === 'string' && o.sourceName ? o.sourceName : 'Locale',
      contactEmail: typeof o.contactEmail === 'string' ? o.contactEmail : undefined,
      contactTel: typeof o.contactTel === 'string' ? o.contactTel : undefined,
      whatsapp: typeof o.whatsapp === 'string' ? o.whatsapp : undefined,
      applyUrl: typeof o.applyUrl === 'string' ? o.applyUrl : undefined,
      emailSubject: typeof o.emailSubject === 'string' ? o.emailSubject : undefined,
      remuneration: typeof o.remuneration === 'string' ? o.remuneration : undefined,
      duree: typeof o.duree === 'string' ? o.duree : undefined,
      competences: Array.isArray(o.competences)
        ? o.competences.filter((c): c is string => typeof c === 'string')
        : undefined,
      datePublication: typeof o.datePublication === 'string' ? o.datePublication : undefined,
      dateLimite: typeof o.dateLimite === 'string' ? o.dateLimite : undefined,
      verifie: !!o.verifie,
      expiree: !!o.expiree,
      mine: true,
      accent: typeof o.accent === 'string' ? o.accent : '#0D9488',
    });
  }
  return out;
}

function normalizeCands(raw: unknown): Candidature[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (item) =>
      item && typeof item === 'object' && typeof (item as Candidature).id === 'string'
  ) as Candidature[];
}

export async function loadUserOffres(): Promise<Offre[]> {
  try {
    const raw = await AsyncStorage.getItem(OFFRES_KEY);
    if (!raw) return [];
    return normalizeOffres(JSON.parse(raw));
  } catch {
    return [];
  }
}

export async function saveUserOffres(items: Offre[]): Promise<void> {
  await AsyncStorage.setItem(OFFRES_KEY, JSON.stringify(items));
}

export async function addUserOffre(input: PublishOffreInput): Promise<Offre> {
  const existing = await loadUserOffres();
  const quartier = input.quartier?.trim() || undefined;
  const lieu = input.lieu.trim();
  const item: Offre = {
    id: `u-s-${Date.now()}`,
    titre: input.titre.trim(),
    entreprise: input.entreprise.trim(),
    type: input.type,
    domaine: input.domaine?.trim() || 'Autre',
    lieu,
    ville: 'Abidjan',
    quartier,
    description: input.description.trim(),
    sourceUrl: '',
    sourceName: 'Annonce locale PROTTECTOR',
    remuneration: input.remuneration?.trim() || undefined,
    duree: input.duree?.trim() || undefined,
    contactEmail: input.contactEmail?.trim() || undefined,
    contactTel: input.contactTel?.trim() || undefined,
    whatsapp: input.whatsapp?.trim() || input.contactTel?.trim() || undefined,
    applyUrl: input.applyUrl?.trim() || undefined,
    datePublication: new Date().toISOString().slice(0, 10),
    verifie: false,
    mine: true,
    accent: '#0D9488',
  };
  const next = [item, ...existing];
  await saveUserOffres(next);
  return item;
}

export async function mergeOffres(base: Offre[]): Promise<Offre[]> {
  const user = await loadUserOffres();
  const ids = new Set(user.map((o) => o.id));
  return [...user, ...base.filter((o) => !ids.has(o.id))];
}

export async function loadUserCandidatures(): Promise<Candidature[]> {
  try {
    const raw = await AsyncStorage.getItem(CAND_KEY);
    if (!raw) return [];
    return normalizeCands(JSON.parse(raw));
  } catch {
    return [];
  }
}

export async function saveUserCandidatures(items: Candidature[]): Promise<void> {
  await AsyncStorage.setItem(CAND_KEY, JSON.stringify(items));
}

export async function addCandidature(input: ApplyInput): Promise<Candidature> {
  const existing = await loadUserCandidatures();
  const already = existing.find((c) => c.offreId === input.offreId);
  if (already) {
    const updated: Candidature = {
      ...already,
      nom: input.nom.trim(),
      prenom: input.prenom.trim(),
      email: input.email.trim(),
      tel: input.tel?.trim(),
      message: input.message?.trim(),
      date: new Date().toISOString().slice(0, 10),
      statut: 'Envoyée',
    };
    const next = existing.map((c) => (c.id === already.id ? updated : c));
    await saveUserCandidatures(next);
    return updated;
  }
  const item: Candidature = {
    id: `uc-${Date.now()}`,
    offreId: input.offreId,
    statut: 'Envoyée',
    date: new Date().toISOString().slice(0, 10),
    nom: input.nom.trim(),
    prenom: input.prenom.trim(),
    email: input.email.trim(),
    tel: input.tel?.trim(),
    message: input.message?.trim(),
  };
  await saveUserCandidatures([item, ...existing]);
  return item;
}

export async function mergeCandidatures(base: Candidature[]): Promise<Candidature[]> {
  const user = await loadUserCandidatures();
  const ids = new Set(user.map((c) => c.id));
  const offreIds = new Set(user.map((c) => c.offreId));
  return [...user, ...base.filter((c) => !ids.has(c.id) && !offreIds.has(c.offreId))];
}
