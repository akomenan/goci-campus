import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/theme';

type Props = {
  emoji: string;
  label: string;
  subtitle: string;
  onPress: () => void;
};

export function ShortcutButton({ emoji, label, subtitle, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85 }]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  emoji: { fontSize: 28, marginRight: 12 },
  label: { fontSize: 16, fontWeight: '700', color: Theme.colors.text },
  subtitle: { fontSize: 13, color: Theme.colors.muted, marginTop: 2 },
  chevron: { fontSize: 28, color: Theme.colors.primary, marginLeft: 8 },
});
