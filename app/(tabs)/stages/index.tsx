import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/theme';

export default function Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stages & emplois</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.md,
  },
  title: { fontSize: 22, fontWeight: '800', color: Theme.colors.text },
});
