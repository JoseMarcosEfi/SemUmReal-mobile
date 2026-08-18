type UnauthorizedListener = () => void;

let onUnauthorized: UnauthorizedListener | null = null;

export function setOnUnauthorized(listener: UnauthorizedListener | null): void {
  onUnauthorized = listener;
}

export function notifyUnauthorized(): void {
  onUnauthorized?.();
}
