import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_PORT = 8080;
const API_PATH = '/semumreal';

/**
 * Base URL local: `server.servlet.context-path=/semumreal` na porta 8080.
 *
 * Resolvida na hora do request (hostUri do Expo Go pode não existir no import).
 * Override: `EXPO_PUBLIC_API_URL=http://IP:8080/semumreal`
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
  if (fromEnv) {
    return fromEnv;
  }

  const metroHost = getMetroHost();
  if (metroHost && !isLoopback(metroHost)) {
    return `http://${metroHost}:${API_PORT}${API_PATH}`;
  }

  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${host}:${API_PORT}${API_PATH}`;
}

function getMetroHost(): string | null {
  const candidates = [
    Constants.expoConfig?.hostUri,
    Constants.linkingUri,
  ];

  for (const candidate of candidates) {
    const host = hostFromUri(candidate);
    if (host) {
      return host;
    }
  }

  return null;
}

function hostFromUri(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    const withProtocol = value.includes('://') ? value : `http://${value}`;
    const hostname = new URL(withProtocol).hostname;
    return hostname || null;
  } catch {
    const host = value.split(':')[0];
    return host || null;
  }
}

function isLoopback(host: string): boolean {
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}
