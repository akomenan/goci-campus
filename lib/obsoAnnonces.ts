import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'goci.obso.annonces';

export type AnnonceKind = 'logement' | 'stage' | 'ecole';

export type ObsoAnnonce = {
  id: string;
  ownerId: string;
  kind: AnnonceKind;
  createdAt: string;
  published: boolean;
  unpublishReason?: string;
  // logement
  ville?: string;
  typeLogement?: string;
  description?: string;
  quartier?: string;
  prix?: string;
  telephone?: string;
  // stage
  titre?: string;
  entreprise?: string;
  typeOffre?: string;
  domaine?: string;
  lieu?: string;
  contact?: string;
  // ecole
  nomEcole?: string;
  typeEcole?: string;
  filieres?: string;
  siteWeb?: string;
};

export async function loadAnnonces(): Promise<ObsoAnnonce[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ObsoAnnonce[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function saveAll(items: ObsoAnnonce[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

export async function loadAnnoncesForOwner(ownerId: string): Promise<ObsoAnnonce[]> {
  const all = await loadAnnonces();
  return all.filter((a) => a.ownerId === ownerId && a.published);
}

export async function addAnnonce(
  input: Omit<ObsoAnnonce, 'id' | 'createdAt' | 'published'>,
): Promise<ObsoAnnonce> {
  const all = await loadAnnonces();
  const item: ObsoAnnonce = {
    ...input,
    id: `a_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    published: true,
  };
  await saveAll([item, ...all]);
  return item;
}

export async function unpublishAnnonce(
  id: string,
  ownerId: string,
  reason: string,
): Promise<void> {
  const all = await loadAnnonces();
  const next = all.map((a) =>
    a.id === id && a.ownerId === ownerId
      ? { ...a, published: false, unpublishReason: reason }
      : a,
  );
  await saveAll(next);
}

export const LOGEMENT_TYPES = ['Chambre', 'Studio', 'Colocation', 'Appartement', 'Autre'] as const;
export const STAGE_TYPES = ['Stage', 'Job', 'Alternance'] as const;
