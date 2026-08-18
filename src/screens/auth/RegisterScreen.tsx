import { useState } from 'react';
import { ApiError } from '../../api/http';
import { useAuth } from '../../auth/auth-context';
import { AuthButton, AuthError, AuthField, AuthLayout, AuthLink } from './auth-layout';
import { validateEmail, validateName, validatePassword } from './validation';

type RegisterScreenProps = {
  onGoToLogin: () => void;
};

export function RegisterScreen({ onGoToLogin }: RegisterScreenProps) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
      setError(caught instanceof ApiError ? caught.message : 'Não foi possível cadastrar');
    } finally {
      setBusy(false);
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
        editable={!busy}
      />
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
        autoComplete="new-password"
        textContentType="newPassword"
        editable={!busy}
      />
      <AuthError message={error} />
      <AuthButton
        label={busy ? 'CADASTRANDO...' : 'CADASTRAR'}
        onPress={onSubmit}
        disabled={busy}
      />
    </AuthLayout>
  );
}
