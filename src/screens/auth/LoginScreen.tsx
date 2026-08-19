import { useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { useAuth } from '../../auth/auth-context';
import { useGoogleIdTokenRequest } from '../../auth/use-google-id-token';
import { color } from '../../theme';
import { toAuthErrorMessage } from './auth-errors';
import { AuthButton, AuthError, AuthField, AuthGoogleButton, AuthLayout, AuthLink } from './auth-layout';
import { validateEmail, validatePassword } from './validation';

type LoginScreenProps = {
  onGoToRegister: () => void;
};

export function LoginScreen({ onGoToRegister }: LoginScreenProps) {
  const { signIn, signInWithGoogle } = useAuth();
  const { prompt: promptGoogle, isReady: googleReady } = useGoogleIdTokenRequest();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    setRefreshing(true);
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setRefreshing(false);
  }

  async function onSubmit() {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const message = emailError ?? passwordError;
    if (message) {
      setError(message);
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await signIn(email, password);
    } catch (caught) {
      setError(toAuthErrorMessage(caught, 'Não foi possível entrar'));
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setGoogleBusy(true);
    setError(null);
    try {
      const result = await promptGoogle();
      if (result.type === 'cancelled') {
        return;
      }
      if (result.type === 'error') {
        setError(result.message);
        return;
      }
      await signInWithGoogle(result.idToken);
    } catch (caught) {
      setError(toAuthErrorMessage(caught, 'Não foi possível entrar com o Google'));
    } finally {
      setGoogleBusy(false);
    }
  }

  return (
    <AuthLayout
      backgroundColor={color.loginSky}
      refreshing={refreshing}
      onRefresh={() => {
        void onRefresh();
      }}
      footer={<AuthLink label="CRIAR CONTA" onPress={onGoToRegister} />}
      banner={
        <Image
          source={require('../../assets/login-game.jpg')}
          accessibilityLabel="Protótipo do joguinho"
          resizeMode="cover"
          style={styles.gameArt}
        />
      }
    >
      <AuthField
        label="E-MAIL"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        editable={!busy && !googleBusy}
      />
      <AuthField
        label="SENHA"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
        textContentType="password"
        editable={!busy && !googleBusy}
      />
      <AuthError message={error} />
      <AuthButton
        label={busy ? 'ENTRANDO...' : 'ENTRAR'}
        onPress={onSubmit}
        disabled={busy || googleBusy}
      />
      <AuthGoogleButton
        onPress={() => {
          void onGoogle();
        }}
        disabled={!googleReady || busy}
        busy={googleBusy}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  gameArt: {
    width: '120%',
    height: '50%',
    marginLeft: -40,
    marginTop: 80,
    marginBottom: 10,
  },
});
