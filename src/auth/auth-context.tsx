import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { fetchMe, login, loginWithGoogle, registerUser } from '../api/auth';
import { ApiError } from '../api/http';
import { setOnUnauthorized } from '../api/session';
import { shouldUseNativeGoogleSignIn } from './google-config';
import { signOutNativeGoogle } from './native-google-sign-in';
import { deleteToken, getToken, saveToken } from './token-store';
import type { LoginResponse, User } from './types';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isReady: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (idToken: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const signOut = useCallback(async () => {
    if (shouldUseNativeGoogleSignIn()) {
      await signOutNativeGoogle();
    }
    await deleteToken();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setOnUnauthorized(() => {
      void signOut();
    });

    void (async () => {
      try {
        const stored = await getToken();
        if (!stored) {
          return;
        }

        setToken(stored);

        try {
          setUser(await fetchMe());
        } catch (error) {
          if (error instanceof ApiError && error.status === 401) {
            await signOut();
          }
        }
      } finally {
        setIsReady(true);
      }
    })();

    return () => setOnUnauthorized(null);
  }, [signOut]);

  const persistSession = useCallback(async (response: LoginResponse) => {
    await saveToken(response.token);
    setToken(response.token);
    setUser(response.user);

    try {
      setUser(await fetchMe());
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        await deleteToken();
        setToken(null);
        setUser(null);
        throw error;
      }
    }
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      await persistSession(await login(email, password));
    },
    [persistSession],
  );

  const signInWithGoogle = useCallback(
    async (idToken: string) => {
      await persistSession(await loginWithGoogle(idToken));
    },
    [persistSession],
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      await registerUser(name, email, password);
      await signIn(email, password);
    },
    [signIn],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isReady,
      isAuthenticated: token !== null,
      signIn,
      signInWithGoogle,
      signUp,
      signOut,
    }),
    [isReady, signIn, signInWithGoogle, signOut, signUp, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
