import { Redirect, useLocalSearchParams } from 'expo-router';

/** Ancien formulaire visiteur — redirigé vers register unifié. */
export default function RegisterVisiteurRedirect() {
  const params = useLocalSearchParams<{ type?: string }>();
  const type = Array.isArray(params.type) ? params.type[0] : params.type;
  const mode = type === 'particulier' ? 'particulier' : 'bachelier';
  return <Redirect href={{ pathname: '/(auth)/register', params: { mode } }} />;
}
