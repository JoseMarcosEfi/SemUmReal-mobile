/** Espelha `src/styles.scss` do Angular (`--color-*`, `--space-*`, fonte pixel). */

export const color = {
  ink: '#111111',
  paper: '#ffffff',
  muted: '#6b6b6b',
  panel: '#3a3a3a',
  stage: '#cfcfcf',
  line: '#111111',
  /** Céu da arte do login (`login-game.jpg`). */
  loginSky: '#E3E3E3',
} as const;

export const space = {
  1: 8,
  2: 16,
  3: 24,
  4: 32,
} as const;

/** Múltiplos de 8 — Press Start 2P fica nítida assim. */
export const fontSize = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
} as const;

export const iconSize = {
  sm: 16,
  md: 24,
  lg: 48,
} as const;

export const border = {
  width: 2,
  thick: 3,
} as const;

export const layout = {
  tabBarHeight: 72,
} as const;

export const letterSpacing = {
  tight: 0.02,
  wide: 0.04,
} as const;

/** Nome registrado pelo `@expo-google-fonts/press-start-2p`. */
export const fontFamily = {
  pixel: 'PressStart2P_400Regular',
} as const;

export const tokens = {
  color,
  space,
  fontSize,
  iconSize,
  border,
  layout,
  letterSpacing,
  fontFamily,
} as const;

export type Tokens = typeof tokens;
