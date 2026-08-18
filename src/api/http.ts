import { getToken } from '../auth/token-store';
import type { ErrorResponse } from '../auth/types';
import { getApiBaseUrl } from './config';
import { notifyUnauthorized } from './session';

const REQUEST_TIMEOUT_MS = 12_000;

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST';
  body?: unknown;
  auth?: boolean;
};

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const auth = options.auth ?? true;
  const headers: Record<string, string> = {};

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = await getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const url = `${getApiBaseUrl()}${path}`;
  const method = options.method ?? 'GET';

  if (__DEV__) {
    console.log('[api]', method, url);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
  } catch (error) {
    if (__DEV__) {
      console.log('[api] falhou', method, url, error);
    }
    throw new ApiError(0, connectionMessage(url, error));
  } finally {
    clearTimeout(timeoutId);
  }

  if (response.status === 401 && auth) {
    notifyUnauthorized();
  }

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function connectionMessage(url: string, error: unknown): string {
  const aborted =
    error instanceof Error && (error.name === 'AbortError' || error.message.includes('Aborted'));

  if (aborted) {
    return `Tempo esgotado ao conectar em ${url}`;
  }

  return `Não foi possível conectar à API (${url})`;
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as ErrorResponse;
    if (payload.message) {
      return payload.message;
    }
  } catch {
    // body vazio ou nao-JSON
  }

  return `Erro ${response.status}`;
}
