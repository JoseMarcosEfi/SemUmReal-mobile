import { SafeAreaProvider } from 'react-native-safe-area-context';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { ApiError } from '../../../api/http';
import { useAuth } from '../../../auth/auth-context';
import { useGoogleIdTokenRequest } from '../../../auth/use-google-id-token';
import { LoginScreen } from '../LoginScreen';

type AuthMocks = ReturnType<typeof useAuth>;

jest.mock('../../../auth/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../auth/use-google-id-token', () => ({
  useGoogleIdTokenRequest: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseGoogleIdTokenRequest = useGoogleIdTokenRequest as jest.MockedFunction<
  typeof useGoogleIdTokenRequest
>;

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function authValue(
  overrides: Partial<Pick<AuthMocks, 'signIn' | 'signInWithGoogle'>> = {},
): AuthMocks {
  return {
    user: null,
    token: null,
    isReady: true,
    isAuthenticated: false,
    signIn: jest.fn().mockResolvedValue(undefined),
    signInWithGoogle: jest.fn().mockResolvedValue(undefined),
    signUp: jest.fn().mockResolvedValue(undefined),
    signOut: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

async function renderLogin(onGoToRegister = jest.fn()) {
  await render(
    <SafeAreaProvider initialMetrics={safeAreaMetrics}>
      <LoginScreen onGoToRegister={onGoToRegister} />
    </SafeAreaProvider>,
  );
  return { onGoToRegister };
}

async function fillCredentials(email = 'ana@exemplo.com', password = '12345678') {
  await fireEvent.changeText(screen.getByLabelText('E-MAIL'), email);
  await fireEvent.changeText(screen.getByLabelText('SENHA'), password);
}

describe('<LoginScreen />', () => {
  const promptGoogle = jest.fn();

  beforeEach(() => {
    promptGoogle.mockReset();
    mockUseAuth.mockReturnValue(authValue());
    mockUseGoogleIdTokenRequest.mockReturnValue({
      prompt: promptGoogle,
      isReady: true,
    });
  });

  it('não chama signIn quando a validação falha', async () => {
    const signIn = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue(authValue({ signIn }));
    await renderLogin();

    await fireEvent.press(screen.getByRole('button', { name: 'ENTRAR' }));

    expect(await screen.findByText('email is invalid')).toBeOnTheScreen();
    expect(signIn).not.toHaveBeenCalled();
  });

  it('mostra erro de senha quando o e-mail é válido', async () => {
    const signIn = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue(authValue({ signIn }));
    await renderLogin();

    await fireEvent.changeText(screen.getByLabelText('E-MAIL'), 'ana@exemplo.com');
    await fireEvent.press(screen.getByRole('button', { name: 'ENTRAR' }));

    expect(await screen.findByText('password is invalid')).toBeOnTheScreen();
    expect(signIn).not.toHaveBeenCalled();
  });

  it('chama signIn com e-mail e senha válidos', async () => {
    const signIn = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue(authValue({ signIn }));
    await renderLogin();

    await fillCredentials();
    await fireEvent.press(screen.getByRole('button', { name: 'ENTRAR' }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('ana@exemplo.com', '12345678');
    });
  });

  it('mostra a mensagem da API quando o login falha', async () => {
    const signIn = jest.fn().mockRejectedValue(new ApiError(401, 'Credenciais inválidas'));
    mockUseAuth.mockReturnValue(authValue({ signIn }));
    await renderLogin();

    await fillCredentials();
    await fireEvent.press(screen.getByRole('button', { name: 'ENTRAR' }));

    expect(await screen.findByText('Credenciais inválidas')).toBeOnTheScreen();
  });

  it('mostra o fallback quando o erro não é ApiError', async () => {
    const signIn = jest.fn().mockRejectedValue(new Error('boom'));
    mockUseAuth.mockReturnValue(authValue({ signIn }));
    await renderLogin();

    await fillCredentials();
    await fireEvent.press(screen.getByRole('button', { name: 'ENTRAR' }));

    expect(await screen.findByText('Não foi possível entrar')).toBeOnTheScreen();
  });

  it('mostra ENTRANDO... e desabilita o botão enquanto o login está em andamento', async () => {
    let resolveSignIn: (() => void) | undefined;
    const signIn = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSignIn = resolve;
        }),
    );
    mockUseAuth.mockReturnValue(authValue({ signIn }));
    await renderLogin();

    await fillCredentials();
    const submit = fireEvent.press(screen.getByRole('button', { name: 'ENTRAR' }));

    expect(await screen.findByRole('button', { name: 'ENTRANDO...' })).toBeDisabled();

    await act(async () => {
      resolveSignIn?.();
    });
    await submit;

    expect(await screen.findByRole('button', { name: 'ENTRAR' })).toBeEnabled();
  });

  it('não chama signInWithGoogle quando o Google é cancelado', async () => {
    const signInWithGoogle = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue(authValue({ signInWithGoogle }));
    promptGoogle.mockResolvedValue({ type: 'cancelled' });
    await renderLogin();

    await fireEvent.press(screen.getByRole('button', { name: 'Login com Google' }));

    await waitFor(() => {
      expect(promptGoogle).toHaveBeenCalled();
    });
    expect(signInWithGoogle).not.toHaveBeenCalled();
    expect(screen.queryByText(/Não foi possível/)).toBeNull();
  });

  it('mostra a mensagem quando o Google retorna erro', async () => {
    const signInWithGoogle = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue(authValue({ signInWithGoogle }));
    promptGoogle.mockResolvedValue({
      type: 'error',
      message: 'Login com Google não está configurado',
    });
    await renderLogin();

    await fireEvent.press(screen.getByRole('button', { name: 'Login com Google' }));

    expect(await screen.findByText('Login com Google não está configurado')).toBeOnTheScreen();
    expect(signInWithGoogle).not.toHaveBeenCalled();
  });

  it('chama signInWithGoogle com o idToken em caso de sucesso', async () => {
    const signInWithGoogle = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue(authValue({ signInWithGoogle }));
    promptGoogle.mockResolvedValue({ type: 'success', idToken: 'google-token' });
    await renderLogin();

    await fireEvent.press(screen.getByRole('button', { name: 'Login com Google' }));

    await waitFor(() => {
      expect(signInWithGoogle).toHaveBeenCalledWith('google-token');
    });
  });

  it('dispara onGoToRegister ao tocar em CRIAR CONTA', async () => {
    const { onGoToRegister } = await renderLogin();

    await fireEvent.press(screen.getByRole('button', { name: 'CRIAR CONTA' }));

    expect(onGoToRegister).toHaveBeenCalledTimes(1);
  });
});
