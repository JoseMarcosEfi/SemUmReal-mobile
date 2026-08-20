import { validateEmail, validateName, validatePassword } from '../validation';

describe('validateName', () => {
  it('rejeita nome vazio', () => {
    expect(validateName('')).toBe('name is invalid');
    expect(validateName('   ')).toBe('name is invalid');
  });

  it('aceita nome preenchido', () => {
    expect(validateName('Ana')).toBeNull();
  });
});

describe('validateEmail', () => {
  it('rejeita e-mail vazio', () => {
    expect(validateEmail('')).toBe('email is invalid');
    expect(validateEmail('   ')).toBe('email is invalid');
  });

  it('rejeita e-mail malformado', () => {
    expect(validateEmail('sem-arroba')).toBe('email is invalid');
    expect(validateEmail('a@b')).toBe('email is invalid');
  });

  it('aceita e-mail válido', () => {
    expect(validateEmail('ana@exemplo.com')).toBeNull();
    expect(validateEmail('  ana@exemplo.com  ')).toBeNull();
  });
});

describe('validatePassword', () => {
  it('rejeita senha com menos de 8 caracteres', () => {
    expect(validatePassword('')).toBe('password is invalid');
    expect(validatePassword('1234567')).toBe('password is invalid');
  });

  it('aceita senha com 8 ou mais caracteres', () => {
    expect(validatePassword('12345678')).toBeNull();
  });
});
