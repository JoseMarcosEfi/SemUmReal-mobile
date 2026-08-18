import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../auth/auth-context';
import { TabBar } from '../../components/tab-bar/tab-bar';
import {
  color,
  fontFamily,
  fontSize,
  letterSpacing,
  space,
} from '../../theme';

type ProfileScreenProps = {
  onGoHome: () => void;
};

export function ProfileScreen({ onGoHome }: ProfileScreenProps) {
  const { signOut } = useAuth();

  return (
    <View style={styles.screen}>
      <View style={styles.body}>
        <Text style={styles.title}>SEMUMREAl</Text>
        <Text style={styles.subtitle}>PERFIL</Text>

        <Pressable
          onPress={() => {
            void signOut();
          }}
          accessibilityRole="button"
          accessibilityLabel="Sair"
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonLabel}>SAIR</Text>
        </Pressable>
      </View>

      <TabBar active="user" onTabPress={(tab) => tab === 'home' && onGoHome()} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.paper,
  },
  body: {
    flex: 1,
    paddingHorizontal: space[3],
    paddingTop: space[2],
  },
  title: {
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.md,
    color: color.ink,
    letterSpacing: letterSpacing.wide,
    marginBottom: space[1],
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.xs,
    color: color.muted,
    letterSpacing: letterSpacing.tight,
    marginBottom: space[4],
    textAlign: 'center',
  },
  button: {
    backgroundColor: color.ink,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: color.panel,
  },
  buttonLabel: {
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.sm,
    color: color.paper,
    letterSpacing: letterSpacing.wide,
  },
});
