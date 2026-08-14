import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { color, iconSize } from '../../theme';
import { iconPaths, type PixelIconName } from './icons';

type PixelIconProps = {
  name: PixelIconName;
  size?: number;
  fill?: string;
  label?: string;
};

export function PixelIcon({
  name,
  size = iconSize.md,
  fill = color.ink,
  label,
}: PixelIconProps) {
  return (
    <View
      accessible={!!label}
      accessibilityLabel={label}
      accessibilityRole={label ? 'image' : undefined}
      style={[styles.box, { width: size, height: size }]}
    >
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {iconPaths[name].map((d) => (
          <Path key={d} d={d} fill={fill} />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export type { PixelIconName };
