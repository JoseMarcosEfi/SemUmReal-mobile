import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/home/HomeScreen';
import { color } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({ PressStart2P_400Regular });

  if (!fontsLoaded) {
    return <View style={styles.boot} />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <HomeScreen />
        <StatusBar style="dark" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: color.paper,
  },
  safe: {
    flex: 1,
    backgroundColor: color.paper,
  },
});
