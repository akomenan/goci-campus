import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/theme';
import type { TodoItem as Todo } from '@/data/todos';

export function TodoItemRow({ item }: { item: Todo }) {
  return (
    <View style={styles.row}>
      <View style={[styles.check, item.done && styles.checkDone]}>
        {item.done ? <Text style={styles.checkMark}>✓</Text> : null}
      </View>
      <Text style={[styles.label, item.done && styles.labelDone]}>{item.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: { backgroundColor: Theme.colors.primary, borderColor: Theme.colors.primary },
  checkMark: { color: '#fff', fontWeight: '800', fontSize: 12 },
  label: { flex: 1, fontSize: 14, color: Theme.colors.text },
  labelDone: { color: Theme.colors.muted, textDecorationLine: 'line-through' },
});
