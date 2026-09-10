import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Logement, LogementType } from '@/data/logements';

const KEY = 'prottector.logements.user';

export type PublishInput = {
  titre: string;
  type: LogementType;
  prix: number;
  quartier: string;
  description: string;
  contactNom: string;
  contactTel: string;
  equipements?: string[];
};

function normalize(raw: unknown): Logement[] {
  if (!Array.isArray(raw)) return [];
  const out: Logement[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const l = item as Partial<Logement>;
    if (typeof l.id !== 'string' || !l.id) continue;
    const prix =
      typeof l.prix === 'number' && Number.isFinite(l.prix) ? l.prix : null;
    out.push({
      id: l.id,
      titre: typeof l.titre === 'string' && l.titre ? l.titre : 'Annonce',
      prix,
      devise: typeof l.devise === 'string' ? l.devise : 'FCFA',
      periode: typeof l.periode === 'string' ? l.periode : 'mois',
      quartier: typeof l.quartier === 'string' && l.quartier ? l.quartier : 'Abidjan',
      ville: typeof l.ville === 'string' && l.ville ? l.ville : 'Abidjan',
      type: (l.type as Logement['type']) || 'Chambre',
      surface: typeof l.surface === 'string' ? l.surface : '—',
      description: typeof l.description === 'string' ? l.description : '',
      equipements: Array.isArray(l.equipements)
        ? l.equipements.filter((e): e is string => typeof e === 'string')
        : ['À préciser'],
      contactNom: typeof l.contactNom === 'string' && l.contactNom ? l.contactNom : 'Annonceur',
      contactTel: typeof l.contactTel === 'string' ? l.contactTel : undefined,
      contactEmail: typeof l.contactEmail === 'string' ? l.contactEmail : undefined,
      whatsapp: typeof l.whatsapp === 'string' ? l.whatsapp : undefined,
      sourceUrl: typeof l.sourceUrl === 'string' ? l.sourceUrl : undefined,
      sourceName: typeof l.sourceName === 'string' ? l.sourceName : undefined,
      note: typeof l.note === 'string' ? l.note : undefined,
      disponible: l.disponible !== false,
      verifie: !!l.verifie,
      mine: true,
      accent: typeof l.accent === 'string' ? l.accent : '#0D9488',
    });
  }
  return out;
}

export async function loadUserLogements(): Promise<Logement[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    return normalize(JSON.parse(raw));
  } catch {
    return [];
  }
}

export async function saveUserLogements(items: Logement[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

export async function addUserLogement(input: PublishInput): Promise<Logement> {
  const existing = await loadUserLogements();
  const item: Logement = {
    id: `u-${Date.now()}`,
    titre: input.titre.trim(),
    prix: input.prix,
    devise: 'FCFA',
    periode: 'mois',
    quartier: input.quartier.trim(),
    ville: 'Abidjan',
    type: input.type,
    surface: '—',
    description: input.description.trim(),
    equipements: input.equipements?.length ? input.equipements : ['À préciser'],
    contactNom: input.contactNom.trim() || 'Annonceur',
    contactTel: input.contactTel.trim(),
    whatsapp: input.contactTel.trim(),
    sourceName: 'PROTTECTOR (local)',
    disponible: true,
    verifie: false,
    mine: true,
    accent: '#0D9488',
  };
  const next = [item, ...existing];
  await saveUserLogements(next);
  return item;
}

export async function mergeLogements(base: Logement[]): Promise<Logement[]> {
  const user = await loadUserLogements();
  const ids = new Set(user.map((l) => l.id));
  return [...user, ...base.filter((l) => !ids.has(l.id))];
}
