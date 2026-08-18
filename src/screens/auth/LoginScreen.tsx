import { useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { ApiError } from '../../api/http';
import { useAuth } from '../../auth/auth-context';
import { color, space } from '../../theme';
import { AuthButton, AuthError, AuthField, AuthGoogleButton, AuthLayout, AuthLink } from './auth-layout';
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
      backgroundColor={color.loginSky}
      footer={<AuthLink label="CRIAR CONTA" onPress={onGoToRegister} />}
      banner={
        <Image
          source={require('../../../assets/login-game.jpg')}
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
      <AuthGoogleButton />
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
