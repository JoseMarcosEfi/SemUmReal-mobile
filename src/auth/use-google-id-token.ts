import { useCallback, useEffect, useMemo } from 'react';
import { Platform } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';
import { getGoogleWebClientId, isExpoGo, shouldUseNativeGoogleSignIn } from './google-config';
import type { GoogleIdTokenResult } from './google-id-token';
import { requestNativeGoogleIdToken } from './native-google-sign-in';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_DISCOVERY: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export type { GoogleIdTokenResult } from './google-id-token';

export function useGoogleIdTokenRequest() {
  const clientId = getGoogleWebClientId();
  const useNative = shouldUseNativeGoogleSignIn();
  const nonce = useMemo(() => Crypto.randomUUID(), []);
  const redirectUri = useMemo(
    () =>
      AuthSession.makeRedirectUri({
        scheme: 'semumreal',
        path: 'oauth',
      }),
    [],
  );

  const [request, , promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: clientId ?? 'unconfigured.apps.googleusercontent.com',
      redirectUri,
      responseType: AuthSession.ResponseType.IdToken,
      scopes: ['openid', 'profile', 'email'],
      prompt: AuthSession.Prompt.SelectAccount,
      extraParams: { nonce },
      usePKCE: false,
    },
    GOOGLE_DISCOVERY,
  );

  useEffect(() => {
    if (Platform.OS !== 'android' || useNative) {
      return;
    }
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, [useNative]);

  const prompt = useCallback(async (): Promise<GoogleIdTokenResult> => {
    if (!clientId) {
      return { type: 'error', message: 'Login com Google não está configurado' };
    }

    if (useNative) {
      return requestNativeGoogleIdToken(clientId);
    }

    if (isExpoGo()) {
      return {
        type: 'error',
        message:
          'Login com Google no celular precisa do app de desenvolvimento. Rode npm run android (não use o Expo Go).',
      };
    }

    if (!request) {
      return { type: 'error', message: 'Login com Google ainda está carregando' };
    }

    if (__DEV__) {
      console.log('[google] redirectUri', redirectUri);
    }

    const result = await promptAsync();
    if (result.type === 'cancel' || result.type === 'dismiss') {
      return { type: 'cancelled' };
    }
    if (result.type !== 'success') {
      return { type: 'error', message: 'Não foi possível entrar com o Google' };
    }

    const idToken = result.params.id_token;
    if (!idToken) {
      return { type: 'error', message: 'Não foi possível obter o token do Google' };
    }

    return { type: 'success', idToken };
  }, [clientId, promptAsync, redirectUri, request, useNative]);

  return {
    prompt,
    isReady: Boolean(clientId) && (useNative || isExpoGo() || request !== null),
  };
}
