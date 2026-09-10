import { Redirect } from 'expo-router';

/** Ancien choix de type — redirigé vers l’inscription unifiée (défaut Étudiant). */
export default function RegisterChoiceRedirect() {
  return <Redirect href="/(auth)/register" />;
}
