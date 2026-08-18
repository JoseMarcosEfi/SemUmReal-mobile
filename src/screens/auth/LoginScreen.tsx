import { useState } from 'react';
import { ApiError } from '../../api/http';
import { useAuth } from '../../auth/auth-context';
import { AuthButton, AuthError, AuthField, AuthLayout, AuthLink } from './auth-layout';
import { validateEmail, validatePassword } from './validation';

type LoginScreenProps = {
  onGoToRegister: () => void;
};

export function LoginScreen({ onGoToRegister }: LoginScreenProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
      setError(caught instanceof ApiError ? caught.message : 'Não foi possível entrar');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      footer={<AuthLink label="CRIAR CONTA" onPress={onGoToRegister} />}
    >
      <AuthField
        label="E-MAIL"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        editable={!busy}
      />
      <AuthField
        label="SENHA"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
        textContentType="password"
        editable={!busy}
      />
      <AuthError message={error} />
      <AuthButton label={busy ? 'ENTRANDO...' : 'ENTRAR'} onPress={onSubmit} disabled={busy} />
    </AuthLayout>
  );
}
