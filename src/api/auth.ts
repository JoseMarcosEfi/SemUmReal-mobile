import type { LoginResponse, User } from '../auth/types';
import { request } from './http';

export function registerUser(name: string, email: string, password: string): Promise<User> {
  return request<User>('/api/auth/register', {
    method: 'POST',
    auth: false,
    body: { name, email, password },
  });
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>('/api/auth/login', {
    method: 'POST',
    auth: false,
    body: { email, password },
  });
}

export function loginWithGoogle(idToken: string): Promise<LoginResponse> {
  return request<LoginResponse>('/api/auth/google', {
    method: 'POST',
    auth: false,
    body: { idToken },
  });
}

export function fetchMe(): Promise<User> {
  return request<User>('/api/auth/me');
}
