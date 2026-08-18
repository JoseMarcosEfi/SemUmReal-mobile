import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PixelIcon, type PixelIconName } from '../pixel-icon';
import { color, iconSize, layout, space } from '../../theme';

const TABS = [
  { name: 'home', label: 'Início' },
  { name: 'arrows-horizontal', label: 'Transações' },
  { name: 'plus-box', label: 'Novo' },
  { name: 'chart', label: 'Relatórios' },
  { name: 'user', label: 'Perfil' },
] as const satisfies ReadonlyArray<{ name: PixelIconName; label: string }>;

export type AppTab = (typeof TABS)[number]['name'];

type TabBarProps = {
  active?: AppTab;
  onTabPress?: (name: AppTab) => void;
};

export function TabBar({ active = 'home', onTabPress }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, space[1]) }]}>
      {TABS.map((tab) => (
        <Pressable
          key={tab.name}
          style={styles.item}
          accessibilityRole="button"
          accessibilityLabel={tab.label}
          accessibilityState={{ selected: tab.name === active }}
          onPress={() => onTabPress?.(tab.name)}
        >
          <PixelIcon
            name={tab.name}
            size={iconSize.md}
            fill={tab.name === active ? color.ink : color.muted}
            label={tab.label}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    minHeight: layout.tabBarHeight,
    paddingHorizontal: space[2],
    backgroundColor: color.paper,
    borderTopWidth: 2,
    borderTopColor: color.line,
  },
  item: {
    padding: space[1],
  },
});
