import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/theme';
import type { AlertItem } from '@/data/alerts';

const typeColors: Record<AlertItem['type'], string> = {
  deadline: Theme.colors.warning,
  urgent: Theme.colors.danger,
  info: Theme.colors.primary,
};

const typeLabels: Record<AlertItem['type'], string> = {
  deadline: 'Échéance',
  urgent: 'Urgent',
  info: 'Info',
};

export function AlertCard({ item }: { item: AlertItem }) {
  const color = typeColors[item.type];
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.row}>
        <Text style={[styles.badge, { backgroundColor: color + '22', color }]}>
          {typeLabels[item.type]}
        </Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <Text style={styles.titre}>{item.titre}</Text>
      <Text style={styles.message}>{item.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
  },
  date: { color: Theme.colors.muted, fontSize: 12 },
  titre: { marginTop: 8, fontSize: 16, fontWeight: '700', color: Theme.colors.text },
  message: { marginTop: 4, fontSize: 14, color: Theme.colors.muted, lineHeight: 20 },
});
