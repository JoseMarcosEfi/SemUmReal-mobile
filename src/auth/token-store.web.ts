const TOKEN_KEY = 'auth.token';

export async function getToken(): Promise<string | null> {
  return sessionStorage.getItem(TOKEN_KEY);
}

export async function saveToken(token: string): Promise<void> {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export async function deleteToken(): Promise<void> {
  sessionStorage.removeItem(TOKEN_KEY);
}
