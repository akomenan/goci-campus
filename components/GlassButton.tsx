import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';
import { Theme } from '@/constants/theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  busy?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  style?: ViewStyle;
};

export function GlassButton({
  label,
  onPress,
  disabled,
  busy,
  variant = 'primary',
  style,
}: Props) {
  const v = styles[variant];
  const textColor =
    variant === 'primary' || variant === 'danger' ? '#fff' : Theme.colors.primaryDark;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || busy}
      style={({ pressed }) => [
        styles.base,
        v,
        (disabled || busy) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}>
      {busy ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Theme.radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.glass,
  },
  primary: {
    backgroundColor: 'rgba(13,148,136,0.88)',
    borderColor: 'rgba(255,255,255,0.35)',
  },
  secondary: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderColor: 'rgba(13,148,136,0.25)',
  },
  danger: {
    backgroundColor: 'rgba(220,38,38,0.88)',
    borderColor: 'rgba(255,255,255,0.35)',
  },
  ghost: {
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  label: { fontWeight: '800', fontSize: 15, letterSpacing: 0.2 },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});
