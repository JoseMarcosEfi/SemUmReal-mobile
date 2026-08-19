import type { GoogleIdTokenResult } from './google-id-token';

export async function requestNativeGoogleIdToken(_webClientId: string): Promise<GoogleIdTokenResult> {
  return {
    type: 'error',
    message: 'Login nativo com Google não está disponível nesta plataforma',
  };
}

export async function signOutNativeGoogle(): Promise<void> {
  // Web / fallback: nada a fazer.
}
