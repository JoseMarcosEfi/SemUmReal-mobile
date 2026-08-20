import { ApiError } from '../../../api/http';
import { toAuthErrorMessage } from '../auth-errors';

describe('toAuthErrorMessage', () => {
  it('traduz conflito 409 para o aviso de conta com senha', () => {
    expect(toAuthErrorMessage(new ApiError(409, 'Conflict'), 'fallback')).toBe(
      'Este e-mail já tem conta com senha. Entre com e-mail e senha.',
    );
  });

  it('usa a mensagem do ApiError nos demais status', () => {
    expect(toAuthErrorMessage(new ApiError(401, 'Credenciais inválidas'), 'fallback')).toBe(
      'Credenciais inválidas',
    );
  });

  it('usa o fallback quando o erro não é ApiError', () => {
    expect(toAuthErrorMessage(new Error('boom'), 'Não foi possível entrar')).toBe(
      'Não foi possível entrar',
    );
    expect(toAuthErrorMessage('texto', 'Não foi possível entrar')).toBe('Não foi possível entrar');
  });
});
