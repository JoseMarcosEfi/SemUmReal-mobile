import { ApiError } from '../../api/http';

export function toAuthErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    if (error.status === 409) {
      return 'Este e-mail já tem conta com senha. Entre com e-mail e senha.';
    }
    return error.message;
  }
  return fallback;
}
