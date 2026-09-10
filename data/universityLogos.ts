import type { ImageSourcePropType } from 'react-native';

/** Local logos downloaded for reliability in Expo Go */
const LOCAL: Record<string, ImageSourcePropType> = {
  ufhb: require('../assets/logos/ufhb.png'),
  inphb: require('../assets/logos/inphb.png'),
  esatic: require('../assets/logos/esatic.png'),
  pigier: require('../assets/logos/pigier.png'),
  uvci: require('../assets/logos/uvci.png'),
  esgis: require('../assets/logos/esgis.png'),
  'est-loko': require('../assets/logos/loko.png'),
  ensit: require('../assets/logos/ensit.png'),
  'digital-college': require('../assets/logos/digitalcollege.png'),
  iipea: require('../assets/logos/iipea.png'),
  ifsm: require('../assets/logos/ifsm.png'),
};

export function getLocalLogo(id: string): ImageSourcePropType | undefined {
  return LOCAL[id];
}

export function getUniversityLogoSource(
  id: string,
  logoUrl?: string,
): ImageSourcePropType | undefined {
  const local = getLocalLogo(id);
  if (local) return local;
  if (logoUrl) return { uri: logoUrl };
  return undefined;
}
