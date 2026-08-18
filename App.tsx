import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/auth/auth-context';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { RegisterScreen } from './src/screens/auth/RegisterScreen';
import { HomeScreen } from './src/screens/home/HomeScreen';
import { ProfileScreen } from './src/screens/profile/ProfileScreen';
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
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');

  if (!isReady) {
    return <View style={styles.boot} />;
  }

  const backgroundColor =
    !isAuthenticated && authScreen === 'login' ? color.loginSky : color.paper;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]} edges={['top', 'left', 'right']}>
      {isAuthenticated ? (
        <MainFlow />
      ) : authScreen === 'register' ? (
        <RegisterScreen onGoToLogin={() => setAuthScreen('login')} />
      ) : (
        <LoginScreen onGoToRegister={() => setAuthScreen('register')} />
      )}
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

function MainFlow() {
  const [screen, setScreen] = useState<'home' | 'profile'>('home');

  if (screen === 'profile') {
    return <ProfileScreen onGoHome={() => setScreen('home')} />;
  }

  return <HomeScreen onGoProfile={() => setScreen('profile')} />;
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
