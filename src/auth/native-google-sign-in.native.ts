import type { GoogleIdTokenResult } from './google-id-token';

export async function requestNativeGoogleIdToken(webClientId: string): Promise<GoogleIdTokenResult> {
  const { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } = await import(
    '@react-native-google-signin/google-signin'
  );

  GoogleSignin.configure({ webClientId });

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    if (!isSuccessResponse(response)) {
      return { type: 'cancelled' };
    }

    const idToken = response.data.idToken;
    if (!idToken) {
      return { type: 'error', message: 'Não foi possível obter o token do Google' };
    }

    return { type: 'success', idToken };
  } catch (error) {
    if (isErrorWithCode(error)) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return { type: 'cancelled' };
      }
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        return { type: 'error', message: 'Google Play Services indisponível neste dispositivo' };
      }
      if (error.code === 'DEVELOPER_ERROR' || error.code === '10') {
        return {
          type: 'error',
          message:
            'Google Sign-In mal configurado. Confira o pacote com.jmarcos.semumreal e o SHA-1 no cliente Android.',
        };
      }
    }

    return { type: 'error', message: 'Não foi possível entrar com o Google' };
  }
}

export async function signOutNativeGoogle(): Promise<void> {
  try {
    const { GoogleSignin } = await import('@react-native-google-signin/google-signin');
    await GoogleSignin.signOut();
  } catch {
    // Expo Go / módulo nativo ausente: o JWT local ainda é apagado pelo AuthProvider.
  }
}
