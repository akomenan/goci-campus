import { Image, StyleSheet, type ImageStyle, type StyleProp, View, type ViewStyle } from 'react-native';

type Props = {
  height?: number;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

/** Wide PROTTECTOR wordmark — transparent PNG (white chrome + white swoosh). */
export function ProttectorLogo({ height = 40, style, imageStyle }: Props) {
  const width = Math.round(height * (1078 / 331));
  return (
    <View style={[styles.wrap, { height }, style]}>
      <Image
        source={require('../assets/images/prottector-logo.png')}
        style={[{ width, height }, imageStyle]}
        resizeMode="contain"
        accessibilityLabel="PROTTECTOR"
      />
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
});
