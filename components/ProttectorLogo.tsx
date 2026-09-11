import { StyleSheet, Text, type StyleProp, View, type ViewStyle } from 'react-native';

type Props = {
  height?: number;
  style?: StyleProp<ViewStyle>;
  /** Kept for compatibility; unused (text logo). */
  imageStyle?: unknown;
};

/** Wordmark texte — Goci Campus (Go CI + campus). */
export function ProttectorLogo({ height = 40, style }: Props) {
  const fontSize = Math.max(18, Math.round(height * 0.55));
  return (
    <View style={[styles.wrap, { height }, style]}>
      <Text
        style={[styles.wordmark, { fontSize, lineHeight: fontSize + 4 }]}
        accessibilityLabel="Goci Campus"
        numberOfLines={1}>
        Goci Campus
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
    backgroundColor: 'transparent',
  },
  wordmark: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
