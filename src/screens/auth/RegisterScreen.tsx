import { useState } from 'react';
import { useAuth } from '../../auth/auth-context';
import { useGoogleIdTokenRequest } from '../../auth/use-google-id-token';
import { toAuthErrorMessage } from './auth-errors';
import { AuthButton, AuthError, AuthField, AuthGoogleButton, AuthLayout, AuthLink } from './auth-layout';
import { validateEmail, validateName, validatePassword } from './validation';

type RegisterScreenProps = {
  onGoToLogin: () => void;
};

export function RegisterScreen({ onGoToLogin }: RegisterScreenProps) {
  const { signUp, signInWithGoogle } = useAuth();
  const { prompt: promptGoogle, isReady: googleReady } = useGoogleIdTokenRequest();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  async function onSubmit() {
    const message =
      validateName(name) ?? validateEmail(email) ?? validatePassword(password);
    if (message) {
      setError(message);
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await signUp(name, email, password);
    } catch (caught) {
      setError(toAuthErrorMessage(caught, 'Não foi possível cadastrar'));
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
      footer={<AuthLink label="JÁ TENHO CONTA" onPress={onGoToLogin} />}
    >
      <AuthField
        label="NOME"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        editable={!busy && !googleBusy}
      />
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
        autoComplete="new-password"
        textContentType="newPassword"
        editable={!busy && !googleBusy}
      />
      <AuthError message={error} />
      <AuthButton
        label={busy ? 'CADASTRANDO...' : 'CADASTRAR'}
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
