import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

export function getGoogleWebClientId(): string | null {
  const clientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
  return clientId ? clientId : null;
}

export function isExpoGo(): boolean {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}

export function shouldUseNativeGoogleSignIn(): boolean {
  return Platform.OS !== 'web' && !isExpoGo();
}
