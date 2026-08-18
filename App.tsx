import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/auth/auth-context';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { RegisterScreen } from './src/screens/auth/RegisterScreen';
import { HomeScreen } from './src/screens/home/HomeScreen';
import { color } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({ PressStart2P_400Regular });

  if (!fontsLoaded) {
    return <View style={styles.boot} />;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function AppShell() {
  const { isReady, isAuthenticated } = useAuth();

  if (!isReady) {
    return <View style={styles.boot} />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {isAuthenticated ? <HomeScreen /> : <AuthFlow />}
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

function AuthFlow() {
  const [screen, setScreen] = useState<'login' | 'register'>('login');

  if (screen === 'register') {
    return <RegisterScreen onGoToLogin={() => setScreen('login')} />;
  }

  return <LoginScreen onGoToRegister={() => setScreen('register')} />;
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
