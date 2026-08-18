export function validateName(name: string): string | null {
  if (!name.trim()) {
    return 'name is invalid';
  }
  return null;
}

export function validateEmail(email: string): string | null {
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return 'email is invalid';
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return 'password is invalid';
  }
  return null;
}
